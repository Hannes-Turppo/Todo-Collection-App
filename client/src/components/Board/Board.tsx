import { Box, Button, Grid2, IconButton, Paper, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect } from 'react'
import Loading from '../Loading'
import Collection from './Collection'
import { Link, useNavigate } from 'react-router-dom';
import { ICollection } from '../../interfaces/ICollection';
import { IUser } from '../../interfaces/IUser';

interface collectionProps {
  validToken: boolean
  user: IUser | null
  board: ICollection[]
}

function Board({ validToken, user, board }: collectionProps) {
  const [loading, setLoading] = React.useState<boolean>(() => {return true})
  
  const navigate = useNavigate()
  useEffect (() => {
    const init = () => {
      console.log("init")
      setLoading(false)
    }
    init()
  },[navigate])


  // button functionality
  const createCollection = (event: React.MouseEvent) => {
    const parent = event.target
    console.log(parent)
  }

  return (

    <>
      {loading ? (
        <Loading />
      ) : (
        (validToken) ? (
          <>
            {/* If user is logged in, show user's Board */}
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100vw",
                height: "100vh",
                m: 0,
                p: 0,
                zIndex: 1500
              }}
            >
              {/* Contains collection board */}
              <Paper
                sx={{
                  mt: 10,
                  mx: "auto",
                  p:0,
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"space-between",
                  position: "absolute",
                  width: {xl: 1380, xs: "90vw"},
                }}
              >

                {/* Collection board header */}
                <Paper
                  sx={{
                    minHeight: 50,
                    width: "100%",
                    elevation: 20,
                    zIndex:"1500",
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent:"space-between",
                    alignItems:"center",
                  }}
                >
                  {/* header text */}
                  <Typography variant='h5' sx={{ml:1}}>{`${user?.username}'s Board`}</Typography>

                  {/* add collection button */}
                  <IconButton
                    sx={{
                      mr:1,
                      ml:"auto",
                    }}
                    onClick={createCollection}
                  >
                    <AddIcon></AddIcon>
                  </IconButton>
                </Paper>

                {/* MUI Grid v2 to work as base for displaying Board */}
                <Box>
                  <Grid2 
                    container
                    spacing={1}
                    sx={{ borderRadius:1, p:1, pt:2, pr:2, mt:-1, width: 1, bgcolor:"whitesmoke" }}
                  >
                    { 
                      board.map((collection) => (
                        <Collection key={collection._id.toString()} collection={collection}/>
                      ))
                    }
                  </Grid2>
                </Box>
              </Paper>
            </Box>
          </>
        ) : (
          <>
            {/* if user is not logged in, show them links to register and login pages */}
            <Box
              sx={{
                width:"100vw",
                height:"100vh",
                display:"flex",
                justifyContent:"center",
                border:1,
              }}
            >
              <Paper
                sx={{
                  width:{md:720, xs:"90vw"},
                  height: 400,
                  mt:10,
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"center",
                  alignItems:"center",
                }}
              >
                {/* register link */}
                <Typography variant='h4'>Start using by registering</Typography>
                <Link to="/register" >
                  <Button variant="contained" sx={{mt:1, width:100}}>Register</Button>
                </Link>

                {/* login link */}
                <Typography variant='h4' sx={{mt:3}}>Already have an account?</Typography>
                <Link to="/login">
                  <Button variant='outlined' sx={{mt:1, width:100}}>Log In</Button>
                </Link>

              </Paper>
            </Box>
          </>
        )
      )}
    </>
  )
}

export default Board