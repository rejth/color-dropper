# Extract a Svelte Rendering and Hit Testing Engine

We will extract the canvas work into a standalone Svelte 4 package focused on layered rendering, layer hit testing, and pixel picking. The package will expose normal mode through `Canvas` and `Layer`, worker mode through `WorkerCanvas` and `WorkerLayer`, and will support asynchronous layer queries, layer events, and structured pixel picking in both modes. It will deliberately exclude infinite-canvas camera behavior and public drawing-helper renderer APIs so the package remains a small rendering and inspection primitive rather than a full canvas application framework.

**Considered Options**

- Extract the broader `canvas-experiments` core, including camera and drawing helpers.
- Extract only the `color-dropper` worker and pixel-picking implementation.
- Extract a narrower Svelte rendering and hit-testing engine that combines layer composition, worker-backed inspection, and pixel picking.

**Consequences**

Applications that need pan, zoom, shape helpers, or whiteboard behavior must build those concerns on top of the package. Worker mode is a first-class execution mode rather than a flag on normal canvas rendering, so normal layers and worker layers do not mix inside the same canvas.
