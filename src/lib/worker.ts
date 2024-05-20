import JSONfn from 'json-fn';
import { WorkerActionEnum, rgbToHex, type HEX, type LayerId, type Render, type WorkerEvent } from '.';

let offscreenCanvas: OffscreenCanvas | null = null;
let context: OffscreenCanvasRenderingContext2D | null = null;
let drawers: Map<LayerId, Render> = new Map();

let width: number | null = null;
let height: number | null = null;
let pixelRatio: number | null = null;
let frame: number | null = null;
let needsRedraw = true;

const settings: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

const pickColor = (
  context: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  imageData?: Uint8ClampedArray,
): HEX => {
  // If we do not have cached image data, we use offscreen canvas context to get underlying pixel data
  if (!imageData) {
    return rgbToHex(context.getImageData(x, y, 1, 1).data);
  }
  // Calculate the index of the underlying pixel in the imageData array
  const index = (Math.floor(y) * offscreenCanvas!.width + Math.floor(x)) * 4;
  return rgbToHex([imageData[index], imageData[index + 1], imageData[index + 2]]);
};

self.onmessage = function (e: MessageEvent<WorkerEvent>) {
  const { action } = e.data;

  const startRenderLoop = () => {
    render();
    frame = requestAnimationFrame(() => startRenderLoop());
  };

  const render = () => {
    if (!context) return;
    width = width!;
    height = height!;
    pixelRatio = pixelRatio!;

    if (needsRedraw) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      needsRedraw = false;
    }

    context.clearRect(0, 0, width, height);

    drawers.forEach((draw) => {
      draw({ ctx: context!, width: width!, height: height! });
    });
  };

  switch (action) {
    case WorkerActionEnum.INIT:
      offscreenCanvas = e.data.canvas;
      drawers = new Map(JSONfn.parse(e.data.drawers));
      width = e.data.width;
      height = e.data.height;
      pixelRatio = e.data.pixelRatio;

      context = offscreenCanvas!.getContext('2d', settings);
      startRenderLoop();
      break;
    case WorkerActionEnum.RESIZE:
      if (!e.data.width || !e.data.height) break;

      drawers = new Map(JSONfn.parse(e.data.drawers));
      width = e.data.width;
      height = e.data.height;
      pixelRatio = e.data.pixelRatio;

      if (offscreenCanvas) {
        offscreenCanvas.width = width!;
        offscreenCanvas.height = height!;
      }

      needsRedraw = true;
      break;
    case WorkerActionEnum.UPDATE:
      drawers = new Map(JSONfn.parse(e.data.drawers));
      break;
    case WorkerActionEnum.GET_COLOR:
      self.postMessage({
        action: WorkerActionEnum.GET_COLOR,
        color: pickColor(context!, e.data.x, e.data.y),
        cursorPosition: e.data.cursorPosition,
      });
      break;
    case WorkerActionEnum.PICK_COLOR:
      self.postMessage({
        action: WorkerActionEnum.PICK_COLOR,
        color: pickColor(context!, e.data.x, e.data.y),
        cursorPosition: e.data.cursorPosition,
      });
      break;
  }
};

self.addEventListener('close', () => {
  cancelAnimationFrame(frame!);
});
