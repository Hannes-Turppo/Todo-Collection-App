import React, { useEffect } from 'react'
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import SimpleDialog from './SimpleDialog'
import { validateToken } from '../hooks/validateToken'
import { VisibilityOff, Visibility } from '@mui/icons-material'


function RegisterPage() {
  // store input values as states
  const [email, setEmail] = React.useState<String>("")
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<String>("")

  // states to control site functionality
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [registerFailed, setRegisterFailed] = React.useState<boolean>(false)
  const [errorMessages, setErrorMessages] = React.useState<any[]>([])

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
  

  // handle registration submission here
  const handleSubmit = async (event: React.FormEvent<HTMLElement>) =>{
    event.preventDefault()

    // send registration info to server, redirect to login if succesfull
    const res = await fetch("/api/user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      })
    })
    
    // if registration succeeds, redirect to "/login"
    if (res.ok) {
      window.location.href = "/login"
    } else {
      // If failed:
      const data = await res.json()
      console.log(data)
      setErrorMessages(data.errors)
      setRegisterFailed(true)
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
        {/* container for register form */}
        <Paper sx={{
          elevation: 15,
          width: {md: 810, xs: "90vw"},
          height: 550,
          borderColor: "secondary.main",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: 12
        }}>
          {/* register form */}
          <Box 
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt:5, display: 'flex', flexDirection: "column", alignItems: 'center' }}
          >
            {/* form header */}
            <Typography variant='h3' fontWeight="bold">Register</Typography>

            {/* text inputs */}
            <TextField 
              id='email'
              placeholder='Email' 
              type='email' 
              required={true}
              onChange={(e) => {setEmail(e.target.value)}}
              sx={{ width: {xs: "80%", sm: 430}, mt: 5 }}
            />
            <TextField 
              id='username'
              placeholder='Username' 
              type='text' 
              required={true}
              onChange={(e) => {setUsername(e.target.value)}}
              sx={{
                width: {xs: "80%", sm: 430},
                mt: 1, 
              }}
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
            >Register</Button>
          </Box>

          <SimpleDialog title='Registration failed' content={errorMessages} open={registerFailed} setOpen={setRegisterFailed} />

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
              Already have an account?
            </Typography>
            <Link to="/login" sx={{mx: "auto"}}>
              <Button variant='outlined'>
                <Typography>
                  Login
                </Typography>
              </Button>
            </Link>
          </Box>

        </Paper>
      </Box>
    </>
)
}

export default RegisterPage