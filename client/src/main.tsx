import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'

const myTheme = createTheme({
  palette: {
    primary: {
      main: "#0b5fe6",
    },
    secondary: {
      main: "#ffffff"
    },
  },
  typography: {
    button:{
      textTransform: "none",
    }
  }
  
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={myTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
