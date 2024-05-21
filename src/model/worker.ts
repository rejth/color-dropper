import JSONfn from 'json-fn';
import { WorkerActionEnum, type LayerId, type Render, type WorkerEvent } from '.'
import { pickColor } from '../lib';

let offscreenCanvas: OffscreenCanvas | null = null;
let context: OffscreenCanvasRenderingContext2D | null = null;
let drawers: Map<LayerId, Render> = new Map();

let width: number | null = null;
let height: number | null = null;
let pixelRatio: number | null = null;
let frame: number | null = null;
let needsRedraw = true;

/**
 * Offscreen canvas settings for rendering optimization
 */
const settings: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

function startRenderLoop() {
  render();
  frame = requestAnimationFrame(() => startRenderLoop());
}

/**
 * The main render function which is responsible for drawing, clearing and canvas's transformation matrix adjustment.
 * */
function render() {
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
}

function parseDrawers(drawers: string): Map<LayerId, Render> {
  return new Map(JSONfn.parse(drawers));
}

self.onmessage = function (e: MessageEvent<WorkerEvent>) {
  const { action } = e.data;

  switch (action) {
    case WorkerActionEnum.INIT:
      offscreenCanvas = e.data.canvas;
      context = offscreenCanvas.getContext('2d', settings);

      drawers = parseDrawers(e.data.drawers);
      width = e.data.width;
      height = e.data.height;
      pixelRatio = e.data.pixelRatio;

      startRenderLoop();

      break;
    case WorkerActionEnum.RESIZE:
      if (!e.data.width || !e.data.height) break;
      drawers = parseDrawers(e.data.drawers);
      width = e.data.width;
      height = e.data.height;
      pixelRatio = e.data.pixelRatio;

      if (offscreenCanvas) {
        offscreenCanvas.width = width * pixelRatio;
        offscreenCanvas.height = height * pixelRatio;
      }

      needsRedraw = true;
      break;
    case WorkerActionEnum.UPDATE:
      drawers = parseDrawers(e.data.drawers);
      break;
    case WorkerActionEnum.GET_COLOR:
      self.postMessage({
        action: WorkerActionEnum.GET_COLOR,
        color: pickColor(offscreenCanvas!, context!, e.data.x, e.data.y),
        cursorPosition: e.data.cursorPosition,
      });
      break;
    case WorkerActionEnum.PICK_COLOR:
      self.postMessage({
        action: WorkerActionEnum.PICK_COLOR,
        color: pickColor(offscreenCanvas!, context!, e.data.x, e.data.y),
        cursorPosition: e.data.cursorPosition,
      });
      break;
  }
};

self.addEventListener('close', () => {
  cancelAnimationFrame(frame!);
});
