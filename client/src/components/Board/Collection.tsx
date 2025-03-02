import React, { useEffect } from 'react'
import { ICollection } from '../../interfaces/ICollection'
import { Box, Grid2, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Article from './Article';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';
import { IArticle } from '../../interfaces/IArticle';
import { Types } from 'mongoose';
import EditArticle from './Options/EditArticleDialog';
import Options from './Options/Options';
import EditCollection from './Options/EditCollectionDialog';

interface collectionProps {
  collection: ICollection
  articleList: IArticle[]
  deleteFromBoard: (_id: Types.ObjectId) => void
}

function collection ({collection, articleList, deleteFromBoard}: collectionProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [title, setTitle] = React.useState<string>(() => {return collection.title})
  const [articles, setArticles] = React.useState<IArticle[]>(() => {return articleList})

  
  // not strictly functional, but necessary to init EditArticleDialog
  const [placeholderTitle, setNewTitle] = React.useState<string>(() => {return ""})
  const [placeholderContent, setNewContent] = React.useState<string>(() => {return ""})
  // const [] = React.useState<>()

  // State for handling article creation dialog
  const [openCArticle, setOpenCArticle] = React.useState<boolean>(() => {return false})
  
  // open creation window
  const openCreateArticle = () => {
    setOpenCArticle(true)
  }
  
  // close creation window
  const handleCloseCreate = () => {
    setOpenCArticle(false)
  }
  
  // Save new article
  const createArticle = async ( title: string, content: string, color: string, due: string, usedTime: string ) => {

    const res = await fetch("/api/article/create", {
      method: "post",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        content: content,
        parent: collection._id,
        due: due,
        color: color,
        usedTime: usedTime,
      })
    })
    if (res.ok) {
      const newArticle = await res.json()
      setArticles([...articles, newArticle])
    }
    return
  }

  // Delete article from DB and remove deleted article from view
  const deleteFromCollection = async (article: IArticle) => {
    const res = await fetch("/api/article", {
      method: "delete",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
        _id: article._id,
        parent: article.parent
      })
    })
    // if deleted
    if (res.ok) {
      const data = await res.json()
      console.log(data.message)
      setArticles(articles.filter((element) => element._id !== article._id))
    }
  }


  // //////////////////////////////////////////////////////////////////// Collection functionality
  // states for handling collection options
  const [openOptions, setOpenOptions] = React.useState<boolean>(() => {return false})
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(() => {return null})
  const [openEdit, setOpenEdit] = React.useState<boolean>(() => {return false})

  // helper functions to manage editing collection
  
  const openCollectionOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenOptions(true)
  }

  const editCollection=() => {
    setOpenEdit(true)
  }

  const saveCollection = async (title: string) => {
    const res = await fetch("api/collection/edit", {
      method: "post",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: collection._id,
        title: title
      })
    })
    if (res.ok) {
      setTitle(title)
    }
  }

  const deleteCollection = () => {
    deleteFromBoard(collection._id)
  }
  

  // init component when navigated to
  const navigate = useNavigate()
  useEffect (() => {
    setLoading(false)
  },[navigate])

  return (
    <>
      {loading ? (
        <Loading />
      ) : 
      (
        <>
          {/* displayed when article is doubleclicked or can be opened trough menu */}
          <EditArticle mode="Create new" open={openCArticle} onClose={handleCloseCreate} saveArticle={createArticle} setTitle={setNewTitle} setContent={setNewContent}
          article={{ _id: new Types.ObjectId, parent: collection._id, owner: new Types.ObjectId, title: "", content: "", color: "blue", due: "", editedAt: new Date(), usedTime: "", comments: [] }}/>


          {/* Edit collection dialog */}
          <EditCollection mode="Edit" collection={collection} open={openEdit} setOpen={setOpenEdit} saveCollection={saveCollection}></EditCollection>


          {/* collection component */}
          <Grid2 size={{lg:3, md:4, sm:6, xs:12}}>
            <Paper
              sx={{
                elevation: 15,
                border: 1,
                minHeight: 260,
                width: 1,
                my: 1,
                mx: 0.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Component header */}
              <Paper
                onDoubleClick={editCollection}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  elevation: 20,
                  bgcolor: "inherit",
                }}
                >
                <Typography 
                  variant='h5'
                  sx={{
                    alignContent:"center",
                    mx:1,
                  }}
                  >
                  {title}
                </Typography>

                {/* component options */}
                <Tooltip title="Options">
                  <IconButton
                    onClick={openCollectionOptions}
                    sx={{
                      height: "100%"
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>

                <Options open={openOptions} setOpen={setOpenOptions} mode='collection' anchorEl={anchorEl} openEdit={editCollection} deleteObject={deleteCollection}/>
              </Paper>

              {/* Component content */}
              <Box
                sx={{
                  width:"100%",
                  height:"100%",
                  m:0,
                  p:0,
                }}
              >
                <Grid2
                  key={`articleGrid_${collection._id.toString()}`}
                  container
                  spacing={1}
                  sx={{
                    p:1
                  }}
                > 
                  {articles.map((article) => (
                    <Article 
                      key={article._id.toString()}
                      article={article}
                      deleteFromCollection={deleteFromCollection}
                    />
                  ))}
                </Grid2>
              </Box>

              {/* Add article button */}
              <Tooltip title="Create article">
                <IconButton
                  onClick={openCreateArticle}
                  sx={{
                    width:"100%",
                    borderRadius: 1,
                    m:0,
                    bgcolor: "inherit",
                    border:1
                  }}
                  >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </Grid2>
        </>
      )}
    </>
  )
}

export default collection