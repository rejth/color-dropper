import { pickColor, type HitCanvasRenderingContext2D } from '.';

const options: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

const EXCLUDED_SETTERS: Array<keyof HitCanvasRenderingContext2D> = ['globalAlpha'];

export function createHitCanvas(
  canvas: HTMLCanvasElement,
  hitCanvas: OffscreenCanvas,
): HitCanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  const hitCtx = hitCanvas.getContext('2d', options) as unknown as HitCanvasRenderingContext2D;

  return new Proxy(ctx as unknown as HitCanvasRenderingContext2D, {
    get(targetCtx, property: keyof HitCanvasRenderingContext2D) {
      if (property === 'pickColor') {
        return pickColor;
      }

      const value = targetCtx[property];

      if (typeof value !== 'function') {
        return value;
      }

      return (...args: unknown[]) => {
        (<Function>hitCtx[property])(...args);
        return Reflect.apply(value, targetCtx, args);
      };
    },

    set(targetCtx, property: keyof HitCanvasRenderingContext2D, newValue) {
      (<HitCanvasRenderingContext2D>targetCtx[property]) = newValue;

      if (!EXCLUDED_SETTERS.includes(property)) {
        (<HitCanvasRenderingContext2D>hitCtx[property]) = newValue;
      }

      return true;
    },
  });
}
