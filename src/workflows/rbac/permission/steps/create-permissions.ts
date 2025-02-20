import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { PermissionDTO } from "src/modules/rbac/types"
import { RBAC_MODULE } from "../../../../modules/rbac"

export const createPermissionsStepId = "create-permissions-step"

/**
 * This step creates one or more permissions.
 */
export const createPermissionStep = createStep(
  createPermissionsStepId,
  async function (data: PermissionDTO[], { container }) {
    const rbacModuleService = container.resolve(
        RBAC_MODULE
    )

    const permission = await rbacModuleService.createPermissions(data)

    return new StepResponse(permission, permission.id)
  },

  function (id: string, { container }) {
    const rbacModuleService = container.resolve(
        RBAC_MODULE
    )

    return rbacModuleService.deletePermissions([id])
  }
)