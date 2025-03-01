import { ICollection } from "../interfaces/ICollection"

export function useBoard() {  
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
          return data
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
  return {getBoard}
}