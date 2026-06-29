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
    <div class="lp_contrast_container p-3 p-md-4">
      <h4>
        <sl-icon name="plus-slash-minus" />
        Counter Demo
      </h4>
      <p class="text-secondary" style="font-size: 0.9em">
        Initial value <code>{{ startCount }}</code> was injected server-side.
        The counter below is pure Vue reactive state.
      </p>

      <!-- Counter controls - centered, touch-friendly on mobile -->
      <div class="d-flex align-items-center justify-content-center gap-3 my-4">
        <sl-button variant="neutral" size="large" circle @click="count--">
          <sl-icon name="dash" />
        </sl-button>

        <span :style="{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: 'bold',
          minWidth: '4rem',
          textAlign: 'center',
          lineHeight: 1,
        }">
          {{ count }}
        </span>

        <sl-button variant="primary" size="large" circle @click="count++">
          <sl-icon name="plus" />
        </sl-button>
      </div>

      <sl-button
        variant="text"
        @click="() => lpApp.ajax('content_view', '/vuejs', 'Home', true)"
      >
        ← Back to Home
      </sl-button>
    </div>
  </div>
</template>
