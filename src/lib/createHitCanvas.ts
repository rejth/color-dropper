import { rgbToHex, type HEX, type HitCanvasRenderingContext2D } from '.';

const settings: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

const EXCLUDED_SETTERS: Array<keyof HitCanvasRenderingContext2D> = [
  'filter',
  'shadowBlur',
  'globalCompositeOperation',
  'globalAlpha',
  'fillStyle',
  'strokeStyle',
];

export function createHitCanvas(
  canvas: HTMLCanvasElement,
  contextSettings: CanvasRenderingContext2DSettings | undefined,
): HitCanvasRenderingContext2D {
  const ctx = canvas.getContext('2d', contextSettings);

  const hitCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const hitCtx = hitCanvas.getContext('2d', settings) as unknown as HitCanvasRenderingContext2D;

  const hitCanvasObserver = new MutationObserver(() => {
    hitCanvas.width = canvas.width;
    hitCanvas.height = canvas.height;
  });
  hitCanvasObserver.observe(canvas, { attributeFilter: ['width', 'height'] });

  const pickColor = (x: number, y: number): HEX => {
    return rgbToHex(hitCtx.getImageData(x, y, 1, 1).data);
  };

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
