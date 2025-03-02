import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField } from '@mui/material'
import React, { useState } from 'react'

interface dialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  saveComment: (comment: string, color: string) => void
}

const colorOptions = [
  {hex: "whiteSmoke", name: "white"},
  {hex: "#518ded", name: "Blue"},
  {hex: "#ff5454", name: "Red"},
  {hex: "#9fd17d", name: "green"},
]


// this function is only used to create comments. they an not be edited.
function EditComment({ open, setOpen, saveComment }: dialogProps) {
  const [localComment, setlocalComment] = React.useState<string>(() => {return ""})
  const [localColor, setLocalColor] = React.useState<string>(() => {return "whiteSmoke"})
  

  const handleSave = () => {
    saveComment(localComment, localColor)
    setlocalComment("")
    setLocalColor("whiteSmoke")
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  };


  // change color utility
  const [openColors, setOpenColors] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(() => {return null})
  const handleCloseColors = () => {
    setOpenColors(false)
  }
  

  return (
    <>
      <Dialog 
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 2000,
        }}
      >
        <DialogTitle>Create comment</DialogTitle>
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
            label="comment"
            value={localComment}
            onChange={(e) => {setlocalComment(e.target.value)}}
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
    </>
  )
}

export default EditComment