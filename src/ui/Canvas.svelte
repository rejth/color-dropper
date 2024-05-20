<script lang="ts">
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import {
    type HitCanvasRenderingContext2D,
    type OriginalEvent,
    type Context,
    type ResizeEvent,
    getMaxPixelRatio,
    KEY,
  } from '../lib';

  export let width: number | null = null;
  export let height: number | null = null;
  export let pixelRatio: 'auto' | number | null = null;
  export let contextSettings: CanvasRenderingContext2DSettings | undefined = undefined;
  export let isActive = true;
  export let style = '';

  export const getCanvasElement = (): HTMLCanvasElement => canvasRef;
  export const getCanvasContext = (): HitCanvasRenderingContext2D | null => renderManager.context;

  const { renderManager } = getContext<Context>(KEY);
  const { geometryManager } = renderManager;

  const dispatch = createEventDispatcher<ResizeEvent>();

  let canvasRef: HTMLCanvasElement;
  let canvasWidth: number;
  let canvasHeight: number;
  let devicePixelRatio: number | undefined;
  let maxPixelRatio: number | undefined;

  onMount(() => {
    renderManager.init(canvasRef, contextSettings);
    return () => renderManager.destroy();
  });

  const resize = (node: Element) => {
    const canvasObserver = new ResizeObserver(([{ contentRect }]) => {
      canvasWidth = contentRect.width;
      canvasHeight = contentRect.height;
    });
    canvasObserver.observe(node);

    return {
      destroy: () => canvasObserver.disconnect(),
    };
  };

  const onMove = (e: OriginalEvent) => {
    renderManager.handleMove(e);
  };

  const onClick = (e: OriginalEvent) => {
    renderManager.handlePick(e);
  };

  $: _width = width ?? canvasWidth ?? 0;
  $: _height = height ?? canvasHeight ?? 0;

  $: if (devicePixelRatio && pixelRatio === 'auto') {
    maxPixelRatio = getMaxPixelRatio(_width, _height, devicePixelRatio);
  } else {
    maxPixelRatio = undefined;
  }

  $: _pixelRatio = maxPixelRatio ?? <number>pixelRatio ?? devicePixelRatio ?? 2;

  $: renderManager.width = _width;
  $: renderManager.height = _height;
  $: renderManager.pixelRatio = _pixelRatio;
  $: geometryManager.pixelRatio = _pixelRatio;

  $: _width, _height, _pixelRatio, renderManager.redraw();

  $: dispatch('resize', {
    width: _width,
    height: _height,
    pixelRatio: _pixelRatio,
  });
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  {style}
  class="canvas"
  class:active={isActive}
  width={_width * _pixelRatio}
  height={_height * _pixelRatio}
  style:width={width ? `${width}px` : '100%'}
  style:height={height ? `${height}px` : '100%'}
  use:resize
  bind:this={canvasRef}
  bind:clientWidth={canvasWidth}
  bind:clientHeight={canvasHeight}
  on:mousedown={onClick}
  on:mouseup
  on:mousemove={onMove}
  on:mouseenter
  on:mouseleave
  on:pointerdown={onClick}
  on:pointerup
  on:pointerenter
  on:pointerleave
  on:pointermove={onMove}
  on:pointercancel
  on:touchstart={onClick}
  on:touchend
  on:touchmove={onMove}
  on:touchcancel
  on:click
  on:dblclick
  on:wheel
  on:focus
  on:blur
  on:contextmenu
  on:fullscreenchange
  on:fullscreenerror
  on:scroll
  on:cut
  on:copy
  on:paste
  on:keydown
  on:keypress
  on:keyup
  on:auxclick
  on:click
  on:contextmenu
  on:dblclick
  on:mousedown
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:mouseover
  on:mouseout
  on:mouseup
  on:select
  on:wheel
  on:drag
  on:dragend
  on:dragenter
  on:dragstart
  on:dragleave
  on:dragover
  on:drop
  on:touchcancel
  on:touchend
  on:touchmove
  on:touchstart
  on:pointerover
  on:pointerenter
  on:pointerdown
  on:pointermove
  on:pointerup
  on:pointercancel
  on:pointerout
  on:pointerleave
  on:gotpointercapture
  on:lostpointercapture
/>

<slot />

<style>
  .canvas {
    pointer-events: none;
    touch-action: none;
    cursor: default;
  }

  .active {
    pointer-events: all;
    touch-action: auto;
    cursor: none;
  }
</style>
