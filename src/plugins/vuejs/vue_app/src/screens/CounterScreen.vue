<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  startCount: number
  lpApp: any
}>()

const count = ref(props.startCount)
</script>

<template>
  <div class="lp_container">
    <div class="lp_contrast_container" style="padding: 24px">
      <h4>
        <sl-icon name="plus-slash-minus" />
        Counter Demo
      </h4>
      <p style="color: var(--sl-color-neutral-500); font-size: 0.9em">
        Initial value <code>{{ startCount }}</code> was injected server-side.
        The counter below is pure Vue reactive state.
      </p>
      <div style="display: flex; align-items: center; gap: 16px; margin-top: 16px">
        <sl-button variant="neutral" @click="count--">
          <sl-icon slot="prefix" name="dash" />
          Decrement
        </sl-button>
        <span style="font-size: 2rem; font-weight: bold; min-width: 3rem; text-align: center">
          {{ count }}
        </span>
        <sl-button variant="primary" @click="count++">
          <sl-icon slot="prefix" name="plus" />
          Increment
        </sl-button>
      </div>
      <div style="margin-top: 24px">
        <sl-button
          variant="text"
          @click="() => lpApp.ajax('content_view', '/vuejs', 'Home', true)"
        >
          ← Back to Home
        </sl-button>
      </div>
    </div>
  </div>
</template>
