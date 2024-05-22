# Color Dropper

[Demo](https://color-dropper-ivory.vercel.app/)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Notes

`ColorDropper` with `useProxyCanvas` property and cached canvas image data consumes less CPU resources than without them.

## Current technical issues

The `ColorDropper` component does not work properly with Workers right now because of a function serialization problem. \
When we register a new worker via the `useWorker` property, we need to serialize and deserialize data for transferring between threads (image data back to the main thread frequently). \
This is where the problem with `render` functions and their closures comes up. Serialization works correctly only for functions without closures.

For example, this works correctly, because the `render` function does not have a closure with external variables:

```svelte
...
<ColorDropper useWorker>
  <Layer
    render={({ ctx }) => {
      const bounds = { x0: 160, y0: 160, x1: 480, y1: 480 };
      let { x0, y0, x1, y1 } = bounds;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'tomato';
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.globalAlpha = 1;
    }}
  />
</ColorDropper>
...
```

But this does not work, because the `render` function has an `imageSource` variable in the closure:

```svelte
...
<ColorDropper useWorker>
  <Layer
    render={({ ctx }) => {
      if (!imageSource) return;
      ctx.drawImage(imageSource, 0, 0, width, height);
    }}
  />
</ColorDropper>
...
```

## Examples

```svelte
...
<ColorDropper useProxyCanvas>
  <Layer
    render={({ ctx, width, height }) => {
      if (!imageSource) return;
      ctx.drawImage(imageSource, 0, 0, width, height);
    }}
  />
</ColorDropper>
...
```

```svelte
... const colors = ['tomato', 'goldenrod', 'mediumturquoise'];

<ColorDropper useProxyCanvas>
  {#each colors as color, i (color)}
    {@const c = (i + 1) * 85}
    <Layer
      render={({ ctx }) => {
        const bounds = { x0: c, y0: c, x1: c + 338, y1: c + 338 };
        const { x0, y0, x1, y1 } = bounds;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = color;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx.globalAlpha = 1;
      }}
    />
  {/each}
</ColorDropper>
...
```

```svelte
...
<ColorDropper useWorker>
  <Layer
    render={({ ctx }) => {
      const bounds = { x0: 160, y0: 160, x1: 480, y1: 480 };
      let { x0, y0, x1, y1 } = bounds;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'tomato';
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.globalAlpha = 1;
    }}
  />
</ColorDropper>
...
```
