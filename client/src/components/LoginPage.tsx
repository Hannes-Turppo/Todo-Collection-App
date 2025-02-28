import React, { useEffect } from 'react'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import SimpleDialog from './SimpleDialog'
import { validateToken } from '../hooks/validateToken'
import { VisibilityOff, Visibility } from '@mui/icons-material'


function LoginPage() {
  // store input values as states
  const [email, setEmail] = React.useState<String>("")
  const [password, setPassword] = React.useState<String>("")

  // control site functionality
  const [loginFailed, setLoginFailed] = React.useState<boolean>(false)
  const [errorMessages, setErrorMessages] = React.useState<any[]>([])
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Init page when navigated to
  const navigate = useNavigate()
  useEffect (() => {
    const init = async () => {
      const validToken: boolean = await validateToken()
      if (validToken) window.location.href="/" 
    }
    init()
  }, [navigate])
  
  // handle events for password field
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  // handle login submission here
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // fetch user's token from api
    const res = await fetch("/api/user/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    const data = await res.json()
    
    // if credentials are correct, save token to localstorage and redirect to "/"
    if (res.ok) {
      localStorage.setItem("token", data.token)
      window.location.href = "/"
    } else {
      // If failed:
      console.log(data)
      setErrorMessages(data.errors)
      setLoginFailed(true)
    }
  }
    
    return (
      <>
      <Box sx={{
        position: "static",
        display: "flex",
        justifyContent: "center",
        alignItems: "top-center",
        alignSelf: "center",
        border: 1,
        width: "100vw",
        height: "100vh",
        mx: "auto",
        mt: 0,
        p: 0,
      }}>
        {/* container for login form */}
        <Paper sx={{
          elevation: 15,
          width: {md: 810, xs: "90vw"},
          height: 500,
          borderColor: "secondary.main",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: 12
        }}>
          {/* login form */}
          <Box 
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt:5, display: 'flex', flexDirection: "column", alignItems: 'center' }}
          >
            {/* form header */}
            <Typography variant='h3' fontWeight="bold">User login</Typography>

            {/* text inputs */}
            <TextField 
              label="Email"
              type='email' 
              required={true}
              onChange={(e) => {setEmail(e.target.value)}}
              sx={{ width: {xs: "80%", sm: 430}, mt: 5 }}
            />
            <FormControl sx={{ mt: 1, width: {xs: "80%", sm: 430}}} >
              <InputLabel htmlFor="password" required={true} >Password</InputLabel>
              <OutlinedInput
                id='password'
                required={true}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => {setPassword(e.target.value)}}
                sx={{ width: 1 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                      >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* form submit */}
            <Button 
              type='submit'
              variant='contained' 
              sx={{
                width: 150,
                alignSelf: "center",
                mt: 3,
              }}
            >Login</Button>
          </Box>

          <SimpleDialog title='Login failed' content={errorMessages} open={loginFailed} setOpen={setLoginFailed} />

          {/* register link */}
          <Box
            sx={{
              mt: 5,
              display:'flex',
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Typography sx={{ mx: "auto" }}>
              Not a user yet?
            </Typography>
            <Link to="/register" sx={{mx: "auto"}}>
              <Button variant='outlined'>
                <Typography>
                  Register
                </Typography>
              </Button>
            </Link>
          </Box>

        </Paper>
      </Box>
    </>
)
}

export default LoginPage