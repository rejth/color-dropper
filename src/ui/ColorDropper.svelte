<script lang="ts">
  import { setContext } from 'svelte';

  import Canvas from './Canvas.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import ColorCircle from './ColorCircle.svelte';

  import { RenderManager, RenderWorker, type AppContext, GeometryManager } from '../model';
  import { KEY } from '../lib';

  export let width: number | null = null;
  export let height: number | null = null;
  export let pixelRatio: 'auto' | number | null = null;
  export let contextSettings: CanvasRenderingContext2DSettings | undefined = undefined;
  export let style = '';
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
