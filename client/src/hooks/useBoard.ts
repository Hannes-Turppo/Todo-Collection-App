import { ICollection } from "../interfaces/ICollection"
import React from "react"

export function useBoard() {
  const [Board, setBoard] = React.useState<ICollection[]>(() => {return []})
  
  const getBoard = async () => {
    try {
      const token: string | null = localStorage.getItem("token")
      const res = await fetch("/api/get/board", {
        method: "get",
        headers: {
          "authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data: ICollection[] = await res.json()
        if (data) {
          setBoard(data)
          return data as ICollection[]
        }
      } else {
        console.error("Failed to fetch Board:", res.statusText)
      }
      return []

    } catch (error: any) {
      console.error("Error fetching Board:", error)
      return []
    }
  }

  return { Board, getBoard }
}