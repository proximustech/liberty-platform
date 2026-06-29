<script setup lang="ts">
defineProps<{
  userName: string
}>()
</script>

<template>
  <div class="lp_container">
    <div class="lp_contrast_container" style="padding: 24px">
      <h4>
        <sl-icon name="house" />
        Vue Demo
      </h4>
      <p>
        Welcome, <strong>{{ userName }}</strong>. This screen was rendered by Vue 3.
      </p>
      <p style="color: var(--sl-color-neutral-500); font-size: 0.9em">
        The data above was passed server-side: Koa route → EJS bridge →
        <code>window.__LP_PROPS__</code> → Vue props.
      </p>
      <div style="margin-top: 16px">
        <sl-button
          variant="primary"
          @click="() => (window as any).app.ajax('content_view', '/vuejs/counter', 'Counter', true)"
        >
          Go to Counter screen
        </sl-button>
      </div>
    </div>
  </div>
</template>
