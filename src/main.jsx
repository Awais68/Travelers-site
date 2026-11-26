import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'

const Router = __PREVIEW__ ? MemoryRouter : BrowserRouter
const tree = (
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
)
const root = document.getElementById('root')
// Prerendered pages hydrate; dev server renders fresh.
if (root.firstElementChild) hydrateRoot(root, tree)
else createRoot(root).render(tree)
