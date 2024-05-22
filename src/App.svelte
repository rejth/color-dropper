<script lang="ts">
  import { onMount } from 'svelte';
  import { ColorDropper, Layer, Spinner } from './ui';

  const settings: CanvasRenderingContext2DSettings = {
    willReadFrequently: true,
  };

  let imageSource: CanvasImageSource | null = null;

  onMount(async () => {
    const image = new Image();
    image.src = 'images/sea.jpg';

    image.onload = async () => {
      /**
       * ImageBitmaps can be transferred between different contexts (e.g., between the main thread and web workers)
       * without copying the image data, which saves memory and improves performance.
       * Also the trendering process is quicker compared to directly using other image objects like HTMLImageElement.
       */
      const imageBitmap = await createImageBitmap(image);
      imageSource = imageBitmap;
    };
  });
</script>

<main>
  {#if !imageSource}
    <div class="spinner">
      <Spinner />
    </div>
  {:else}
    <ColorDropper useProxyCanvas>
      <Layer
        render={({ ctx, width, height }) => {
          if (!imageSource) return;
          ctx.drawImage(imageSource, 0, 0, width, height);
        }}
      />
    </ColorDropper>
  {/if}
</main>

<style>
  .spinner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
