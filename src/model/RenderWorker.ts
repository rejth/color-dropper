import { get, writable, type Writable } from 'svelte/store';
import JSONfn from 'json-fn';
import {
  GeometryManager,
  WorkerActionEnum,
  type CursorState,
  type LayerId,
  type OriginalEvent,
  type Render,
  type WorkerEvent,
} from '.';
import { BLACK } from '../lib';
import Worker from './worker?worker';

export class RenderWorker {
  width?: number;
  height?: number;
  pixelRatio?: number;

  canvas: HTMLCanvasElement | null;
  imageSource:  CanvasImageSource | null;
  worker: Worker;
  geometryManager: GeometryManager;

  drawers: Writable<Map<LayerId, Render>> = writable(new Map());
  selectedColor: Writable<string> = writable(BLACK);
  cursor: Writable<CursorState> = writable({ x: 0, y: 0, color: BLACK });

  constructor(geometryManager: GeometryManager, imageSource: CanvasImageSource | null = null) {
    /**
     * Register a worker allowing to perform intensive operations without blocking the main thread.
     * But data transfering (image data back to the main thread frequently) can introduce overhead and latency due to the serialization and deserialization of data.
     */
    this.worker = new Worker();
    this.canvas = null;
    this.imageSource = imageSource;
    this.geometryManager = geometryManager;

    this.drawers.subscribe(() => {
      this.update();
    });
  }

  /**
   * Creates the offscreen canvas, transfer it to a worker and subscribe to the worker events.
   * Since ownership of the main canvas is transferred, it becomes available only to the worker.
   */
  init(canvas: HTMLCanvasElement, _contextSettings: CanvasRenderingContext2DSettings | undefined) {
    this.canvas = canvas;
    const offscreenCanvas = canvas.transferControlToOffscreen();

    this.worker.postMessage(
      {
        action: WorkerActionEnum.INIT,
        canvas: offscreenCanvas,
        imageSource: this.imageSource,
        drawers: this.stringifyDrawers(),
        width: this.width,
        height: this.height,
        pixelRatio: this.pixelRatio,
      },
      [offscreenCanvas],
    );

    this.worker.onmessage = (e: MessageEvent<WorkerEvent>) => {
      const { action, color, cursorPosition } = e.data;

      if (action === WorkerActionEnum.GET_COLOR) {
        const { x, y } = cursorPosition;
        this.cursor.set({ x, y, color });
      } else if (action === WorkerActionEnum.PICK_COLOR) {
        this.selectedColor.set(color);
      }
    };
  }

  stringifyDrawers() {
    return JSONfn.stringify(Array.from(get(this.drawers)));
  }

  resize() {
    this.worker.postMessage({
      action: WorkerActionEnum.RESIZE,
      drawers: this.stringifyDrawers(),
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    });
  }

  update() {
    this.worker.postMessage({
      action: WorkerActionEnum.UPDATE,
      drawers: this.stringifyDrawers(),
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    });
  }

  addDrawer(layerId: LayerId, render: Render) {
    this.drawers.update((drawers) => drawers.set(layerId, render));
  }

  removeDrawer(layerId: LayerId) {
    this.drawers.update((drawers) => {
      drawers.delete(layerId);
      return drawers;
    });
  }

  /**
   * Forces canvas's transformation matrix adjustment to scale drawings according to the new width, height or device's pixel ratio.
   */
  redraw() {
    this.resize();
  }

  /**
   * Handles "click" event on main canvas and sends the corresponding event to get the underlying pixel data from the offscreen canvas.
   */
  handlePick(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    this.worker.postMessage({
      action: WorkerActionEnum.PICK_COLOR,
      x,
      y,
      cursorPosition: { x, y },
    });
  }

  /**
   * Handles "move" event on the main canvas and sends the corresponding event to get the underlying pixel data from the offscreen canvas.
   */
  handleMove(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const cursorPosition = this.geometryManager.getCoordinates(e);
    this.worker.postMessage({ action: WorkerActionEnum.GET_COLOR, x, y, cursorPosition });
  }

  destroy() {
    this.worker.terminate();
  }
}
