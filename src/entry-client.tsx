import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const container = document.getElementById('root')

const FullApp = () => (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

hydrateRoot(container as HTMLElement, <FullApp />)