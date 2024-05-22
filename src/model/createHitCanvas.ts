import { type HEX, type HitCanvasRenderingContext2D } from '.';
import { pickColor } from '../lib';

/**
 * Offscreen canvas settings for rendering optimization.
 */
const settings: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
  alpha: false,
};

/** A list of canvas context setters that we do not need to use on the offscreen canvas, so this allows to optimize rendering */
const EXCLUDED_SETTERS: Array<keyof HitCanvasRenderingContext2D> = [
  'shadowBlur',
  'globalCompositeOperation',
  'globalAlpha',
];

/**
 * Under the hood, we proxy all CanvasRenderingContext2D methods to a second, offscreen canvas.
 * When an event occurs on the main canvas, the color of the pixel at the event coordinates is read from the offscreen canvas and converted to HEX color code.
 * Also, this approach can be useful for identifying the corresponding layer using a unique fill and stroke color and then re-dispatch an event to the Layer component.
 * In general, multiple layered canvases for complex scenes is a possible optimization when some objects need to move or change frequently, while others remain relatively static.
 */
export function createHitCanvas(
  canvas: HTMLCanvasElement,
  contextSettings: CanvasRenderingContext2DSettings | undefined,
): HitCanvasRenderingContext2D {
  const context = canvas.getContext('2d', contextSettings);
  const hitCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const hitContext = hitCanvas.getContext('2d', settings) as unknown as HitCanvasRenderingContext2D;

  const hitCanvasObserver = new MutationObserver(() => {
    hitCanvas.width = canvas.width;
    hitCanvas.height = canvas.height;
  });

  hitCanvasObserver.observe(canvas, { attributeFilter: ['width', 'height'] });

  const getColor = (x: number, y: number, imageData: Uint8ClampedArray): HEX => {
    return pickColor(hitCanvas, hitContext, x, y, imageData);
  };

  const getImageData = (
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    settings?: ImageDataSettings | undefined,
  ): ImageData => {
    return hitContext.getImageData(sx, sy, sw, sh, settings);
  };

  return new Proxy(context as unknown as HitCanvasRenderingContext2D, {
    get(targetContext, property: keyof HitCanvasRenderingContext2D) {
      if (property === 'pickColor') {
        return getColor;
      }

      if (property === 'getImageData') {
        return getImageData;
      }

      const value = targetContext[property];

      if (typeof value !== 'function') {
        return value;
      }

      return (...args: unknown[]) => {
        (<Function>hitContext[property])(...args);
        return Reflect.apply(value, targetContext, args);
      };
    },

    set(targetContext, property: keyof HitCanvasRenderingContext2D, newValue) {
      (<HitCanvasRenderingContext2D>targetContext[property]) = newValue;

      if (!EXCLUDED_SETTERS.includes(property)) {
        (<HitCanvasRenderingContext2D>hitContext[property]) = newValue;
      }

      return true;
    },
  });
}
