import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import test setup for development
if (import.meta.env.DEV) {
  import('./testSetup');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
