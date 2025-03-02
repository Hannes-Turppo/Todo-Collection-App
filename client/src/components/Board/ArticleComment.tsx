import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IComment } from '../../interfaces/IComment';
import { ObjectId } from 'mongoose';

interface commentProps {
  comment: IComment
  deleteComment: (id: ObjectId) => void
}


function ArticleComment({comment, deleteComment}: commentProps) {

  // handle comment deletion in Article component
  const handleDelete = () => {
    deleteComment(comment.id)
  }


  // Component
  return (
    <>
      <Paper sx={{
        elevation: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        m:1,
        bgcolor: comment.color,
      }}
      >
        {/* display comment and time it was created: */}
        <Box sx={{
          display:"flex",
          flexDirection:"column"
        }}>
          <Typography sx={{ mx: 1 }}>{comment.content}</Typography>
          <Typography sx={{ mx: 1, fontSize:12 }}>Posted: {new Date(comment.createdAt).toLocaleString()}</Typography>
        </Box>

        {/* delete button */}
        <Tooltip title="Delete comment">
          <IconButton onClick={handleDelete} >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </>
  )
}

export default ArticleComment