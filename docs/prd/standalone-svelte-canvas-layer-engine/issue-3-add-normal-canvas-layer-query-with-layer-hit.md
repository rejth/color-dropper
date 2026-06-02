# Add normal Canvas Layer Query with Layer Hit

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add direct **Layer Query** support to normal **Canvas**. A consumer should be able to bind the **Canvas Handle** and call async `getLayerAt(x, y)` to receive a **Layer Hit** containing the engine layer id and optional **Layer User Id**.

Use `canvas-experiments` as reference material for encoded-color **Hit Buffer** behavior and topmost-layer lookup. Keep this slice focused on direct query behavior; optional **Layer Events** are covered separately.

## Acceptance criteria

- [ ] **Canvas** exposes an async `getLayerAt(x, y)` method through the **Canvas Handle**.
- [ ] `getLayerAt(x, y)` returns a **Layer Hit** with the engine layer id when a rendered **Layer** is present at the point.
- [ ] `getLayerAt(x, y)` includes the optional **Layer User Id** when the hit **Layer** defines one.
- [ ] Overlapping **Layers** return the topmost rendered **Layer** according to component order.
- [ ] Empty canvas areas return a clear no-hit result.
- [ ] Tests verify the public query behavior through the **Canvas Handle**.

## Blocked by

- https://github.com/rejth/color-dropper/issues/2
