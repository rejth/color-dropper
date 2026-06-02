# Build standalone Canvas and Layer rendering package

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Create the standalone **Svelte Canvas Layer Engine** package in this repo under `packages/svelte-canvas-layer-engine`. The slice should prove that a Svelte 4 consumer can render ordered **Layers** through **Canvas**, with each **Render Function** receiving the native canvas context and canvas metadata.

Use `canvas-experiments` as reference material for the Svelte **Canvas** / **Layer** composition model and layer ordering behavior. Use it as a behavioral reference, not as a request to copy broader camera or drawing-helper APIs into the package.

## Acceptance criteria

- [ ] The repo contains a standalone package workspace for the **Svelte Canvas Layer Engine** under `packages/svelte-canvas-layer-engine`.
- [ ] The package exports **Canvas**, **Layer**, and public types needed to author a **Render Function**.
- [ ] A demo or verification consumer renders multiple **Layers** in component order.
- [ ] A **Render Function** receives the native canvas context, width, height, pixel ratio, and engine layer id.
- [ ] The package handles HiDPI sizing and supports the existing automatic pixel-ratio cap behavior.
- [ ] Tests verify public rendering behavior and layer ordering without depending on private implementation details.
- [ ] The package does not expose camera behavior, pan/zoom behavior, or a public drawing-helper renderer API.

## Blocked by

None - can start immediately
