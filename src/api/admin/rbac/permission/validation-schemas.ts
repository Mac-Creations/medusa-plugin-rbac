import { z } from "zod"

export const permissionSchema = z.array(
  z.object({
    id: z.string().optional(),
    name: z.string(),
    metadata: z.record(z.boolean()).optional(),
  })
);