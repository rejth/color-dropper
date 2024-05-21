import canvasSize from 'canvas-size';
import type { CanvasContextType, CanvasType, HEX, RGB } from '../model';

type F = (...args: unknown[]) => void;

export function rgbToHex([r, g, b]: Uint8ClampedArray | RGB): HEX {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function pickColor(
  canvas: CanvasType,
  context: CanvasContextType,
  x: number,
  y: number,
  imageData?: Uint8ClampedArray | undefined,
): HEX {
  /**
   * If we do not have a cached image data, we use offscreen canvas context to get underlying pixel data and convert it to HEX color code.
   */
  if (!imageData) {
    return rgbToHex(context.getImageData(x, y, 1, 1).data);
  }
  /**
   * Otherwise, read the pixel data from the cache to avoid heavy context.getImageData(x, y, 1, 1) operation.
   * 1. Calculate the index of the underlying pixel in the imageData array.
   * 2. Convert the RGB to HEX color code.
   */
  const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
  return rgbToHex([imageData[index], imageData[index + 1], imageData[index + 2]]);
}

export function getMaxPixelRatio(
  width: number,
  height: number,
  target: number,
  decrement: number = 0.1,
): number {
  if (typeof window === 'undefined') return target;

  /**
   * Canvas-size runs tests using a set of predefined size values for a variety of browser and platform combinations.
   * Tests validate the ability to read pixel data from canvas element of the predefined dimension by decreasing canvas height and/or width until a test succeeds.
   */
  while (!canvasSize.test({ sizes: [[width * target, height * target]] })) {
    target -= decrement;
  }

  return target;
}

export function throttle(fn: F, delay: number): F {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: unknown[];

  return function wrapper(this: typeof wrapper, ...args) {
    lastArgs = args;
    if (timer) return;

    fn.apply(this, args);

    timer = setTimeout(() => {
      timer = undefined;
      if (lastArgs !== args) {
        wrapper.apply(this, lastArgs);
      }
    }, delay);
  };
}
