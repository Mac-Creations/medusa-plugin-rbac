import { z } from "zod"

import { PermissionType } from "../../../../modules/rbac/types";

export const PermissionSchema = z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      target: z.string(),
      predefined: z.boolean().default(false),
      action: z.nativeEnum(PermissionType)
    })
  );

export const PermissionCreateSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    target: z.string(),
    predefined: z.boolean().default(false),
    action: z.nativeEnum(PermissionType)
  })
