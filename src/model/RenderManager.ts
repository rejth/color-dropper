import { writable, type Writable } from 'svelte/store';
import {
  createHitCanvas,
  GeometryManager,
  type CursorState,
  type HitCanvasRenderingContext2D,
  type LayerId,
  type OriginalEvent,
  type Render } from '.'
import { BLACK } from '../lib';

export class RenderManager {
  width?: number;
  height?: number;
  pixelRatio?: number;
  frame?: number;

  context: HitCanvasRenderingContext2D | null;
  geometryManager: GeometryManager;

  imageData: ImageData | null;
  drawers: Map<LayerId, Render>;
  needsRedraw: boolean;
  needsCacheImage: boolean;

  selectedColor: Writable<string> = writable(BLACK);
  cursor: Writable<CursorState> = writable({ x: 0, y: 0, color: BLACK });

  constructor(geometryManager: GeometryManager) {
    this.context = null;
    this.imageData = null;
    this.drawers = new Map();
    this.needsRedraw = true;
    this.needsCacheImage = true;
    this.geometryManager = geometryManager;
    this.render = this.render.bind(this);
  }

  init(canvas: HTMLCanvasElement, contextSettings: CanvasRenderingContext2DSettings | undefined) {
    this.context = createHitCanvas(canvas, contextSettings);
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
    const context = this.context!;
    const width = this.width!;
    const height = this.height!;
    const pixelRatio = this.pixelRatio!;

    if (this.needsRedraw) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      this.needsRedraw = false;
    }

    context.clearRect(0, 0, width, height);

    this.drawers.forEach((draw) => {
      draw({ ctx: context, width, height });
    });

    if (this.needsCacheImage && width > 0 && height > 0) {
      this.imageData = context.getImageData(0, 0, width * pixelRatio, height * pixelRatio);
      this.needsCacheImage = false;
    }
  }

  redraw() {
    this.needsRedraw = true;
    this.needsCacheImage = true;
  }

  handlePick(e: OriginalEvent) {
    if (!this.imageData) return;

    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.context!.pickColor(x, y, this.imageData.data);
    this.selectedColor.set(hexCode);
  }

  handleMove(e: OriginalEvent) {
    if (!this.imageData) return;

    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.context!.pickColor(x, y, this.imageData.data);

    const cursorPosition = this.geometryManager.getCoordinates(e);
    this.cursor.set({ x: cursorPosition.x, y: cursorPosition.y, color: hexCode });
  }

  destroy() {
    cancelAnimationFrame(this.frame!);
  }
}
