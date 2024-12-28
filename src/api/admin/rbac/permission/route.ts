import { 
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import {
  CreatePermissionDTO,
  PermissionDTO,
} from "../../../../modules/rbac/types"
import {
  createPermissionWorkflow,
} from "../../../../workflows/rbac/permission/workflows"
import { permissionSchema } from "./validation-schemas"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const filters = {} as Record<string, any>;
    let take = parseInt(req.query.take as string) || 20;
    let skip = parseInt(req.query.skip as string) || 0;

    for (const key in req.query) {
      if (["take", "skip"].includes(key)) continue;

      filters[key] = req.query[key];
    }

    const permissionQuery = {
      entity: "permission",
      fields: ["*", "roles.*"],
      filters,
      pagination: {
        take,
        skip,
      },
    };

    const { data: permissions } = await query.graph(permissionQuery);

    return res.status(200).json(permissions);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreatePermissionDTO[]>,
  res: MedusaResponse<PermissionDTO>) {
  const validatedBody = permissionSchema.parse(req.body) as PermissionDTO[]

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA
  }
  try {
  const { result: permission } = await createPermissionWorkflow(req.scope)
    .run({
      input: {
        permission: validatedBody,
      },
    })

  return res.status(200).json(permission)
  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}