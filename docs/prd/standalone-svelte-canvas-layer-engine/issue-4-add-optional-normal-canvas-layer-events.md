# Add optional normal Canvas Layer Events

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add optional **Layer Events** to normal **Canvas**. When event routing is enabled, pointer-style interactions on the canvas should identify the active **Layer** through **Layer Hit Testing** and dispatch Svelte events to that **Layer** with **Layer Event Detail**.

Use `canvas-experiments` as reference material for layer event dispatching, synthesized enter/leave behavior, and event routing. Keep event routing optional so consumers can use direct **Layer Queries** without enabling **Layer Events**.

## Acceptance criteria

- [ ] Normal **Canvas** can enable or disable **Layer Events**.
- [ ] **Layer** can receive pointer-style **Layer Events** when event routing is enabled.
- [ ] **Layer Event Detail** includes the **Layer Hit**, point, and original interaction event.
- [ ] Pointer enter and leave behavior is dispatched when the active **Layer** changes.
- [ ] Direct **Layer Query** behavior continues to work without enabling event routing.
- [ ] Tests verify event dispatch using public Svelte component behavior.

## Blocked by

- https://github.com/rejth/color-dropper/issues/3
