# Add normal Canvas Pixel Picking

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add built-in **Pixel Picking** to normal **Canvas**. A consumer should be able to bind the **Canvas Handle** and call async `pickPixel(x, y)` to receive a structured **Picked Pixel** with hex and RGBA data.

Use `color-dropper` as reference material for pixel readback and color conversion behavior. Keep this feature independent from color dropper toolbar or cursor UI.

## Acceptance criteria

- [ ] **Canvas** exposes an async `pickPixel(x, y)` method through the **Canvas Handle**.
- [ ] `pickPixel(x, y)` returns a **Picked Pixel** with `hex` and `rgba` values.
- [ ] Pixel picking works after normal **Layer** rendering.
- [ ] Pixel picking returns predictable data for known rendered colors.
- [ ] The implementation does not include color dropper toolbar or cursor UI.
- [ ] Tests verify **Pixel Picking** through the public **Canvas Handle**.

## Blocked by

- https://github.com/rejth/color-dropper/issues/2
