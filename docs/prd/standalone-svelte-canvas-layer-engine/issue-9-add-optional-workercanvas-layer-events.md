# Add optional WorkerCanvas Layer Events

## Parent

https://github.com/rejth/color-dropper/issues/1

## What to build

Add optional **Layer Events** to **WorkerCanvas**. When event routing is enabled, pointer-style interactions on the visible canvas should ask **Worker Mode** which **WorkerLayer** is active, then dispatch Svelte **Layer Events** to that **WorkerLayer** with **Layer Event Detail**.

Use `canvas-experiments` as reference material for event semantics and synthesized enter/leave behavior. Use `color-dropper` as reference material for worker message request/response flow.

## Acceptance criteria

- [ ] **WorkerCanvas** can enable or disable **Layer Events**.
- [ ] **WorkerLayer** can receive pointer-style **Layer Events** when event routing is enabled.
- [ ] **Layer Event Detail** includes the **Layer Hit**, point, and original interaction event.
- [ ] Pointer enter and leave behavior is dispatched when the active **WorkerLayer** changes.
- [ ] Direct worker-backed **Layer Query** behavior continues to work without enabling event routing.
- [ ] Tests or verification cover worker-backed event dispatch behavior.

## Blocked by

- https://github.com/rejth/color-dropper/issues/7
