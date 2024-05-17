import { writable, type Writable } from 'svelte/store';
import {
  createHitCanvas,
  GeometryManager,
  WHITE,
  type CursorState,
  type HitCanvasRenderingContext2D,
  type OriginalEvent,
} from '.';

export class RenderManager {
  width?: number;
  height?: number;
  pixelRatio?: number;
  imageData?: ImageData;

  selectedColor: Writable<string> = writable(WHITE);
  cursor: Writable<CursorState> = writable({ x: 0, y: 0, color: WHITE });

  hitCtx: HitCanvasRenderingContext2D | null;
  geometryManager: GeometryManager;

  constructor(geometryManager: GeometryManager) {
    this.hitCtx = null;
    this.geometryManager = geometryManager;
  }

  init(canvas: HTMLCanvasElement, contextSettings: CanvasRenderingContext2DSettings | undefined) {
    this.hitCtx = createHitCanvas(canvas, contextSettings);
  }

  render() {}

  redraw() {}

  clearRect(width: number, height: number) {
    this.hitCtx?.clearRect(0, 0, width, height);
  }

  async drawImage(image: HTMLImageElement) {
    const ctx = this.hitCtx!;
    const width = this.width!;
    const height = this.height!;
    const imageBitmap = await createImageBitmap(image);

    this.clearRect(width, height);
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    this.imageData = ctx.getImageData(0, 0, width, height);
  }

  handlePick(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.hitCtx!.pickColor(x, y);
    this.selectedColor.set(hexCode);
  }

  handleMove(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
    const hexCode = this.hitCtx!.pickColor(x, y);

    const pointerPosition = this.geometryManager.getCoordinates(e);
    this.cursor.set({ x: pointerPosition.x, y: pointerPosition.y, color: hexCode });
  }
}
