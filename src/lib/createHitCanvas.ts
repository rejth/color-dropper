import { rgbToHex, type HEX, type HitCanvasRenderingContext2D } from '.';

const offscreeSettings: CanvasRenderingContext2DSettings = {
  willReadFrequently: true,
};

const EXCLUDED_SETTERS: Array<keyof HitCanvasRenderingContext2D> = [
  'shadowBlur',
  'globalCompositeOperation',
  'globalAlpha',
];

export function createHitCanvas(
  canvas: HTMLCanvasElement,
  contextSettings: CanvasRenderingContext2DSettings | undefined,
): HitCanvasRenderingContext2D {
  const context = canvas.getContext('2d', contextSettings);
  const hitCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const hitContext = hitCanvas.getContext(
    '2d',
    offscreeSettings,
  ) as unknown as HitCanvasRenderingContext2D;

  const hitCanvasObserver = new MutationObserver(() => {
    hitCanvas.width = canvas.width;
    hitCanvas.height = canvas.height;
  });

  hitCanvasObserver.observe(canvas, { attributeFilter: ['width', 'height'] });

  const pickColor = (x: number, y: number, imageData: Uint8ClampedArray): HEX => {
    // If we do not have cached image data, we use offscreen canvas context to get underlying pixel data
    if (!imageData) {
      return rgbToHex(hitContext.getImageData(x, y, 1, 1).data);
    }
    // Calculate the index of the underlying pixel in the imageData array
    const index = (Math.floor(y) * hitCanvas.width + Math.floor(x)) * 4;
    return rgbToHex([imageData[index], imageData[index + 1], imageData[index + 2]]);
  };

  return new Proxy(context as unknown as HitCanvasRenderingContext2D, {
    get(targetContext, property: keyof HitCanvasRenderingContext2D) {
      if (property === 'pickColor') {
        return pickColor;
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
