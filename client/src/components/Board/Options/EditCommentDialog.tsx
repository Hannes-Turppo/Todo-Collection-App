import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { IComment } from '../../../interfaces/IComment'
import { Types } from 'mongoose'

interface dialogProps {
  comment: string
  open: boolean
  setOpen: (open: boolean) => void
  saveComment: (comment: string) => void
}

function EditComment({ comment, open, setOpen, saveComment }: dialogProps) {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [localComment, setlocalComment] = React.useState<string>(() => {return ""})

  const handleSave = () => {
    saveComment(localComment)
    setlocalComment("")
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  };

  useEffect(() => {
    setlocalComment(comment)
    setLoading(false)
  }, [comment])

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

export default EditComment