import React, { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import MenuAppBar from "./components/menuAppBar"
import { Box } from "@mui/material"
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <MenuAppBar />
        <Routes>

          {/* Homepage here shows user's collections. redirect to login if no token is found. */}
          <Route path="/">
            
          </Route>

          {/* Register page here. Asks user for relevant info. If registration succeeds, redirect to login. */}
          <Route path="/register">

          </Route>

          {/* Login page. Asks user for email and password. If succesfull, saves JWT to localstorage and redirects to "/". */}
          <Route path="/Login">
          
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
