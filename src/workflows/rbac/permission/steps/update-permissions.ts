import { RBAC_MODULE } from "../../../../modules/rbac"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import RbacModuleService from "src/modules/rbac/service"
import { UpdatePermissionDTO } from "src/modules/rbac/types"

export const updatePermissionsStepId = "update-permissions-step"
/**
 * This step updates one or more permissions.
 */
export const updatePermissionsStep = createStep(
    updatePermissionsStepId,
  async (input: UpdatePermissionDTO[], { container }) => {
    const service: RbacModuleService = container.resolve(RBAC_MODULE)
    if (!input.length) {
      return new StepResponse([], [])
    }

    const originalPermissions = await service.listPermissions({
      id: input.map((u) => u.id),
    })

    const permissions = await service.updatePermissions(input)
    return new StepResponse(permissions, originalPermissions)
  },

  async (originalPermissions, { container }) => {
    if (!originalPermissions?.length) {
      return
    }

    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.updatePermissions(
      originalPermissions.map((u) => ({
        id: u.id,
        name: u.name,
        metadata: u.metadata,
        roles: u.roles,
      }))
    )
  }
)