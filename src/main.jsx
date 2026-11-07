import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { seedMockData } from './api/mockApi'
import { USE_MOCK } from './api/client'

// Siapkan data awal untuk mode demo sebelum aplikasi dirender.
if (USE_MOCK) seedMockData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
