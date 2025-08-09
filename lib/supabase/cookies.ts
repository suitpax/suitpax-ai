import { cookies } from "next/headers"
import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

export const cookieStore = {
  get(name: string) {
    const requestCookies = cookies()
    return requestCookies.get(name)?.value
  },
  getAll(name?: string) {
    const requestCookies = cookies()
    if (name) {
      const cookie = requestCookies.get(name)
      return cookie ? [cookie] : []
    }
    return requestCookies.getAll()
  },
  set(name: string, value: string, options: Partial<ResponseCookie>) {
    const requestCookies = cookies()
    requestCookies.set(name, value, options)
  },
  remove(name: string, options: { path?: string; domain?: string }) {
    const requestCookies = cookies()
    requestCookies.delete(name, options)
  }
}
