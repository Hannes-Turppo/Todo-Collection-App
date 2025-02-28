export async function validateToken () {
  const token: string | null = localStorage.getItem("token")
  let validToken: boolean = false

  const res = await fetch("/api/validateToken", {
      headers: {
        "authorization": `Bearer: ${token}`
      }
    }
  )

  if (res.ok) validToken = true
  return validToken
}