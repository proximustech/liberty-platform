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
}
