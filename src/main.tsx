import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { applyDemoContentSetting } from './data/synthetic/syntheticMarker'

applyDemoContentSetting()
// The customer-view pop-up (?mirror=1) shows the journey content only: no app chrome.
if (new URLSearchParams(location.search).get('mirror') === '1') document.documentElement.classList.add('mirror-window')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Outermost boundary: a crash in the shell (sidebar, header, login) must not leave a blank page. */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
