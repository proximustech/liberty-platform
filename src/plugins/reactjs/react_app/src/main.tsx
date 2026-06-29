import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const { screen, props, _mountId } = window.__LP_PROPS__
const lpApp = (window as any)['app']

createRoot(document.getElementById(_mountId)!).render(
  <StrictMode>
    <App screen={screen} props={props} lpApp={lpApp} />
  </StrictMode>
)
