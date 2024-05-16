import {
  createHitCanvas,
  GeometryManager,
  type HitCanvasRenderingContext2D,
  type OriginalEvent,
} from '.';

export class RenderManager {
  canvas: HTMLCanvasElement| null = null;

  hitCtx: HitCanvasRenderingContext2D | null = null;

  hitCanvasObserver: MutationObserver | undefined;

  geometryManager: GeometryManager;

  imageData: ImageData | undefined

  constructor() {
    this.geometryManager = new GeometryManager();
  }

  init(canvas: HTMLCanvasElement) {
    const hitCanvas = new OffscreenCanvas(canvas.width, canvas.height);

    this.hitCanvasObserver = new MutationObserver(() => {
      hitCanvas.width = canvas.width;
      hitCanvas.height = canvas.height;
    });

    this.hitCanvasObserver.observe(canvas, { attributeFilter: ['width', 'height'] });
    this.hitCtx = createHitCanvas(canvas, hitCanvas);
    this.canvas = canvas;
  }

  render() {}

  clearRect(width: number, height: number) {
    if (!this.hitCtx) return;
    this.hitCtx.clearRect(0, 0, width, height);
  }

  async drawImage(image: HTMLImageElement) {
    if (!this.hitCtx || !this.canvas) return;
    const { width, height } = this.canvas

    const imageBitmap = await createImageBitmap(image);

    this.clearRect(width, height);
    this.hitCtx.drawImage(imageBitmap, 0, 0, width, height);
    this.imageData = this.hitCtx.getImageData(0, 0, width, height);
  }

  handlePick(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
  }

  handleMove(e: OriginalEvent) {
    const { x, y } = this.geometryManager.calculatePosition(e);
  }

  destroy() {
    this.hitCanvasObserver?.disconnect();
  }
}
