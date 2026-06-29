<script setup lang="ts">
import HomeScreen from './screens/HomeScreen.vue'
import CounterScreen from './screens/CounterScreen.vue'

const props = defineProps<{
  screen: string
  props: Record<string, any>
}>()
</script>

<template>
  <HomeScreen v-if="screen === 'home'" :user-name="props.props.userName" />
  <CounterScreen v-else-if="screen === 'counter'" :start-count="props.props.startCount" />
  <p v-else style="color: red">Unknown screen: {{ screen }}</p>
</template>
