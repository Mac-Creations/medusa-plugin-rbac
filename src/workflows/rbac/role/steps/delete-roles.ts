import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { RBAC_MODULE } from "src/modules/rbac"
import RbacModuleService from "src/modules/rbac/service"

export const deleteRolesStepId = "delete-roles-step"
/**
 * This step deletes one or more roles.
 */
export const deleteRolesStep = createStep(
    deleteRolesStepId,
  async (input: string[], { container }) => {
    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.softDeleteRoles(input)

    return new StepResponse(void 0, input)
  },
  async (prevRoleIds, { container }) => {
    if (!prevRoleIds?.length) {
      return
    }

    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.restoreRoles(prevRoleIds)
  }
)