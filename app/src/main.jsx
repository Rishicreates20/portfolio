import React from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.jsx'
import './index.css'

// Vercel Web Analytics only exists on Vercel deployments; skip it on GitHub Pages.
if (!window.location.hostname.endsWith('github.io')) inject()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
