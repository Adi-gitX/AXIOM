import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider'
import { initSentry } from './lib/sentry'

initSentry();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="axiom-theme-v2">
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)
