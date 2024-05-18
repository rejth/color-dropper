<script lang="ts">
  import { getContext } from 'svelte';
  import { BLACK, KEY, WHITE, type Context } from '../lib';

  export let isActive: boolean;

  const { renderManager } = getContext<Context>(KEY);
  const { cursor } = renderManager;
</script>

<div class="cursor-wrapper" class:active={isActive}>
  <div
    class="cursor"
    class:active={isActive}
    style:--x={`${$cursor.x}px`}
    style:--y={`${$cursor.y}px`}
  >
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="75" y="75" width="10" height="10" fill="none" stroke={WHITE} stroke-width="2" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M80 148C117.555 148 148 117.555 148 80C148 42.4446 117.555 12 80 12C42.4446 12 12 42.4446 12 80C12 117.555 42.4446 148 80 148ZM80 160C124.183 160 160 124.183 160 80C160 35.8172 124.183 0 80 0C35.8172 0 0 35.8172 0 80C0 124.183 35.8172 160 80 160Z"
        fill={$cursor.color}
      />
      <text
        x="80"
        y="110"
        font-size="16"
        font-weight="600"
        text-anchor="middle"
        font-family="Arial"
        fill={BLACK}
      >
        {$cursor.color}
      </text>
    </svg>
  </div>
</div>

<style>
  .cursor-wrapper {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    touch-action: none;
  }

  .cursor {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%) translate(var(--x, 0px), var(--y, 0px));
  }

  .active {
    display: block;
  }
</style>
