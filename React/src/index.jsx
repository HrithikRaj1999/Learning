import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './reset.css'
import App from './App.jsx'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Mount failed: #root is missing from index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
