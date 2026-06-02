## Problem Statement

The current canvas work is split across two experimental applications. One project has a Svelte component model for layered canvas rendering, layer ordering, layer events, and layer hit testing. The other project has worker-backed canvas rendering and pixel picking, but its public shape is still tied to a color dropper use case and has known limitations around serializing render functions with closure state.

The user wants a standalone **Svelte Canvas Layer Engine** package that combines the useful engine ideas from both projects without becoming an infinite-canvas application framework. The package should provide pure layered rendering, **Layer Hit Testing**, **Pixel Picking**, and worker-backed inspection primitives for Svelte 4 applications.

## Solution

Create a standalone Svelte 4 library focused on rendering and inspecting ordered canvas **Layers**.

The library exposes normal mode through **Canvas** and **Layer**, and **Worker Mode** through **WorkerCanvas** and **WorkerLayer**. Each canvas has exactly one **Canvas Mode**: normal **Layers** and **WorkerLayers** do not mix in the same canvas.

The library provides **Layer Hit Testing** and **Pixel Picking** as built-in features in both modes. Direct inspection uses **Async Inspection** through the **Canvas Handle**, so consumers can call the same methods whether they use **Canvas** or **WorkerCanvas**.

The library deliberately excludes built-in camera behavior, infinite-canvas navigation, shape drawing helpers, and a public drawing-helper renderer API. Consumers draw with the native canvas context supplied to each **Render Function**.

## User Stories

1. As a Svelte 4 developer, I want to install a standalone **Svelte Canvas Layer Engine**, so that I can use layered canvas rendering without copying code from experiments.
2. As a Svelte 4 developer, I want to compose **Layers** as Svelte components, so that canvas drawing fits naturally into my component tree.
3. As a Svelte 4 developer, I want **Layers** to render in component order, so that z-order is predictable from markup.
4. As a Svelte 4 developer, I want a **Layer** to register when mounted and unregister when destroyed, so that Svelte lifecycle controls the canvas scene.
5. As a Svelte 4 developer, I want a **Render Function** to receive the native canvas context, so that I can use the standard Canvas 2D API directly.
6. As a Svelte 4 developer, I want a **Render Function** to receive canvas metadata, so that I can draw relative to width, height, and pixel ratio.
7. As a Svelte 4 developer, I want the engine to handle HiDPI canvas sizing, so that drawings stay sharp across displays.
8. As a Svelte 4 developer, I want the engine to support automatic pixel-ratio capping, so that large canvases can avoid browser canvas-area limits.
9. As a Svelte 4 developer, I want to opt into **Layer Hit Testing**, so that I can identify which **Layer** is under a pointer.
10. As a Svelte 4 developer, I want to run a **Layer Query** directly, so that I can ask which **Layer** is at a point without enabling event routing.
11. As a Svelte 4 developer, I want a **Layer Query** to return a **Layer Hit**, so that I receive structured hit information instead of only an internal id.
12. As a Svelte 4 developer, I want **Layer Hit** to include an optional **Layer User Id**, so that I can connect hit results to my own app state.
13. As a Svelte 4 developer, I want **Layer Events**, so that pointer-style interactions can be handled directly on **Layer** components.
14. As a Svelte 4 developer, I want **Layer Event Detail** to include the **Layer Hit**, point, and original event, so that event handlers have enough context for app behavior.
15. As a Svelte 4 developer, I want **Layer Events** to be optional, so that canvases that only need direct queries do not pay event-routing complexity.
16. As a Svelte 4 developer, I want built-in **Pixel Picking**, so that I can inspect the rendered color at a point without building my own readback utility.
17. As a Svelte 4 developer, I want **Pixel Picking** to return a **Picked Pixel**, so that I can access both convenient hex color and raw RGBA channel data.
18. As a Svelte 4 developer, I want direct inspection methods to be async in every **Canvas Mode**, so that normal and worker-backed canvases share one public API.
19. As a Svelte 4 developer, I want to use `bind:this` as the **Canvas Handle**, so that I can call direct inspection methods from regular Svelte code.
20. As a Svelte 4 developer, I want a separate **WorkerCanvas**, so that entering **Worker Mode** is explicit in markup.
21. As a Svelte 4 developer, I want **WorkerLayer** to be separate from **Layer**, so that worker constraints are visible at the call site.
22. As a Svelte 4 developer, I want **WorkerLayer** to accept explicit **Worker Layer Data**, so that worker-safe rendering does not depend on closure state.
23. As a Svelte 4 developer, I want **Worker Mode** to support **Layer Hit Testing**, so that hit-test readback can happen away from the main thread.
24. As a Svelte 4 developer, I want **Worker Mode** to support **Pixel Picking**, so that pixel readback can happen away from the main thread.
25. As a Svelte 4 developer, I want **WorkerCanvas** to support **Layer Events**, so that worker-backed hit testing can still feel like Svelte component interaction.
26. As a Svelte 4 developer, I want **Worker Mode** to use a separate **Hit Buffer**, so that visible rendering and layer identification stay distinct.
27. As a Svelte 4 developer, I want the engine not to include camera behavior, so that I can build pan and zoom separately when my app needs them.
28. As a Svelte 4 developer, I want the engine not to include shape drawing helpers, so that the package stays focused and canvas-native.
29. As a library maintainer, I want the public package vocabulary to use **Layer**, **Layer Hit Testing**, **Pixel Picking**, **Worker Mode**, and **Canvas Mode**, so that the extracted package has stable language.
30. As a library maintainer, I want tests around public behavior rather than internals, so that implementation can evolve without rewriting brittle tests.

