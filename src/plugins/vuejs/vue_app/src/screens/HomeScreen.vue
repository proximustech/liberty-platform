<script setup lang="ts">
defineProps<{
  userName: string
  lpApp: any
}>()
</script>

<template>
  <div class="lp_container">
    <div class="lp_contrast_container p-3 p-md-4">
      <h4>
        <sl-icon name="house" />
        Vue Demo
      </h4>
      <p>
        Welcome, <strong>{{ userName }}</strong>. This screen was rendered by Vue 3.
      </p>
      <p class="text-secondary" style="font-size: 0.9em">
        The data above was passed server-side: Koa route → EJS bridge →
        <code>window.__LP_PROPS__</code> → Vue props.
      </p>
      <div class="d-flex flex-column flex-sm-row gap-2 mt-3">
        <sl-button
          variant="primary"
          style="width: 100%"
          @click="() => lpApp.ajax('content_view', '/vuejs/counter', 'Counter', true)"
        >
          <sl-icon slot="prefix" name="plus-slash-minus" />
          Counter screen
        </sl-button>
      </div>
    </div>
  </div>
</template>
