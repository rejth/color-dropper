import { writable, type Writable } from 'svelte/store';
import {
  BLACK,
  createHitCanvas,
  GeometryManager,
  WHITE,
  type CursorState,
  type HitCanvasRenderingContext2D,
  type LayerId,
  type OriginalEvent,
  type Render,
} from '.';

export class RenderManager {
  width?: number;
  height?: number;
  pixelRatio?: number;
  imageData?: ImageData;

  needsRedraw: boolean;
  frame: number | undefined;
  drawers: Map<LayerId, Render> = new Map();
  selectedColor: Writable<string> = writable(BLACK);
  cursor: Writable<CursorState> = writable({ x: 0, y: 0, color: BLACK });

  ctx: HitCanvasRenderingContext2D | null;
  geometryManager: GeometryManager;

  constructor(geometryManager: GeometryManager) {
    this.ctx = null;
    this.needsRedraw = true;
    this.geometryManager = geometryManager;

    this.render = this.render.bind(this);
  }

  init(canvas: HTMLCanvasElement, contextSettings: CanvasRenderingContext2DSettings | undefined) {
    this.ctx = createHitCanvas(canvas, contextSettings);
    this.startRenderLoop();
  }

  startRenderLoop() {
    this.render();
    this.frame = requestAnimationFrame(() => this.startRenderLoop());
  }

  addDrawer(layerId: LayerId, render: Render) {
    this.drawers.set(layerId, render);
  }

  removeDrawer(layerId: LayerId) {
    this.drawers.delete(layerId);
  }

  render() {
    const ctx = this.ctx!;
    const width = this.width!;
    const height = this.height!;
    const pixelRatio = this.pixelRatio!;

    if (this.needsRedraw) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      this.needsRedraw = false;
    }

    ctx.clearRect(0, 0, width, height);

    this.drawers.forEach((draw) => {
      draw({ ctx, width, height });
    });
  }

  redraw() {
    this.needsRedraw = true;
  }

  handlePick(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.ctx!.pickColor(x, y);
    this.selectedColor.set(hexCode);
  }

  handleMove(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.ctx!.pickColor(x, y);

    const cursorPosition = this.geometryManager.getCoordinates(e);
    this.cursor.set({ x: cursorPosition.x, y: cursorPosition.y, color: hexCode });
  }

  destroy() {
    cancelAnimationFrame(this.frame!);
  }
}
