import type { GeometryManager, RenderManager } from '.';

export interface HitCanvasRenderingContext2D extends Omit<CanvasRenderingContext2D, 'canvas'> {
  pickColor: (hitCtx: HitCanvasRenderingContext2D, point: Point) => string
}
export interface Render {
  (props: RenderProps): void;
}

export type Context = {
  renderManager: RenderManager;
};

export type Point = Pick<DOMRect, 'x' | 'y'>;
export type RGB = [number, number, number];
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
