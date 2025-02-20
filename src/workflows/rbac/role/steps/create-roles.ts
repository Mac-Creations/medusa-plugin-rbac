import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { 
  CreateRoleDTO,
} from "../../../../modules/rbac/types"
import { RBAC_MODULE } from "../../../../modules/rbac"

export const createRolesStepId = "create-roles-step"

/**
 * This step creates one or more roles.
 */
export const createRolesStep = createStep(
  createRolesStepId,
  async function (data: CreateRoleDTO[], { container }) {
    const roleModuleService = container.resolve(
        RBAC_MODULE
    )

    const role = await roleModuleService.createRoles(data)

    return new StepResponse(role, role.id)
  },
  function (id: string, { container }) {
    const roleModuleService = container.resolve(
        RBAC_MODULE
    )

    return roleModuleService.deleteRoles([id])
  }
)