import { createApp } from 'vue'
import App from './App.vue'

const { screen, props } = window.__LP_PROPS__

createApp(App, { screen, props }).mount('#root')
