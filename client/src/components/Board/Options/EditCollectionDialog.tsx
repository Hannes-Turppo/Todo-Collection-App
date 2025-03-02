import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField } from '@mui/material'
import { ICollection } from '../../../interfaces/ICollection'
import React, { useEffect, useState } from 'react'

interface dialogProps {
  mode: string
  collection: ICollection
  open: boolean
  setOpen: (open: boolean) => void
  saveCollection: (title: string, color: string) => void
}

const colorOptions = [
  {hex: "whiteSmoke", name: "white"},
  {hex: "#518ded", name: "Blue"},
  {hex: "#ff5454", name: "Red"},
  {hex: "#9fd17d", name: "green"},
]


function EditCollection({ mode, collection, open, setOpen, saveCollection }: dialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localTitle, setLocalTitle] = React.useState<string>(() => {return ""})
  const [localColor, setLocalColor] = React.useState<string>(() => {return collection.color})


  const handleSave = () => {
    saveCollection(localTitle, localColor)
    setLocalColor("whiteSmoke")
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  };

  useEffect(() => {
    setLocalTitle(collection.title)
    setLoading(false)
  }, [collection])


  // change color utility
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
          <DialogTitle>{mode} collection</DialogTitle>
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

            {/* color menu */}
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

export default EditCollection