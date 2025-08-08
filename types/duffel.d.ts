declare module "@duffel/api" {
  export interface DuffelOptions {
    token: string
    environment?: "test" | "production"
  }

  export class Duffel {
    constructor(options: DuffelOptions)
    aircraft: {
      get: (id: string) => Promise<{ data: any }>
      list: (args: { limit?: number; after?: string; before?: string }) => Promise<{
        data: any[]
        meta?: any
      }>
    }
  }
}
