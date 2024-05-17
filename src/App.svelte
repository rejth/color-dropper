<script lang="ts">
  import { setContext } from 'svelte';

  import Canvas from './ui/Canvas.svelte';
  import ColorPicker from './ui/ColorPicker.svelte';
  import ColorCircle from './ui/ColorCircle.svelte';
  import { RenderManager, type Context, KEY, GeometryManager } from './lib';

  const renderManager = new RenderManager(new GeometryManager());
  const { selectedColor } = renderManager;

  setContext<Context>(KEY, {
    renderManager,
  });

  const settings: CanvasRenderingContext2DSettings = {
    alpha: false,
  };

  let isEntered = false;

  const onEnter = () => {
    isEntered = true;
  };

  const onLeave = () => {
    isEntered = false;
  };
</script>

<main>
  <div class="toolbar">
    <span tabindex="0" role="button" class="tool" on:click={() => {}} on:keydown={() => {}}>
      <span class="icon" class:active={true} title="Color picker">
        <ColorPicker />
      </span>
    </span>
    <strong class="selected-color">{$selectedColor}</strong>
  </div>
  <div>
    <Canvas
      width={window.innerWidth}
      height={window.innerHeight}
      contextSettings={settings}
      style="cursor: {isEntered ? 'none' : 'default'}"
      on:mouseenter={onEnter}
      on:mouseleave={onLeave}
      on:pointerenter={onEnter}
      on:pointerleave={onLeave}
    />
  </div>
  <ColorCircle isActive={isEntered} />
</main>

<style>
  .toolbar {
    top: 3rem;
    left: 50%;
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
