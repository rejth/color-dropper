import type { RenderManager } from '.';

export type Context = {
  renderManager: RenderManager;
};

export type LayerId = string;
export type Point = { x: number; y: number };
export type RGB = [number, number, number];
export type HEX = string;
export type OriginalEvent = MouseEvent | PointerEvent | TouchEvent;

export interface Render {
  (props: RenderProps): void;
}

export type RenderProps = {
  ctx: HitCanvasRenderingContext2D;
  width: number;
  height: number;
};

export interface HitCanvasRenderingContext2D extends Omit<CanvasRenderingContext2D, 'canvas'> {
  pickColor: (x: number, y: number, imageData?: Uint8ClampedArray) => HEX;
}

export type CursorState = {
  x: number;
  y: number;
  color: HEX;
};

export type ResizeEvent = {
  resize: {
    width: number;
    height: number;
    pixelRatio: number;
  };
};
