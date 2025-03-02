import React, { useEffect, useState } from 'react'
import { Box, Grid2, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IArticle } from '../../interfaces/IArticle';
import Loading from '../Loading';
import EditArticle from './Options/EditArticleDialog';
import { useNavigate } from 'react-router-dom';
import Options from './Options/Options';
import AddIcon from '@mui/icons-material/Add';
import ArticleComment from './ArticleComment';
import EditComment from './Options/EditCommentDialog';
import { IComment } from '../../interfaces/IComment';
import { ObjectId } from 'mongoose';

interface articleProps {
  article: IArticle
  deleteFromCollection: (articleId: IArticle) => void
}

function Article({article, deleteFromCollection}: articleProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [openOptions, setOpenOptions] = useState<boolean>(() => {return false})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(() => {return null})
  const [editingArticle, setEditingArticle] = useState<boolean>(() => {return false})
  const [title, setTitle] = useState<string>(() => {return article.title})
  const [content, setContent] = useState<string>(() => {return article.content})
  const [color, setColor] = useState<string>(() => {return article.color})
  const [due, setDue] = useState<string>(() => {return article.due})
  const [editedAt, setEditedAt] = useState<Date>(() => {return article.editedAt})
  const [usedTime, setUsedTime] = useState<string>(() => {return article.usedTime})
  const [comments, setCommments] = useState<IComment[]>(() => {return article.comments})
  // const [] = React.useState<>()


  // functionality for opening options and editing article
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenOptions(true)
  }

  const handleOpenEdit = () => {
    setEditingArticle(true)
  }
  const handleCloseEdit = () => {
    setEditingArticle(false)
  }

  // update article in db and local states
  const handleSaveArticle = async (title: string, content: string, color: string, due: string, usedTime: string ) => {
    const res = await fetch("/api/article/save", {
      method: "post",
      body: JSON.stringify({
        _id: article._id,
        title: title,
        content: content,
        color: color,
        due: due,
        usedTime: usedTime,
        comments: comments
      }),
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer: ${localStorage.getItem("token")}`
      }
    })
    // display message from server if !res.ok
    if (!res.ok) {
      const data = await res.json()
      console.log(`Saving article failed: ${data.message}`)
      return
    }
    setColor(color)
    setUsedTime(usedTime)
    setDue(due)
    setEditedAt(new Date())
  }

  // Uses deleteFromCollection in collection.tsx to delete specified article
  const handleDeleteArticle = async () => {
    deleteFromCollection(article)
  }


  // creacing comment for article
  const [creatingComment, setCreatingComment] = useState<boolean>(() => {return false})
  const openCreateComment = () => {
    setCreatingComment(true)
  }

  const handleCreateComment = async (comment: string, color: string) => {
    const res = await fetch("/api/article/addComment", {
      method: "post",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        articleId: article._id,
        comment: comment,
        color: color,
      })
    })
    if (res.ok) {
      // api returns new comment that can be placed into local comments
      const newComment = await res.json()
      setCommments([...comments, newComment])
    }
  }

  const handleDeleteComment = async (id: ObjectId) => {

    const newComments = comments.filter((comment) => (comment.id != id))

    const res = await fetch("/api/article/save", {
      method: "post",
      headers: {
        "authorization": `Bearer: ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: article._id,
        title: title,
        content: content,
        color: color,
        due: due,
        comments: newComments,
        usedTime: usedTime,
      })
    })
    if (res.ok) {
      const data = await res.json()
      setCommments(data.comments)
    }

  }

  // init when navigated
  const navigate = useNavigate()
  useEffect (() => {
    setLoading(false)
  },[navigate])

  return (
    <>
      <Grid2 size={12}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* displayed when article is doubleclicked or can be opened trough menu */}
            <EditArticle mode="Edit" open={editingArticle} onClose={handleCloseEdit} article={article} saveArticle={handleSaveArticle} setTitle={setTitle} setContent={setContent}/>

            {/* displayed when user adds a new comment to article */}
            <EditComment open={creatingComment} setOpen={setCreatingComment} saveComment={handleCreateComment}/>

            <Paper
              onDoubleClick={handleOpenEdit}
              sx={{
                elevation: 20,
                border: 1,
                minHeight: 150,
              }}
              >
                
              
              {/* Article header */}
              <Paper sx={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                elevation: 20,
                bgcolor: color
              }}>
                <Typography sx={{ml:1}}>{title}</Typography>

                <Tooltip title="Options">
                  <IconButton onClick={openMenu}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>

                <Options mode="article" open={openOptions} setOpen={setOpenOptions} openEdit={handleOpenEdit} anchorEl={anchorEl} deleteObject={handleDeleteArticle}/>
              </Paper>


              {/* article content */}
              <Typography sx={{m:1, minHeight:100, }}>{content}</Typography>


              {/* Display article extras */}
              <Box sx={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems:"center"
              }}>
                <Box sx={{
                  display:"flex",
                  flexDirection:"column",
                  justifyContent:"space-between",
                  mx:1,
                }}>
                  <Typography sx={{ fontSize: 13 }}>Used time: {usedTime}</Typography>
                  <Typography sx={{ fontSize: 13 }}>Due: {due}</Typography>
                  <Typography sx={{ fontSize: 13 }}>Edited: {new Date(editedAt).toLocaleString()}</Typography>
                </Box>

                <Tooltip title="Comment">
                  <IconButton
                    onClick={openCreateComment}
                  >
                    <AddIcon />
                  </IconButton>
                  </Tooltip>
              </Box>
              {comments.map((comment) => (
                <ArticleComment key={comment.id.toString()} comment={comment} deleteComment={handleDeleteComment}/>
              ))}
            </Paper>
          </>
        )}
      </Grid2>
    </>
  )
}

export default Article