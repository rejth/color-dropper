# Add basic WorkerCanvas and WorkerLayer rendering

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add basic **Worker Mode** rendering through **WorkerCanvas** and **WorkerLayer**. A Svelte 4 consumer should be able to render worker-safe layers using a `render` function and explicit **Worker Layer Data**, with rendering performed away from the main thread.

Use `color-dropper` as reference material for `OffscreenCanvas` transfer, worker setup, and the render serialization constraint. Keep this slice focused on worker rendering and the explicit worker contract; worker-backed **Layer Query**, **Layer Events**, and **Pixel Picking** are covered separately.

## Acceptance criteria

- [ ] The package exports **WorkerCanvas** and **WorkerLayer**.
- [ ] **WorkerCanvas** establishes **Worker Mode** using `OffscreenCanvas`.
- [ ] **WorkerLayer** accepts a `render` function and explicit **Worker Layer Data**.
- [ ] Updating **Worker Layer Data** updates rendered output.
- [ ] The API makes the **Worker-Safe Layer** contract explicit enough for users to avoid closure-state dependence.
- [ ] Normal **Layers** and **WorkerLayers** cannot be mixed within the same canvas.
- [ ] Tests or verification cover basic worker-backed rendering behavior.

## Blocked by

- https://github.com/rejth/color-dropper/issues/2
