import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const { screen, props } = window.__LP_PROPS__

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App screen={screen} props={props} />
  </StrictMode>
)
