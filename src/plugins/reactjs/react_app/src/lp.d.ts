export {}

declare global {
  interface Window {
    __LP_PROPS__: {
      screen: string
      props: Record<string, any>
    }
  }
}
