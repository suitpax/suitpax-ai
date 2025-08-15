import { z } from "zod"

export const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a message"),
})

export type FormValues = z.infer<typeof formSchema>
