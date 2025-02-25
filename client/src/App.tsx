import { useState } from 'react'
import MenuAppBar from "./components/appBar"
import { Box } from "@mui/material"
import './App.css'

function App() {

  return (
    <>
      <Box sx={{
        border: 1,
        width: "100vw",
      }}>
        <MenuAppBar />

      </Box>
    </>
  )
}

export default App
