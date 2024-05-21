import type { OriginalEvent, Point } from '.';

export class GeometryManager {
  pixelRatio: number = 2;
  defaultPoint: Point = { x: 0, y: 0 };

  getMouseCoordinates(e: MouseEvent | PointerEvent): Point {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }

  getTouchCoordinates(e: TouchEvent): Point {
    const { clientX, clientY } = e.changedTouches[0];
    return {
      x: clientX,
      y: clientY,
    };
  }

  getCoordinates(e: OriginalEvent): Point {
    if (window.TouchEvent && e instanceof TouchEvent) {
      return this.getTouchCoordinates(e);
    } else if (e instanceof MouseEvent) {
      return this.getMouseCoordinates(e);
    }

    return this.defaultPoint;
  }

  getMousePosition(e: MouseEvent | PointerEvent, rect: DOMRect): Point {
    const { x, y } = this.getMouseCoordinates(e);
    return {
      x: (x - rect.left) * this.pixelRatio,
      y: (y - rect.top) * this.pixelRatio,
    };
  }

  getTouchPosition(e: TouchEvent, rect: DOMRect): Point {
    const { x, y } = this.getTouchCoordinates(e);
    return {
      x: (x - rect.left) * this.pixelRatio,
      y: (y - rect.top) * this.pixelRatio,
    };
  }

  calculatePosition(e: OriginalEvent): Point {
    const rect = (<Element>e.target).getBoundingClientRect();

    if (window.TouchEvent && e instanceof TouchEvent) {
      return this.getTouchPosition(e, rect);
    } else if (e instanceof MouseEvent) {
      return this.getMousePosition(e, rect);
    }

    return this.defaultPoint;
  }
}
