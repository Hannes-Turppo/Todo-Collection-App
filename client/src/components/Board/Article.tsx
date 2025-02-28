import React, { useEffect } from 'react'
import { Grid2, IconButton, Paper, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IArticle } from '../../interfaces/IArticle';
import Loading from '../Loading';
import EditArticle from './EditArticleDialog';
import { useNavigate } from 'react-router-dom';
import ArticleOptions from './articleOptions';

interface articleProps {
  article: IArticle
}

function Article({article}: articleProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [openOptions, setOpenOptions] = React.useState<boolean>(() => {return false})
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(() => {return null})
  const [editingArticle, setEditingArticle] = React.useState<boolean>(() => {return false})
  const [title, setTitle] = React.useState<string>(() => {return article.title})
  const [content, setContent] = React.useState<string>(() => {return article.content})
  // const [] = React.useState<>()

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
  const handleSaveArticle = async (title: string, content: string) => {
    const res = await fetch("/api/article/save", {
      method: "post",
      body: JSON.stringify({
        _id: article._id,
        title: title,
        content: content,
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

  }

  const handleDeleteArticle = () => {

  }

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
            <EditArticle open={editingArticle} onClose={handleCloseEdit} article={article} saveArticle={handleSaveArticle} setTitle={setTitle} setContent={setContent}/>

            <Paper
              onDoubleClick={handleOpenEdit}
              sx={{
                elevation: 20,
                border:1,
              }}
              >
              <Paper sx={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                elevation: 20,
              }}>
                {/* Article header */}
                <Typography sx={{ml:1}}>{title}</Typography>

                <IconButton onClick={openMenu}>
                  <MoreVertIcon />
                </IconButton>
                <ArticleOptions open={openOptions} setOpen={setOpenOptions} openEdit={handleOpenEdit} anchorEl={anchorEl} deleteArticle={handleDeleteArticle}/>

              </Paper>
              <Typography sx={{m:1, minHeight:100, }}>{content}</Typography>
            </Paper>
          </>
        )}
      </Grid2>
    </>
  )
}

export default Article