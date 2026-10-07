import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { StoreProvider } from './store.jsx'
import './styles.css'
import './styles-api.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreProvider>
      <ErrorBoundary><App /></ErrorBoundary>
    </StoreProvider>
  </BrowserRouter>
)
