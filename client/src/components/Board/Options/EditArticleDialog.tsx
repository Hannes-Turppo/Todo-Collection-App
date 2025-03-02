import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField } from '@mui/material'
import { IArticle } from '../../../interfaces/IArticle'
import React, { useEffect, useState } from 'react'

interface dialogProps {
  mode: string
  article: IArticle
  open: boolean
  onClose: () => void
  setTitle: (title: string) => void
  setContent: (title: string) => void
  saveArticle: (title: string, content: string, color: string, due: string, usedTime: string ) => void
}

const colorOptions = [
  {hex: "whiteSmoke", name: "white"},
  {hex: "#518ded", name: "Blue"},
  {hex: "#ff5454", name: "Red"},
  {hex: "#9fd17d", name: "green"},
]

function EditArticle({ mode, article, open, onClose, saveArticle, setTitle, setContent }: dialogProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [localTitle, setLocalTitle] = useState<string>(() => {return article.title})
  const [localContent, setLocalContent] = useState<string>(() => {return article.content})
  const [localColor, setLocalColor] = useState<string>(() => {return article.color})
  const [localDue, setLocalDue] = useState<string>(() => {return article.due})
  const [localUsedTime, setLocalUsedTime] = useState<string>(() => {return article.usedTime})
  
  const handleSave = () => {
    setTitle(localTitle)
    setContent(localContent)
    saveArticle(localTitle, localContent, localColor, localDue, localUsedTime )

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

  
  // handle color menu
  const [openColors, setOpenColors] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(() => {return null})
  const handleCloseColors = () => {
    setOpenColors(false)
  }


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
              label="Title"
              value={localTitle}
              onChange={(e) => {setLocalTitle(e.target.value)}}
              sx={{ mt: 1 }}
            />
            <TextField
              multiline={true}
              label="Content"
              value={localContent}
              onChange={(e) => {setLocalContent(e.target.value)}}
            />
            <TextField
              label="Used time"
              value={localUsedTime}
              onChange={(e) => {setLocalUsedTime(e.target.value)}}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Due"
              value={localDue}
              onChange={(e) => {setLocalDue(e.target.value)}}
              sx={{ mt: 1 }}
            />

            <Button 
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setAnchorEl(e.currentTarget)
                  setOpenColors(true)
                }}
                sx ={{bgcolor: localColor}}
              >
              Color</Button>
            <Menu 
              open={openColors}
              onClose={handleCloseColors}
              anchorEl={anchorEl}
              sx={{zIndex: 2100}}
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.name}
                onClick={() => {setLocalColor(option.hex), setOpenColors(false)}}
                sx={{bgcolor: option.hex}}
                >
                  {option.name}</MenuItem>
              ))}
            </Menu>

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