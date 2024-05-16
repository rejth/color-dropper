<script lang="ts">
  import Canvas from './ui/Canvas.svelte';
  import ColorPicker from './ui/ColorPicker.svelte';
  import SelectedColor from './ui/SelectedColor.svelte';
</script>

<main>
  <div class="control-panel">
    <ColorPicker />
    <SelectedColor />
  </div>
  <Canvas className="canvas" width={window.innerWidth} height={window.innerHeight} />
</main>
