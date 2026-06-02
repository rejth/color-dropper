# Add WorkerCanvas Pixel Picking

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add worker-backed **Pixel Picking** to **WorkerCanvas**. A consumer should be able to bind the **Canvas Handle** and call async `pickPixel(x, y)` to receive the same structured **Picked Pixel** shape as normal **Canvas**, with pixel readback performed in **Worker Mode**.

Use `color-dropper` as reference material for worker-backed pixel readback, worker messaging, and color conversion. Keep the public result shape identical to normal **Canvas**.

## Acceptance criteria

- [ ] **WorkerCanvas** exposes an async `pickPixel(x, y)` method through the **Canvas Handle**.
- [ ] `pickPixel(x, y)` returns a **Picked Pixel** with `hex` and `rgba` values.
- [ ] Pixel picking works after **WorkerLayer** rendering.
- [ ] Pixel picking returns predictable data for known rendered colors.
- [ ] The public **Picked Pixel** shape matches normal **Canvas** pixel picking.
- [ ] Tests or verification cover worker-backed **Pixel Picking** behavior.

## Blocked by

- https://github.com/rejth/color-dropper/issues/6
