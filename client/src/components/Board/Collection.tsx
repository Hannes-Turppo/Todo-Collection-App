import React, { useEffect } from 'react'
import { ICollection } from '../../interfaces/ICollection'
import { Box, Grid2, IconButton, Paper, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Article from './Article';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';

interface collectionProps {
  collection: ICollection
}

function collection ({collection}: collectionProps) {
  const [loading, setLoading] = React.useState<boolean>(true)


  const navigate = useNavigate()
  useEffect (() => {
    const init = () => {
      setLoading(false)
    }
    init()
  },[navigate])
  
  // making a new article inside a collection
  const createArticle = (event: React.MouseEvent) => {
  }


  const editCollection=(event: React.MouseEvent) => {
    console.log("doubleclick")
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : 
      (
        // collection component
        <Grid2 size={{lg:3, md:4, sm:6, xs:12}}>
          <Paper
            sx={{
              elevation: 15,
              border: 1,
              width: 1,
              my: 1,
              mx: 0.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Component header */}
            <Paper
              onDoubleClick={editCollection}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                elevation: 20,
                bgcolor: "inherit",
              }}
              >
              <Typography 
                variant='h5'
                sx={{
                  alignContent:"center",
                  mx:1,
                }}
                >
                {collection.title}
              </Typography>
              {/* component options */}
              <IconButton
                onClick={editCollection}
                sx={{
                  height: "100%",
                  borderRadius:2
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Paper>

            {/* Component content */}
            <Box
              sx={{
                width:"100%",
                height:"100%",
                m:0,
                p:0,
              }}
            >
              <Grid2
                key="article-grid"
                container
                spacing={1}
                sx={{
                  p:1
                }}
              > 
                {collection.articles.map((article) => (
                  <Article 
                    key={article._id.toString()}
                    article={article}
                  />
                ))}
              </Grid2>
            </Box>

            {/* Add article button */}
            <IconButton
              onClick={createArticle}
              sx={{
                width:"100%",
                borderRadius: 1,
                m:0,
                bgcolor: "inherit",
                border:1
              }}
              >
              <AddIcon />
            </IconButton>
          </Paper>
        </Grid2>
      )}
    </>
  )
}

export default collection