import { Box, Button, Grid2, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import Collection from './Collection'
import { Link, useNavigate } from 'react-router-dom';
import { ICollection } from '../../interfaces/ICollection';
import { IUser } from '../../interfaces/IUser';
import EditCollection from './Options/EditCollectionDialog';
import { set, Types } from 'mongoose';
import { IArticle } from '../../interfaces/IArticle';

interface collectionProps {
  validToken: boolean
  user: IUser | null
  board: ICollection[]
}

function Board({ validToken, user, board }: collectionProps) {
  const [collections, setCollections] = React.useState<ICollection[]>(() => {return board})
  const [loading, setLoading] = React.useState<boolean>(() => {return true})
  
  const navigate = useNavigate()
  useEffect (() => {
    const init = () => {
      console.log("Init board")
      setLoading(false)
    }
    init()
  },[navigate])
  
  // ////////////////////////////////// functionality for creating new collection
  const [openCCollection, setOpenCCollection] = React.useState<boolean>(() => {return false})

  const openCreate = () => {
    setOpenCCollection(true)
  }

  const saveNewCollection = async (title: string, color: string) => {
    const res = await fetch("/api/collection/create", {
      method: "post",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        color: color
      })
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      setCollections([...collections, data])
    }
  }

  // delete existing collection
  const deleteCollection = async (_id: Types.ObjectId) => {
    const res = await fetch("/api/collection", {
      method: "delete",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: _id
      })
    })
    if (res.ok) {
      setCollections(collections.filter((collection) => (collection._id != _id)))
    }
  }


  // search field functionality
  const [searchValue, setSearchValue] = useState<string>(() => {return ""})

  // handle filtering
  const filterArticles = (articles: IArticle[]) => {
    if (searchValue === "") {      
      // handle empty search
      return articles
    } else {
      const filtered = articles.filter((article) => (
          article.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          article.content.toLowerCase().includes(searchValue.toLocaleLowerCase())
        )
      )
      return filtered
    }
  }
  

  // component
  return (

    <>
      {loading ? (
        <Loading />
      ) : (
        (validToken) ? (
          <>
            {/* create collection dialog */}
            <EditCollection mode="Create" open={openCCollection} setOpen={setOpenCCollection} saveCollection={saveNewCollection} 
            collection={{
              // new ICollection-object to edit
              _id: new Types.ObjectId,
              owner: new Types.ObjectId,
              title: "",
              color: "whitesmoke",
              articles: [],
            }} />


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


                  {/* Searchfield for filtering articles */}
                  <TextField 
                    label="Search"
                    value={searchValue}
                    onChange={(e) => {setSearchValue(e.target.value)}}
                    sx={{
                      mr: 0,
                      ml: "auto",
                      my:1,
                    }}
                  />

                  {/* add collection button */}
                  <Tooltip title="Create collection">
                    <IconButton
                      sx={{
                        mx:1,
                      }}
                      onClick={openCreate}
                    >
                      <AddIcon></AddIcon>
                    </IconButton>
                  </Tooltip>
                </Paper>

                {/* MUI Grid v2 to work as base for displaying Board */}
                <Box>
                  <Grid2 
                    id="collectionContainer"
                    container
                    spacing={1}
                    sx={{ borderRadius:1, p:1, pt:2, pr:2, mt:-1, width: 1, bgcolor:"whitesmoke", minHeight: 300 }}
                  >
                    {
                      collections.map((collection) => {
                        const filteredArticles = filterArticles(collection.articles)
                        return (
                        <Collection 
                        key={`${collection._id.toString()}:${searchValue}`} 
                        collection={collection} 
                        articleList={filteredArticles} 
                        deleteFromBoard={deleteCollection}/>
                        )
                      })
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