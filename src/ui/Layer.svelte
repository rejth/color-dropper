<script lang="ts">
import { getContext, onMount } from 'svelte'
import { v4 as uuid } from 'uuid'

import { KEY } from '../lib'
import { type AppContext, type Render } from '../model'

/**
 * The Layer component encapsulates a piece of canvas rendering logic.
 * It is a renderless component that accepts only render function and registers a new layer on the canvas.
 */

export let render: Render

const { renderManager } = getContext<AppContext>(KEY)

onMount(() => {
  const layerId = uuid()
  renderManager.addDrawer(layerId, render)
  return () => renderManager.removeDrawer(layerId)
})
</script>
