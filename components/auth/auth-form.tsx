"use client"

import type React from "react"
import { useState } from "react"

interface AuthFormProps {
  type: "login" | "register"
  isLoading?: boolean
  onSubmit: () => void
}

const AuthForm: React.FC<AuthFormProps> = ({ type, isLoading, onSubmit }) => {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async () => {
    setIsPending(true)
    try {
      await onSubmit()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full">
      <div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          disabled={isPending}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-brand-google"
              >
                <path d="M17.788 5.108a9 9 0 1 0 -11.774 0h0a1 1 0 0 0 1 1h9.748a1 1 0 0 0 1 -1z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          disabled={isPending}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-brand-github"
              >
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 1 -1.2 3 -1.7c-4 0 -6 -2 -6 -4.8c0 -1 1 -2 2 -3c-1 0 -2 -1 -2 -2c0 0 1 0 3 1.5c1.5 0.2 2 1 4 2c-1 1 -2 2 -2 2c1 1 2 2 2 2c1 0 2 1 2 1c-3 1 -5 1 -6 0" />
              </svg>
              Continue with Github
            </>
          )}
        </button>
      </div>
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm font-medium text-gray-500">Or continue with</div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="email"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter email address"
            />
            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-mail text-gray-500"
              >
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <path d="M22 7l-10 5l-10 -5" />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type="password"
              id="password"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter password"
            />
            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-key text-gray-500"
              >
                <path d="M8 11a4 4 0 1 1 8 0a4 4 0 0 1 -8 0" />
                <path d="M10 10v-5a2 2 0 1 1 4 0v5" />
                <path d="M12 16l-1 -1l-4 4l-2 -2l4 -4l1 1" />
              </svg>
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center bg-black text-white font-medium py-3 px-4 rounded-xl hover:bg-black/90 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span>{type === "login" ? "Sign In" : "Create Account"}</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default AuthForm
