<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte';
  import {
    type HitCanvasRenderingContext2D,
    type OriginalEvent,
    RenderManager,
    type Context,
    KEY,
  } from '../lib/';

  export let width: number;
  export let height: number;
  export let className: string;

  export const getCanvasElement = (): HTMLCanvasElement => canvas;
  export const getCanvasContext = (): HitCanvasRenderingContext2D | null => renderManager.hitCtx;

  const renderManager = new RenderManager();
  let canvas: HTMLCanvasElement;

  setContext<Context>(KEY, {
    renderManager,
  });

  onMount(() => {
    renderManager.init(canvas);
    drawImage();
  });

  onDestroy(() => {
    renderManager.destroy();
  });

  const drawImage = () => {
    const image = new Image();
    image.src = 'images/image.jpg';

    image.onload = async () => {
      await renderManager.drawImage(image);
    };
  };

  const handleMove = (e: OriginalEvent) => {
    renderManager.handleMove(e);
  };

  const handleClick = (e: OriginalEvent) => {
    renderManager.handlePick(e);
  };
</script>

<canvas
  {width}
  {height}
  class={className}
  bind:this={canvas}
  on:click={handleClick}
  on:mousemove={handleMove}
  on:pointermove={handleMove}
  on:touchmove={handleMove}
/>
