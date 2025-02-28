import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React, { useEffect } from 'react'

interface dialogProps {
  title: string
  content: any[]
  open: boolean
  setOpen: (open: boolean) => void
}

function SimpleDialog({title, content, open, setOpen}: dialogProps) {

  const handleClose = () => {
    setOpen(false)
  };

  return (
    <>
      <Dialog 
        open={open}
        onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              content.map((item) => (
                <Typography>{item.msg}</Typography>
              ))
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SimpleDialog