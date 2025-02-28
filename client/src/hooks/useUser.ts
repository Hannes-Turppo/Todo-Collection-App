import React from "react"
import { IUser } from "../interfaces/IUser"

export function useUser() {
  // store user
  const [user, setUser] = React.useState<IUser|null>(null)

  // get and set user id and name from server
  const getUserInfo = async () => {
    try {
      const token: string | null = localStorage.getItem("token")
      // fetch username an Id
      const res = await fetch("/api/user", {
        method: "get",
        headers: {
          "authorization": `Bearer ${token}`
        }
      })
      // if user is found, unpack data and save state
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  return {user, getUserInfo}
}