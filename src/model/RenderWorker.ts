import { get, writable, type Writable } from 'svelte/store';
import JSONfn from 'json-fn';
import {
  GeometryManager,
  WorkerActionEnum,
  type CursorState,
  type LayerId,
  type OriginalEvent,
  type Render,
  type WorkerEvent
} from '.';
import { BLACK } from '../lib';
import Worker from './worker?worker';

export class RenderWorker {
  width?: number;
  height?: number;
  pixelRatio?: number;

  worker: Worker;
  geometryManager: GeometryManager;

  drawers: Writable<Map<LayerId, Render>> = writable(new Map());
  selectedColor: Writable<string> = writable(BLACK);
  cursor: Writable<CursorState> = writable({ x: 0, y: 0, color: BLACK });

  constructor(geometryManager: GeometryManager) {
    this.worker = new Worker();
    this.geometryManager = geometryManager;

    this.drawers.subscribe(() => {
      this.update();
    });
  }

  init(canvas: HTMLCanvasElement, _contextSettings: CanvasRenderingContext2DSettings | undefined) {
    const offscreenCanvas = canvas.transferControlToOffscreen();

    this.worker.postMessage(
      {
        action: WorkerActionEnum.INIT,
        canvas: offscreenCanvas,
        drawers: JSONfn.stringify(Array.from(get(this.drawers))),
        width: this.width,
        height: this.height,
        pixelRatio: this.pixelRatio,
      },
      [offscreenCanvas],
    );

    this.worker.onmessage = (event: MessageEvent<WorkerEvent>) => {
      if (event.data.action === WorkerActionEnum.GET_COLOR) {
        const point = event.data.cursorPosition;
        this.cursor.set({ x: point.x, y: point.y, color: event.data.color });
      } else if (event.data.action === WorkerActionEnum.PICK_COLOR) {
        this.selectedColor.set(event.data.color);
      }
    };
  }

  stringifyDrawers() {
    return JSONfn.stringify(Array.from(get(this.drawers)))
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

  redraw() {
    this.resize();
  }

  handlePick(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    this.worker.postMessage({ action: WorkerActionEnum.PICK_COLOR, x, y, cursorPosition: { x, y } });
  }

  handleMove(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const cursorPosition = this.geometryManager.getCoordinates(e);
    this.worker.postMessage({ action: WorkerActionEnum.GET_COLOR, x, y, cursorPosition });
  }

  destroy() {
    this.worker.terminate();
  }
}
