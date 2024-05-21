<script lang="ts">
  import { onMount } from 'svelte';
  import { ColorDropper, Layer, Spinner } from './ui';

  let imageSource: CanvasImageSource | null = null;

  onMount(async () => {
    const image = new Image();
    image.src = 'images/sea.jpg';

    image.onload = async () => {
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
    <ColorDropper useWorker={false}>
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
