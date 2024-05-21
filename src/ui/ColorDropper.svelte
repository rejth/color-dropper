<script lang="ts">
  import { onMount, setContext } from 'svelte';

  import Canvas from './Canvas.svelte';
  import Layer from './Layer.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import ColorCircle from './ColorCircle.svelte';
  import Spinner from './Spinner.svelte';

  import { RenderManager, RenderWorker, type AppContext, GeometryManager } from '../model';
  import { KEY } from '../lib';

  const renderManager = new RenderManager(new GeometryManager());
  const { selectedColor } = renderManager;

  setContext<AppContext>(KEY, {
    renderManager,
  });

  let imageSource: CanvasImageSource | null = null;
  let isEntered = false;
  let needsPickColor = false;

  onMount(async () => {
    const image = new Image();
    image.src = 'images/texture.jpg';

    image.onload = async () => {
      const imageBitmap = await createImageBitmap(image);
      imageSource = imageBitmap;
    };
  });

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
  {#if !imageSource}
    <div class="spinner">
      <Spinner />
    </div>
  {:else}
    <ColorCircle isActive={isEntered && needsPickColor} />
    <Canvas
      isActive={needsPickColor}
      on:mouseenter={onEnter}
      on:mouseleave={onLeave}
      on:pointerenter={onEnter}
      on:pointerleave={onLeave}
    >
      <Layer
        render={({ ctx, width, height }) => {
          if (!imageSource) return;
          ctx.drawImage(imageSource, 0, 0, width, height);
        }}
      />
    </Canvas>
  {/if}
</div>

<style>
  .color-dropper {
    width: 100%;
    height: calc(100vh - 2em);
  }

  .spinner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