## Implementation Decisions

- Build a standalone Svelte 4 package for the **Svelte Canvas Layer Engine**.
- Use the existing Svelte layer composition model as the base: **Canvas** provides context, **Layer** registers a **Render Function**, and component order determines layer order.
- Create two top-level canvas components: **Canvas** for normal mode and **WorkerCanvas** for **Worker Mode**.
- Create two layer components: **Layer** for normal mode and **WorkerLayer** for **Worker-Safe Layers**.
- Enforce one **Canvas Mode** per canvas. Normal **Layers** and **WorkerLayers** do not mix in the same canvas.
- Expose direct inspection through the **Canvas Handle** using async methods for both modes.
- Provide **Layer Query** as a direct hit-test primitive.
- Provide **Layer Events** as an optional Svelte event layer on top of **Layer Hit Testing**.
- Return **Layer Hit** from direct layer queries.
- Allow an optional **Layer User Id** on **Layer** and **WorkerLayer**.
- Do not add arbitrary hit metadata in v1. Apps can look up their own state from the optional **Layer User Id**.
- Provide built-in **Pixel Picking**.
- Return **Picked Pixel** from pixel picking.
- Keep the **Render Function** canvas-native: it receives the native canvas context and canvas metadata, not a public drawing-helper renderer.
- Include HiDPI sizing and pixel-ratio handling in **Canvas** and **WorkerCanvas**.
- Use a hidden **Hit Buffer** for **Layer Hit Testing**.
- In **Worker Mode**, use a visible render buffer and a separate **Hit Buffer**.
- Make **WorkerLayer** use a `render` function plus explicit **Worker Layer Data** for v1.
- Treat worker function closure limitations as part of the **Worker-Safe Layer** contract: changing values must be passed explicitly as **Worker Layer Data**.
- Exclude infinite-canvas camera behavior.
- Exclude public drawing-helper renderer APIs.
- Exclude color dropper toolbar and cursor UI.
- Respect the architectural decision recorded in ADR-0001: extract a narrow Svelte rendering and hit-testing engine rather than a broader canvas app framework.

Prototype-derived type shapes that encode API decisions:

```ts
type RenderProps = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
  layerId: LayerId;
};

type WorkerRenderProps<TData> = RenderProps & {
  data: TData;
};

type LayerHit = {
  layerId: LayerId;
  id?: string;
};

type PickedPixel = {
  hex: string;
  rgba: [number, number, number, number];
};

type LayerEventDetail = {
  hit: LayerHit;
  point: { x: number; y: number };
  originalEvent: MouseEvent | PointerEvent | TouchEvent;
};
```

## Testing Decisions

- Tests should cover public behavior rather than private class structure.
- Test **Layer** registration and unregistration through component lifecycle behavior.
- Test layer order by rendering overlapping **Layers** and asserting the topmost **Layer Hit**.
- Test optional **Layer User Id** by asserting it appears in **Layer Hit** results.
- Test **Layer Query** directly through the **Canvas Handle**.
- Test **Layer Events** by dispatching pointer interactions and asserting event details contain the expected **Layer Hit** and point.
- Test **Pixel Picking** by rendering known colors and asserting the resulting **Picked Pixel**.
- Test **Async Inspection** by asserting both **Canvas** and **WorkerCanvas** inspection APIs return promises.
- Test **WorkerLayer** data updates by changing **Worker Layer Data** and asserting render/hit/pick behavior updates.
- Test that normal **Layers** and **WorkerLayers** cannot be mixed in the same canvas.
- Test that camera, pan, zoom, and public drawing-helper renderer APIs are absent from the package surface.
- Prefer small Svelte component integration tests for public component behavior.
- Prefer isolated unit tests for color conversion, layer id encoding/decoding, and hit-buffer lookup logic.
- There is little existing automated test prior art in the current repo, so this extraction should introduce a focused test harness for the package.

## Out of Scope

- Svelte 5 support.
- Framework-agnostic adapters.
- Infinite-canvas camera behavior.
- Pan and zoom controls.
- Shape drawing helper APIs.
- Text snapshot helpers.
- Background pattern helpers.
- Color dropper toolbar UI.
- Cursor UI.
- Mixing normal **Layers** and **WorkerLayers** within one canvas.
- Arbitrary hit metadata beyond optional **Layer User Id**.
- A module-based worker renderer contract.
- Registered worker-side renderer types.

## Further Notes

The package should use the language captured in `CONTEXT.md` and respect ADR-0001. The extraction should treat `canvas-experiments` as the stronger source for Svelte layer composition, layer ordering, layer events, and encoded-color **Layer Hit Testing**. It should treat `color-dropper` as the stronger source for **Worker Mode** exploration and **Pixel Picking**.

Before implementation, the existing debug FPS logging, broken FPS smoothing, and core-to-demo coupling found in the experimental engine should be avoided rather than copied into the standalone package.
