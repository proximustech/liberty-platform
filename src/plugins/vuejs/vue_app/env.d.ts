/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare global {
  interface Window {
    __LP_PROPS__: {
      screen: string
      props: Record<string, any>
    }
  }

  // app is a global var defined in lp.js, accessed via globalThis.app inside iife bundles
  var app: {
    ajax: (targetId: string, url: string, label?: string, resetBreadcrumbs?: boolean) => void
    app_menu_inteligentClose: () => void
  }
}
