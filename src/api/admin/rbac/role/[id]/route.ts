import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  MedusaError,
} from "@medusajs/framework/utils"
import { RBAC_MODULE } from "src/modules/rbac"
import { RoleDTO, UpdateRoleDTO } from "src/modules/rbac/types"
import { updateRolesWorkflow } from "src/workflows/rbac/role/workflows/update-roles"
import { roleSchema } from "../validation-schemas"
import { deleteRolesWorkflow } from "src/workflows/rbac/role/workflows"

// Get role
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  const rbacModuleService = req.scope.resolve(RBAC_MODULE)

  const role = await rbacModuleService.retrieveRole(id, {
    relations: ["permissions"],
  })

  if (!role) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Role with id: ${id} was not found`
    )
  }

  res.status(200).json({ role })
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdateRoleDTO[]>,
  res: MedusaResponse
) {
  const validatedBody = roleSchema.parse(req.body) as UpdateRoleDTO[]

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA
  }

  try {
    const { result: role } = await updateRolesWorkflow(req.scope).run({
      input: {
        updates: [
          {
            ...req.body,
            id: req.params.id,
          } as UpdateRoleDTO,
        ],
      },
    })

    res.status(200).json(role)

  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}

// delete role
export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  try {
    await deleteRolesWorkflow(req.scope).run({
      input: {
        ids: [id],
      },
    })

    res.status(200).json({ id })
  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}