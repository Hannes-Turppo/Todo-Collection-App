import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Container, Typography } from '@mui/material';
import React from 'react';


export default function menuAppBar() {
  
  // Validate user token. This is run, when page loads
  // if user doesn't have a valid token, they are redirected to login screen
  const [validToken, setValidToken] = React.useState<boolean>(false)
  const validateToken = async () => {
    const token: string | null = localStorage.getItem("token")
    try {
      // validate JWT from backend
      const res = await fetch("/api/validateToken", {
        method: "powt",
        body: JSON.stringify({token: token})
      })
      // if res.ok: token is valid. Else: token is not valid
      if ( res.status === 200 ) {
        setValidToken(true)
      } else {
        setValidToken(false)
      }


      // if no valid token is found and user is not in login or register, redirect to login
      if (!validToken && (window.location.pathname !== "/login" && window.location.pathname !== "/register")) {
        console.log(window.location.pathname)
        window.location.pathname = "/login"
        return
      }
      return
    } catch (error: any) {
      console.error(error)
      return
    }
  }
  validateToken()

  return (
    <>
      <Container sx={{ flexGrow:1, elevation: 1, display:"flex", justifyContent:"space-between" }}>
        <AppBar position="fixed">
          <Toolbar>


            {/* page header */}
            <Link to='/'>
              <Typography variant="h6" sx={{ color: "secondary.main" }}>
                TACoS
              </Typography>
            </Link>

            <Container 
              sx={{
                display:"flex",
                justifyContent:"flex-end",
                gap: {lg:5, sm: 3, xs: 1},
              }}
            >


            {validToken ? (
              <>
                  <Link to="/">
                    <Typography sx={{color:"secondary.main"}}>Collections</Typography>
                  </Link>
                  <Link to="/settings">
                    <Typography sx={{color:"secondary.main"}}>Settings</Typography>
                  </Link>
                  <Link to="/user/profile">
                    <Typography sx={{color:"secondary.main"}}>My account</Typography>
                  </Link>
                  <Link to="/user/logout">
                    <Typography sx={{color:"secondary.main"}}>Logout</Typography>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Typography sx={{color:"secondary.main"}}>Login</Typography>
                  </Link>
                  <Link to="/register">
                    <Typography sx={{color:"secondary.main"}}>Register</Typography>
                  </Link>
                </>
            )}
              </Container>

          </Toolbar>
        </AppBar>
      </Container>
    </>
  );
}
