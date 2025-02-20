import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { RBAC_MODULE } from "src/modules/rbac"
import RbacModuleService from "src/modules/rbac/service"

export const deletePermissionsStepId = "delete-permissions-step"
/**
 * This step deletes one or more roles.
 */
export const deletePermissionsStep = createStep(
    deletePermissionsStepId,
  async (input: string[], { container }) => {
    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.softDeletePermissions(input)

    return new StepResponse(void 0, input)
  },
  async (prevPermissionIds, { container }) => {
    if (!prevPermissionIds?.length) {
      return
    }

    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.restoreRoles(prevPermissionIds)
  }
)