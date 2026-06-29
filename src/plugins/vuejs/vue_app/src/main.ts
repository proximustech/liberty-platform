import { createApp } from 'vue'
import App from './App.vue'

const { screen, props } = window.__LP_PROPS__

// Capture app from the true global scope before the iife closes over its own scope
const lpApp = (window as any)['app']

createApp(App, { screen, props, lpApp }).mount('#root')
