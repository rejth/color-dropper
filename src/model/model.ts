import type { RenderManager } from './RenderManager';
import type { RenderWorker } from './RenderWorker';

export type AppContext = {
  renderManager: RenderManager | RenderWorker;
};

export type CanvasType = HTMLCanvasElement | OffscreenCanvas;
export type CanvasContextType =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D
  | HitCanvasRenderingContext2D;
export type LayerId = string;
export type Point = { x: number; y: number };
export type RGB = [number, number, number];
export type HEX = string;
export type OriginalEvent = MouseEvent | PointerEvent;

export interface Render {
  (props: RenderProps): void;
}

export type RenderProps = {
  context: CanvasContextType;
  width: number;
  height: number;
  imageSource?: CanvasImageSource;
};

export interface HitCanvasRenderingContext2D extends Omit<CanvasRenderingContext2D, 'canvas'> {
  pickColor: (x: number, y: number, imageData?: Uint8ClampedArray | undefined) => HEX;
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

export type WorkerAction = 'init' | 'resize' | 'update' | 'getColor' | 'pickColor';

export enum WorkerActionEnum {
  INIT = 'init',
  RESIZE = 'resize',
  UPDATE = 'update',
  GET_COLOR = 'getColor',
  PICK_COLOR = 'pickColor',
}

export type WorkerEvent = {
  action: WorkerAction;
  canvas: OffscreenCanvas;
  drawers: string;
  imageSource: CanvasImageSource;
  x: number;
  y: number;
  width: number;
  height: number;
  pixelRatio: number;
  cursorPosition: Point;
  color: HEX;
};
