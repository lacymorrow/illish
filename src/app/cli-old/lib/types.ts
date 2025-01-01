import { z } from 'zod'

export const addComponentSchema = z.object({
  name: z.string(),
  path: z.string().optional(),
  overwrite: z.boolean().default(false),
})

export type AddComponentInput = z.infer<typeof addComponentSchema>

export type ComponentResult = {
  success: boolean
  error?: string
}

export type Component = {
  name: string
  label: string
  description?: string
  category?: string
}
