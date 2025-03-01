import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { ICollection } from '../../../interfaces/ICollection'
import React, { useEffect } from 'react'

interface dialogProps {
  mode: string
  collection: ICollection
  open: boolean
  setOpen: (open: boolean) => void
  saveCollection: (title: string) => void
}

function EditCollection({ mode, collection, open, setOpen, saveCollection }: dialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localTitle, setLocalTitle] = React.useState<string>(() => {return ""})

  const handleSave = () => {
    saveCollection(localTitle)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  };

  useEffect(() => {
    setLocalTitle(collection.title)
    setLoading(false)
  }, [collection])

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