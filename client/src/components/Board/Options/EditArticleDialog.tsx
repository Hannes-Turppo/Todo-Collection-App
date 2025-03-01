import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { IArticle } from '../../../interfaces/IArticle'
import React, { useEffect } from 'react'

interface dialogProps {
  mode: string
  article: IArticle
  open: boolean
  onClose: () => void
  setTitle: (title: string) => void
  setContent: (title: string) => void
  saveArticle: (title: string, content: string) => void
}

function EditArticle({ mode, article, open, onClose, saveArticle, setTitle, setContent }: dialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localTitle, setLocalTitle] = React.useState<string>(() => {return ""})
  const [localContent, setLocalContent] = React.useState<string>(() => {return ""})
  // const [] = React.useState<>()

  const handleSave = () => {
    setTitle(localTitle)
    setContent(localContent)
    saveArticle(localTitle, localContent)
    onClose()
  }

  const handleClose = () => {
    onClose()
  };

  useEffect(() => {
    setLocalTitle(article.title)
    setLocalContent(article.content)
    setLoading(false)
  }, [article])

  return (
    <>
      {!loading && 
      (
        <Dialog 
          open={open}
          onClose={handleClose}
          sx={{
            zIndex: 2000,
          }}
        >
          <DialogTitle>{mode} article</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: {sm: 450, xs: 300 },
            }}
          >
            <TextField
              multiline={true}
              id="titleField"
              label="Title"
              value={localTitle}
              onChange={(e) => {setLocalTitle(e.target.value)}}
              sx={{ mt: 1 }}
            />

            <TextField
              multiline={true}
              id="contentField"
              label="Content"
              value={localContent}
              onChange={(e) => {setLocalContent(e.target.value)}}
            />

          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleSave}>Save</Button>
            <Button variant='outlined' onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default EditArticle