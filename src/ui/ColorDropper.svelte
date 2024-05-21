<script lang="ts">
  import { setContext } from 'svelte';

  import Canvas from './Canvas.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import ColorCircle from './ColorCircle.svelte';

  import { RenderManager, RenderWorker, type AppContext, GeometryManager } from '../model';
  import { KEY } from '../lib';

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
  export let style = '';
  /**
   * When useWorker is true, a worker with offscreen canvas will be registered to perform intensive operations without blocking the main thread.
   * When useWorker is false, all operations will be performed in the main thread on the main canvas.
   */
  export let useWorker = false;

  const geometryManager = new GeometryManager();
  const renderManager = useWorker
    ? new RenderWorker(geometryManager)
    : new RenderManager(geometryManager);

  setContext<AppContext>(KEY, {
    renderManager,
  });

  const { selectedColor } = renderManager;
  let isEntered = false;
  let needsPickColor = false;

  const onEnter = () => {
    isEntered = true;
  };

  const onLeave = () => {
    isEntered = false;
  };

  const onPickerClick = () => {
    needsPickColor = !needsPickColor;
  };
</script>

<div class="color-dropper">
  <div class="toolbar">
    <span tabindex="0" role="button" class="tool" on:click={onPickerClick} on:keydown={() => {}}>
      <span class="icon" class:active={needsPickColor} title="Color picker">
        <ColorPicker />
      </span>
    </span>
    <strong class="selected-color">{$selectedColor}</strong>
  </div>
  <ColorCircle isActive={isEntered && needsPickColor} />
  <Canvas
    {style}
    {width}
    {height}
    {pixelRatio}
    {contextSettings}
    isActive={needsPickColor}
    on:mouseenter={onEnter}
    on:mouseleave={onLeave}
    on:pointerenter={onEnter}
    on:pointerleave={onLeave}
  >
    <slot />
  </Canvas>
</div>

<style>
  .color-dropper {
    width: 100%;
    height: calc(100vh - 2em);
  }

  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    pointer-events: all;
  }

  .tool {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0.2em 0.2em;
  }

  .icon {
    font-size: 1em;
    display: inline-block;
    width: 4em;
    min-width: 2em;
    height: 4em;
    padding: 0.5em 0.5rem;
    margin: 0;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .active {
    background-color: #f4f4f6;
  }

  .selected-color {
    font-size: 1.5em;
    margin-left: 4rem;
  }
</style>
