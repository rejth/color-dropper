import type { GeometryManager, RenderManager } from '.';

export interface HitCanvasRenderingContext2D extends Omit<CanvasRenderingContext2D, 'canvas'> {
  pickColor: (x: number, y: number) => string;
}
export interface Render {
  (props: RenderProps): void;
}

export type Context = {
  renderManager: RenderManager;
};

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

export type Point = Pick<DOMRect, 'x' | 'y'>;
export type HEX = string;
export type RenderProps = { ctx: HitCanvasRenderingContext2D };
export type OriginalEvent = MouseEvent | PointerEvent | TouchEvent;
export type CanvasEvents =
  | 'click'
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'mouseenter'
  | 'mouseleave'
  | 'touchstart'
  | 'touchmove'
  | 'touchend'
  | 'touchcancel'
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointercancel'
  | 'pointerenter'
  | 'pointerleave';
