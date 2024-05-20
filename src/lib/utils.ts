import canvasSize from 'canvas-size';
import type { HEX, RGB } from '.';

type F = (...args: unknown[]) => void;

export function rgbToHex([r, g, b]: Uint8ClampedArray | RGB): HEX {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function getMaxPixelRatio(
  width: number,
  height: number,
  target: number,
  decrement: number = 0.1,
): number {
  if (typeof window === 'undefined') return target;

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
