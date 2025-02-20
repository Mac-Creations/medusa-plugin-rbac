import { z } from "zod"
import { PermissionCreateSchema } from "./constants"

export type PermissionCreateSchemaType = z.infer<typeof PermissionCreateSchema>