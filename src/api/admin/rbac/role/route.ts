import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import {
  CreateRoleDTO,
  RoleDTO,
} from "../../../../modules/rbac/types"
import {
  createRolesWorkflow,
} from "../../../../workflows/rbac/role/workflows"
import { roleSchema } from "./validation-schemas"

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

    const roleQuery = {
      entity: "role",
      fields: ["*", "permissions.*"],
      filters,
      pagination: {
        take,
        skip,
      },
    };

    const { data: roles } = await query.graph(roleQuery);

    return res.status(200).json(roles);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreateRoleDTO[]>,
  res: MedusaResponse<RoleDTO>) {
    
  const validatedBody = roleSchema.parse(req.body) as CreateRoleDTO[]

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA
  }
  try {
  const { result: role } = await createRolesWorkflow(req.scope)
    .run({
      input: {
        role: validatedBody,
      },
    })
  
  return res.status(200).json(role)
  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}