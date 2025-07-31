// Type definitions for Intercom Messenger SDK
// Note: Basic module declaration is in global.d.ts

// Extended Intercom types
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

// Extend the module declaration from global.d.ts
declare module "@intercom/messenger-js-sdk" {
  const Intercom: IntercomStatic
  export default Intercom
  export { IntercomOptions, IntercomStatic }
}
