import { z } from "zod"
import { PermissionSchema } from "../permissions/constants"

export const userSchema = z.array(
  z.object({
    id: z.string().optional(),
  })
);

export const assignRoleUserSchema = z.object({
  users: z.array(z.string()),
})

export const RoleCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  permissions: z.union([z.array(PermissionSchema), z.array(z.string())]).optional(),
  users: z.union([z.array(userSchema), z.array(z.string())]).optional(),
})