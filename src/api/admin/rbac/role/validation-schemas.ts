import { z } from "zod"
import { permissionSchema } from "../permission/validation-schemas";

export const roleSchema = z.array(
  z.object({
    name: z.string(),
    permissions: z.union([z.array(permissionSchema), z.array(z.string())]).optional(),
  })
);

//Refacto change type to this
// medusa/packages/medusa/src/api/admin/products/validators.ts