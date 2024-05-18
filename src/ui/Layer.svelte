<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { v4 as uuid } from 'uuid';
  import { type Render, type Context, KEY } from '../lib';

  export let render: Render;

  const { renderManager } = getContext<Context>(KEY);

  onMount(() => {
    const layerId = uuid();
    renderManager.addDrawer(layerId, render);
    return () => renderManager.removeDrawer(layerId);
  });
</script>
