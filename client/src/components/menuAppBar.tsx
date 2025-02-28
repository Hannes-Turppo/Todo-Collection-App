import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, Typography, Button } from '@mui/material';
import { validateToken } from '../hooks/validateToken';
import React, { useEffect } from 'react';


export default function menuAppBar() {
  const [validToken, setValidToken] = React.useState<boolean>(() => {return false})

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href="/login"
  }

  // Init page when navigated to
  const navigate = useNavigate()
  useEffect (() => {
    const init = async () => {
      const validToken: boolean = await validateToken()
      if (validToken) setValidToken(true)      
    }
    init()
  }, [navigate])  

  return (
    <>
      <Container sx={{ flexGrow:1, elevation: 1, }}>
        <AppBar position="fixed" sx={{zIndex:2000}}>
          <Toolbar sx={{ display:"flex", justifyContent:"space-between" }}>

            {/* page header */}
            <Link to='/'>
              <Typography variant="h6" sx={{ color: "secondary.main" }}>
                TACoS
              </Typography>
            </Link>

            {/* Container for user links */}
            <Container 
              sx={{
                display:"flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: {lg:5, sm: 3, xs: 1},
                mr: 0,
              }}
            >
              {/* Check for valid token. Render different links if user is logged in. */}
              {validToken ? (
                // logged in content
                <>
                  <Link to="/">
                    <Typography sx={{color:"secondary.main"}}>Board</Typography>
                  </Link>
                  <Link to="/settings">
                    <Typography sx={{color:"secondary.main"}}>Settings</Typography>
                  </Link>
                  <Link to="/user/profile">
                    <Typography sx={{color:"secondary.main"}}>My account</Typography>
                  </Link>
                  <Button onClick={handleLogout}>
                    <Typography sx={{color:"secondary.main"}}>Logout</Typography>
                  </Button>
                </>
              ) : (
                // logged out content
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
