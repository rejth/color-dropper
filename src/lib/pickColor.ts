import type { HitCanvasRenderingContext2D, Point } from ".";

export function pickColor(hitCtx: HitCanvasRenderingContext2D, point: Point): string {
  const [r, g, b] = hitCtx.getImageData(point.x, point.y, 1, 1).data;
  return `rgb(${r},${g},${b})`;
}
