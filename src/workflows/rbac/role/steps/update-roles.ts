import { RBAC_MODULE } from "../../../../modules/rbac"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import RbacModuleService from "src/modules/rbac/service"
import { UpdateRoleDTO } from "src/modules/rbac/types"

export const updateRolesStepId = "update-roles-step"
/**
 * This step updates one or more roles.
 */
export const updateRolesStep = createStep(
    updateRolesStepId,
  async (input: UpdateRoleDTO[], { container }) => {
    const service: RbacModuleService = container.resolve(RBAC_MODULE)
    if (!input.length) {
      return new StepResponse([], [])
    }

    const originalRoles = await service.listRoles({
      id: input.map((u) => u.id),
    })

    const roles = await service.updateRoles(input)
    return new StepResponse(roles, originalRoles)
  },

  async (originalRoles, { container }) => {
    if (!originalRoles?.length) {
      return
    }

    const service: RbacModuleService = container.resolve(RBAC_MODULE)

    await service.updateRoles(
      originalRoles.map((u) => ({
        id: u.id,
        name: u.name,
        permissions: u.permissions,
      }))
    )
  }
)