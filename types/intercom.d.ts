// Type definitions for Intercom Messenger SDK
declare module "@intercom/messenger-js-sdk" {
  interface IntercomOptions {
    app_id: string
    user_id?: string
    name?: string
    email?: string
    created_at?: number
    [key: string]: any
  }

  interface IntercomStatic {
    (command: "boot" | "shutdown" | "update" | "hide" | "show" | string, options?: any): void
    (options: IntercomOptions): void
  }

  const Intercom: IntercomStatic
  export default Intercom
}

// Add Intercom to the Window interface
interface Window {
  Intercom?: any
}
