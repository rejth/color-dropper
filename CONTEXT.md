# Svelte Canvas Layer Engine

This context describes the language for a Svelte canvas rendering library centered on layered drawing and hit testing.

## Language

**Svelte Canvas Layer Engine**:
A Svelte library for composing ordered drawing units onto a canvas and inspecting the resulting pixels.
_Avoid_: Color dropper, component library

**Svelte 4**:
The only Svelte runtime generation supported by the first standalone release of the **Svelte Canvas Layer Engine**.
_Avoid_: Svelte-compatible, framework-agnostic

**Layer**:
An ordered drawing unit registered with the **Svelte Canvas Layer Engine**.
_Avoid_: Drawer, renderable, node

**Render Function**:
A **Layer** function that draws with the native canvas context and canvas metadata.
_Avoid_: Renderer helper, drawing API

**Worker Mode**:
An advanced mode where eligible **Layers** are drawn and inspected away from the main thread.
_Avoid_: Worker rendering, rendering-only worker

**Worker-Safe Layer**:
A **Layer** whose drawing and inspection behavior can be transferred to **Worker Mode** without relying on main-thread state.
_Avoid_: Closure-safe layer, serializable layer

**WorkerLayer**:
A component for declaring a **Worker-Safe Layer**.
_Avoid_: Layer with worker flag, worker drawer

**Worker Layer Data**:
Explicit data passed to a **WorkerLayer** so its **Render Function** does not depend on main-thread state.
_Avoid_: Closure state, implicit inputs

**Pixel Picking**:
Inspecting the rendered canvas at a point to identify the resulting color as a built-in engine feature.
_Avoid_: Color dropper UI, eyedropper tool

**Picked Pixel**:
The structured color result returned by **Pixel Picking**.
_Avoid_: Hex string

**Layer Hit Testing**:
Inspecting a point on the canvas to identify the topmost **Layer** rendered there.
_Avoid_: Camera, drawing helpers, scene navigation

**Layer Query**:
A direct request for the **Layer** at a point on the canvas.
_Avoid_: Event routing

**Layer Hit**:
The structured result returned by a **Layer Query**.
_Avoid_: Internal layer id

**Layer User Id**:
A user-provided optional identifier returned in a **Layer Hit**.
_Avoid_: Hit data, layer metadata

**Canvas Handle**:
The public component handle used to run **Layer Queries** and **Pixel Picking**.
_Avoid_: Controller object, event-only API

**Async Inspection**:
The rule that direct **Layer Queries** and **Pixel Picking** return asynchronously in every **Canvas Mode**.
_Avoid_: Mode-specific return types

**Layer Event**:
An optional Svelte event dispatched to the **Layer** identified by **Layer Hit Testing**.
_Avoid_: DOM event, always-on event handling

**Layer Event Detail**:
The data carried by a **Layer Event**, combining a **Layer Hit**, a point, and the original interaction event.
_Avoid_: Raw DOM event only

**Hit Buffer**:
A hidden canvas surface used to identify **Layers** during **Layer Hit Testing**.
_Avoid_: Visible canvas, render buffer

**Canvas Mode**:
The execution mode of a canvas: normal **Layer** mode or **Worker Mode**.
_Avoid_: Mixed mode

**Canvas**:
The component for normal **Layer** mode.
_Avoid_: MainCanvas

**WorkerCanvas**:
The component for **Worker Mode**.
_Avoid_: Canvas with worker flag

## Relationships

- A **Svelte Canvas Layer Engine** contains one or more **Layers**.
- A **Layer** has one **Render Function**.
- A **Svelte Canvas Layer Engine** supports **Svelte 4**.
- **Worker Mode** supports only **Worker-Safe Layers**.
- A **WorkerLayer** declares exactly one **Worker-Safe Layer**.
- A **WorkerLayer** receives **Worker Layer Data**.
- A **Svelte Canvas Layer Engine** provides **Pixel Picking**.
- **Pixel Picking** returns a **Picked Pixel**.
- A **Svelte Canvas Layer Engine** provides **Layer Hit Testing**.
- **Layer Hit Testing** supports **Layer Queries** and optional **Layer Events**.
- A **Layer Query** returns a **Layer Hit**.
- A **Layer Hit** includes the engine id and optional **Layer User Id**.
- A **Layer Event** carries a **Layer Event Detail**.
- A **Canvas Handle** exposes **Layer Queries** and **Pixel Picking**.
- A **Canvas Handle** uses **Async Inspection**.
- **Worker Mode** uses a render buffer and a **Hit Buffer**.
- A canvas has exactly one **Canvas Mode**.
- Normal **Layers** and **WorkerLayers** do not mix within the same canvas.
- **Canvas** contains normal **Layers**.
- **WorkerCanvas** contains **WorkerLayers**.
- **Canvas** and **WorkerCanvas** both support **Layer Queries** and **Layer Events**.

