import { z } from "zod"
import { RoleCreateSchema } from "./constants"

export type RoleCreateSchemaType = z.infer<typeof RoleCreateSchema>