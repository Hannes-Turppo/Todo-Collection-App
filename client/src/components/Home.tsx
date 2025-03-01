import React, { useEffect } from 'react'
import { useBoard } from '../hooks/useBoard'
import { validateToken } from '../hooks/validateToken'
import { ICollection } from '../interfaces/ICollection'
import Loading from './Loading'
import Board from './Board/Board'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../interfaces/IUser'
import { Types } from 'mongoose'

function home() {
  const [loading, setLoading] = React.useState<boolean>(() => {return true})
  const [validToken, setValidToken] = React.useState<boolean>(() => { return false })
  const [board, setBoard] = React.useState<ICollection[]>(() => {return []})
  const [user, setUser] = React.useState<IUser | null>(() => {return null})
  // const [] = React.useState<>(() => {})

  // hooks
  const {getBoard} = useBoard()

  // init component when navigated to
  const navigate = useNavigate()
  useEffect(() => {
    const initialize = async () => {
      try {

        const validToken: boolean = await validateToken()
        if (validToken) {
          setValidToken(validToken)
          
          // get user info from server
          const res = await fetch("api/user", {
            headers: {
              "authorization": `Bearer: ${localStorage.getItem("token")}`
            }
          })
          if (res.ok) {
            const data = await res.json() as IUser
            setUser(data)
          }
        }
      
        const Board: ICollection[] = await getBoard()
        if (Board) setBoard(Board)
        setLoading(false)
      } catch (error: any) {
        console.log(error)
      }
    }
    initialize()
  },[navigate])


  return (
    <>
    {loading ? (
      <Loading />
    ) : (
      <Board validToken={validToken} board={board} user={user}></Board>
    )}
    </>
  )
}

export default home