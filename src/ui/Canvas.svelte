<script lang="ts">
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { type OriginalEvent, type AppContext, type ResizeEvent } from '../model';
  import { getMaxPixelRatio, KEY } from '../lib';

  /**
   * When unset, the canvas will use its clientWidth property.
   */
  export let width: number | null = null;
  /**
   * When unset, the canvas will use its clientHeight property.
   */
  export let height: number | null = null;
  /**
   * If pixelRatio is unset, the canvas uses devicePixelRatio binding to match the window’s pixel dens.
   * If pixelRatio is set to "auto", the canvas-size library is used to automatically calculate the maximum supported pixel ratio based on the browser and canvas size.
   * This can be particularly useful when rendering large canvases on iOS Safari (https://pqina.nl/blog/canvas-area-exceeds-the-maximum-limit/)
   */
  export let pixelRatio: 'auto' | number | null = null;
  export let contextSettings: CanvasRenderingContext2DSettings | undefined = undefined;
  export let isActive = true;
  export let style = '';

  /**
   * Returns a reference to the canvas DOM element in the parent component
   */
  export const getCanvasElement = (): HTMLCanvasElement => canvasRef;

  const { renderManager } = getContext<AppContext>(KEY);
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

  /**
   * If pixelRatio is set to "auto", we will calculate the maximum supported pixel ratio based on the browser and canvas size.
   * Calculate a new maxPixelRatio each time _width, _height or devicePixelRatio change.
   */
  $: if (devicePixelRatio && pixelRatio === 'auto') {
    maxPixelRatio = getMaxPixelRatio(_width, _height, devicePixelRatio);
  } else {
    maxPixelRatio = undefined;
  }

  /**
   * _pixelRatio parameter allows to prevent canvas items from appearing blurry on higher-resolution displays.
   * To do this, we scale canvas for high resolution displays:
   * 1. Set the "actual" size of the canvas:
        canvas.width = _width * _pixelRatio
        canvas.height = _height * _pixelRatio
   * 2. Set the "drawn" size of the canvas:
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
   */
  $: _pixelRatio = maxPixelRatio ?? <number>pixelRatio ?? devicePixelRatio ?? 2;

  /**
   * Update app state each time _width, _height or _pixelRatio values of the canvas change
   */
  $: renderManager.canvas = canvasRef;
  $: renderManager.width = _width;
  $: renderManager.height = _height;
  $: renderManager.pixelRatio = _pixelRatio;
  $: geometryManager.pixelRatio = _pixelRatio;

  /**
   * Adjust canvas's transformation matrix to scale drawings according to the device's pixel ratio
   */
  $: _width, _height, _pixelRatio, renderManager.redraw();

  /**
   * Dispatch "resize" event to the parent component
   */
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
  on:touchstart|passive={onClick}
  on:touchmove|passive={onMove}
  on:mousedown={onClick}
  on:mousemove={onMove}
  on:pointerdown={onClick}
  on:pointermove={onMove}
  on:focus
  on:blur
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
  on:wheel|passive
  on:drag
  on:dragend
  on:dragenter
  on:dragstart
  on:dragleave
  on:dragover
  on:drop
  on:touchcancel
  on:touchend
  on:touchmove|passive
  on:touchstart|passive
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
