import { Button, Dialog, DialogActions, DialogTitle, Menu, MenuItem } from '@mui/material'
import React from 'react'

interface articleMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  mode: string
  anchorEl: HTMLElement | null
  openEdit: () => void
  deleteObject: () => void
}

function Options({ mode, anchorEl, open, setOpen, openEdit, deleteObject }: articleMenuProps) {
  const [openDelete, setOpenDelete] = React.useState<boolean>(() => {return false})

  // Ask user if they really want to delete
  const promptDelete = () => {
    setOpenDelete(true)
  }

  // Close delete prompt
  const closeDelete = () => {
    setOpenDelete(false)
  }

  // Close windows and handle deletion up the chain
  const handleDelete = () => {
    setOpenDelete(false)
    setOpen(false)
    deleteObject()
  }

  // Open dialog to edit article
  const handleEdit = () => {
    setOpen(false)
    openEdit()
  }

  // close this menu
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={promptDelete}>Delete</MenuItem>

      {/* Prompt the user if they try to delete article */}
      <Dialog open={openDelete} onClose={closeDelete} sx={{ zIndex: 2000 }}>
        <DialogTitle>Are you sure you want to delete this {mode}?</DialogTitle>
        <DialogActions>
          <Button variant='outlined' onClick={closeDelete}>Cancel</Button>
          <Button variant='contained' onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Menu>
  )
}

export default Options