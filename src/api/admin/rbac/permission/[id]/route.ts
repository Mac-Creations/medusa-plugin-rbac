import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import {
    MedusaError,
  } from "@medusajs/framework/utils"
  import { RBAC_MODULE } from "src/modules/rbac"
  import { PermissionDTO, UpdatePermissionDTO } from "src/modules/rbac/types"
  import { updatePermissionsWorkflow } from "src/workflows/rbac/permission/workflows/update-permissions"
  import { permissionSchema } from "../validation-schemas"
  import { deletePermissionsWorkflow } from "src/workflows/rbac/permission/workflows"

// Get permission
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  const rbacModuleService = req.scope.resolve(RBAC_MODULE)

  const permission = await rbacModuleService.retrievePermission(id, {
    relations: ["roles"],
  })

  if (!permission) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Permission with id: ${id} was not found`
    )
  }

  res.status(200).json({ permission })
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdatePermissionDTO[]>,
  res: MedusaResponse
) {
  const validatedBody = permissionSchema.parse(req.body) as UpdatePermissionDTO[]

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA
  }

  try {
    const { result: permission } = await updatePermissionsWorkflow(req.scope).run({
      input: {
        updates: validatedBody
      },
    })

    res.status(200).json(permission)
  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params

  try {
    const { result: permission } = await deletePermissionsWorkflow(req.scope).run({
      input: {
        ids: [id],
      },
    })

    res.status(200).json(permission)
  } catch (error) {
    return MedusaError.Types.INVALID_DATA
  }
}