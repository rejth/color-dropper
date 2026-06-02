# Add WorkerCanvas Layer Query with Hit Buffer

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add worker-backed **Layer Query** support to **WorkerCanvas**. A consumer should be able to bind the **Canvas Handle** and call async `getLayerAt(x, y)` to receive the same **Layer Hit** shape as normal **Canvas**, with hit lookup performed in **Worker Mode** using a separate **Hit Buffer**.

Use `canvas-experiments` as reference material for encoded layer ids and **Hit Buffer** lookup. Use `color-dropper` as reference material for worker messaging and off-main-thread canvas ownership.

## Acceptance criteria

- [ ] **WorkerCanvas** exposes an async `getLayerAt(x, y)` method through the **Canvas Handle**.
- [ ] **Worker Mode** maintains a visible render buffer and a separate **Hit Buffer**.
- [ ] `getLayerAt(x, y)` returns a **Layer Hit** with the same shape as normal **Canvas**.
- [ ] Overlapping **WorkerLayers** return the topmost rendered **Layer** according to component order.
- [ ] The optional **Layer User Id** is included when the hit **WorkerLayer** defines one.
- [ ] Empty canvas areas return a clear no-hit result.
- [ ] Tests or verification cover worker-backed **Layer Query** behavior.

## Blocked by

- https://github.com/rejth/color-dropper/issues/6
