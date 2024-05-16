import type { OriginalEvent, Point } from './types';

export class GeometryManager {
  defaultPoint: Point = { x: 0, y: 0 };

  getMousePosition(e: MouseEvent | PointerEvent, rect: DOMRect): Point {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  getTouchPosition(e: TouchEvent, rect: DOMRect): Point {
    const { clientX, clientY } = e.changedTouches[0];
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  calculatePosition(e: OriginalEvent): Point {
    const rect = (<Element>e.target).getBoundingClientRect();

    if (window.TouchEvent && e instanceof TouchEvent) {
      return this.getTouchPosition(e, rect);
    } else if (e instanceof MouseEvent || e instanceof PointerEvent) {
      return this.getMousePosition(e, rect);
    }

    return this.defaultPoint;
  }
}
