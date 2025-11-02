import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LocationProvider } from './contexts/LocationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </AuthProvider>
  </StrictMode>,
)
