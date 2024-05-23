# Color Dropper

[Demo](https://color-dropper-ivory.vercel.app/) \
[Sandbox](https://stackblitz.com/~/github.com/rejth/color-dropper/)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Possible improvements

1. Don't scale images in `drawImage()`. \
Cache various image sizes on an offscreen canvas when loading instead of constantly scaling them in `drawImage()`.

## Current technical issues

The `ColorDropper` component does not work properly with Workers right now because of a function serialization problem. \
When we register a new worker via the `useWorker` property, we need to serialize and deserialize data for transferring between threads. \
This is where the problem with `render` functions and their closures comes up. \
Serialization works correctly only for functions without closures.

For example, this works correctly, because the `render` function does not have a closure with external variables:

```svelte
<ColorDropper useWorker>
  <Layer
    render={({ context }) => {
      const bounds = { x0: 160, y0: 160, x1: 480, y1: 480 };
      let { x0, y0, x1, y1 } = bounds;
      context.globalAlpha = 0.9;
      context.fillStyle = 'tomato';
      context.fillRect(x0, y0, x1 - x0, y1 - y0);
      context.globalAlpha = 1;
    }}
  />
</ColorDropper>
```

But this does not work, because the `render` function has a `doSomething` function and `variable` in the closure:

```svelte
<ColorDropper useWorker>
  <Layer
    render={({ context }) => {
      doSomething(variable)
    }}
  />
</ColorDropper>
```

## Examples

Without Worker:

```svelte
let imageSource: CanvasImageSource | null = null;

onMount(async () => {
  const image = new Image();
  image.src = 'images/your-image.jpg';

  image.onload = async () => {
    const imageBitmap = await createImageBitmap(image);
    imageSource = imageBitmap;
  };
});

<ColorDropper useProxyCanvas {imageSource}>
  <Layer
    render={({ context, width, height, imageSource }) => {
      if (!imageSource) return;
      context.drawImage(imageSource, 0, 0, width, height);
    }}
  />
</ColorDropper>
```

```svelte
const colors = ['tomato', 'goldenrod', 'mediumturquoise'];

<ColorDropper useProxyCanvas>
  {#each colors as color, i (color)}
    {@const c = (i + 1) * 85}
    <Layer
      render={({ context }) => {
        const bounds = { x0: c, y0: c, x1: c + 338, y1: c + 338 };
        const { x0, y0, x1, y1 } = bounds;
        context.globalAlpha = 0.9;
        context.fillStyle = color;
        context.fillRect(x0, y0, x1 - x0, y1 - y0);
        context.globalAlpha = 1;
      }}
    />
  {/each}
</ColorDropper>
```

With Worker:

```svelte
let imageSource: CanvasImageSource | null = null;

onMount(async () => {
  const image = new Image();
  image.src = 'images/your-image.jpg';

  image.onload = async () => {
    const imageBitmap = await createImageBitmap(image);
    imageSource = imageBitmap;
  };
});

<ColorDropper useWorker {imageSource}>
  <Layer
    render={({ context, width, height, imageSource }) => {
      if (!imageSource) return;
      context.drawImage(imageSource, 0, 0, width, height);
    }}
  />
</ColorDropper>
```

```svelte
<ColorDropper useWorker>
  <Layer
    render={({ context }) => {
      const bounds = { x0: 160, y0: 160, x1: 480, y1: 480 };
      let { x0, y0, x1, y1 } = bounds;
      context.globalAlpha = 0.9;
      context.fillStyle = 'tomato';
      context.fillRect(x0, y0, x1 - x0, y1 - y0);
      context.globalAlpha = 1;
    }}
  />
</ColorDropper>
```
