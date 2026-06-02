# Add package guardrails examples and public surface cleanup

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add package guardrails, examples, and public-surface cleanup for the standalone **Svelte Canvas Layer Engine**. The package should demonstrate normal **Canvas** and **WorkerCanvas** use while keeping the public API focused on layered rendering, **Layer Hit Testing**, and **Pixel Picking**.

Use both source projects as reference material, but deliberately avoid importing stale experimental behavior: no camera behavior, no public drawing-helper renderer API, no color dropper toolbar/cursor UI, no mixed **Canvas Mode**, no debug FPS logging, and no demo-to-core coupling.

## Acceptance criteria

- [ ] The package public exports are limited to the agreed **Svelte Canvas Layer Engine** surface.
- [ ] Examples demonstrate normal **Canvas** rendering, **Layer Query**, **Layer Events**, and **Pixel Picking**.
- [ ] Examples demonstrate **WorkerCanvas**, **WorkerLayer**, **Worker Layer Data**, worker-backed **Layer Query**, and worker-backed **Pixel Picking**.
- [ ] The package does not expose camera behavior, pan/zoom behavior, or a public drawing-helper renderer API.
- [ ] The package does not include color dropper toolbar or cursor UI.
- [ ] The package prevents or clearly rejects mixed normal **Layers** and **WorkerLayers** within one canvas.
- [ ] Debug FPS logging, broken FPS smoothing, and demo-to-core coupling from the experiments are absent.
- [ ] Tests or checks cover the intended public surface and the out-of-scope guardrails.

## Blocked by

- https://github.com/rejth/color-dropper/issues/2
- https://github.com/rejth/color-dropper/issues/6