## Example dialogue

> **Dev:** "Is the color dropper the product?"
> **Domain expert:** "No — the **Svelte Canvas Layer Engine** is the product; color dropping is one use case built from **Layers**."

> **Dev:** "Should the first standalone release also support Svelte 5?"
> **Domain expert:** "No — **Svelte 4** is the supported runtime boundary for the first release."

> **Dev:** "Can every **Layer** use **Worker Rendering**?"
> **Domain expert:** "No — **Worker Mode** is an advanced mode for **Worker-Safe Layers** only."

> **Dev:** "Should ordinary **Layers** and **Worker-Safe Layers** share the same component?"
> **Domain expert:** "No — use **Layer** for normal Svelte rendering and **WorkerLayer** for **Worker Mode**."

> **Dev:** "How does a **WorkerLayer** receive changing values?"
> **Domain expert:** "Pass them as **Worker Layer Data**, not through closure state."

> **Dev:** "Is the color dropper toolbar part of the engine?"
> **Domain expert:** "No — the engine provides **Pixel Picking**; a color dropper UI can be built on top."

> **Dev:** "Is **Pixel Picking** just an example feature?"
> **Domain expert:** "No — **Pixel Picking** is built into the engine."

> **Dev:** "Does **Pixel Picking** return only a hex string?"
> **Domain expert:** "No — **Pixel Picking** returns a **Picked Pixel** with structured color data."

> **Dev:** "Does the engine own infinite-canvas navigation?"
> **Domain expert:** "No — the engine owns rendering and **Layer Hit Testing**; camera behavior belongs outside it."

> **Dev:** "Does a **Render Function** receive a custom drawing helper?"
> **Domain expert:** "No — a **Render Function** receives the native canvas context and canvas metadata."

> **Dev:** "Can users hit-test without enabling event routing?"
> **Domain expert:** "Yes — use a **Layer Query** for direct lookup, and enable **Layer Events** only when Svelte event dispatch is needed."

> **Dev:** "Does a **Layer Query** return only an internal id?"
> **Domain expert:** "No — a **Layer Query** returns a **Layer Hit** with user-facing layer information."

> **Dev:** "Does a **Layer Hit** include arbitrary hit metadata?"
> **Domain expert:** "No — v1 uses a **Layer User Id**; apps can look up their own state from that id."

> **Dev:** "Do **Layer Events** return a different layer identity shape than **Layer Queries**?"
> **Domain expert:** "No — **Layer Event Detail** includes the same **Layer Hit** shape plus interaction context."

> **Dev:** "How do users call hit testing directly?"
> **Domain expert:** "Use the **Canvas Handle** to run **Layer Queries** and **Pixel Picking**."

> **Dev:** "Are direct inspection methods synchronous in normal **Canvas**?"
> **Domain expert:** "No — use **Async Inspection** so **Canvas** and **WorkerCanvas** expose the same API."

> **Dev:** "Does **Worker Mode** use the visible canvas for hit testing?"
> **Domain expert:** "No — **Worker Mode** keeps a separate **Hit Buffer** for **Layer Hit Testing**."

> **Dev:** "Can one canvas mix normal **Layers** and **WorkerLayers**?"
> **Domain expert:** "No — each canvas has one **Canvas Mode** so rendering, ordering, and inspection stay coherent."

> **Dev:** "Should worker behavior be a flag on **Canvas**?"
> **Domain expert:** "No — use **WorkerCanvas** for **Worker Mode**."

> **Dev:** "Are **Layer Events** only for normal **Canvas**?"
> **Domain expert:** "No — **WorkerCanvas** also supports **Layer Queries** and **Layer Events**."

## Flagged ambiguities

- "Svelte 4 canvas engine" was clarified to mean **Svelte Canvas Layer Engine**, not a framework-agnostic engine or color dropper component library.
- "Renderer" was used to mean both the act of rendering and a drawing-helper class; resolved: the package owns rendering, but not a public drawing-helper class named Renderer.
- "Worker Rendering" was too narrow; resolved: the package needs **Worker Mode** for worker-backed rendering, **Layer Hit Testing**, and **Pixel Picking**.
