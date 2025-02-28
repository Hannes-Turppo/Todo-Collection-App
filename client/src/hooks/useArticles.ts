import React from "react";
import { IArticle } from "../interfaces/IArticle";

export function useArticles () {
  const [articles, setArticles] = React.useState<IArticle[] | null>(() => {return null})

  const getArticles = async () => {
    try {
      const token: string | null = localStorage.getItem("token")
      const res = await fetch("/api/articles", {
        method: "get",
        headers: {
          "authorization": `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data: IArticle[] | null = await res.json()
        if (data) {
          setArticles(data)
          console.log("Articles fetched:", data)
          return data as IArticle[]
        }
      } else {
        console.error("Failed to fetch articles:", res.statusText)
      }
      return []

    } catch (error: any) {
      console.error("Error fetching articles:", error)
      return []
    }
  }

  const saveArticle = () => {}

  return {articles, getArticles, saveArticle}
}