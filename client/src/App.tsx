import {BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css'

// components
import MenuAppBar from "./components/menuAppBar"
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import Home from './components/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <MenuAppBar />
        <Routes>

          {/* Homepage here shows user's Board. redirect to login if no token is found. */}
          <Route path="/" 
            element={<Home />} 
          />

          {/* Register page here. Asks user for relevant info. If registration succeeds, redirect to login. */}
          <Route path="/register" 
            element={<RegistrationPage />}
          />

          {/* Login page. Asks user for email and password. If succesfull, saves JWT to localstorage and redirects to "/". */}
          <Route path="/Login" 
            element={<LoginPage />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
