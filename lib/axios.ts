import axios from "axios"
import { showError } from "@/lib/toast"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  timeout: 30000,
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error?.message || "Unknown error"

    switch (status) {
      case 400:
        showError("Bad request: " + message)
        break
      case 401:
        showError("Unauthorized. Please sign in.")
        break
      case 403:
        showError("Access denied")
        break
      case 404:
        showError("Resource not found")
        break
      case 429:
        showError("Too many requests. Try again later.")
        break
      case 500:
        showError("Server error")
        break
      default:
        showError("Error: " + message)
    }

    return Promise.reject(error)
  },
)

export default instance
