import 'dotenv/config'
import '@total-typescript/ts-reset'
import '@palladxyz/features/dist/index.css'

import { WelcomeScreen } from '@palladxyz/features'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WelcomeScreen />
    </ThemeProvider>
  </React.StrictMode>
)
