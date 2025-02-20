import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { createRolesStep } from "../steps"
import { CreateRoleDTO } from "../../../../modules/rbac/types"
import { RBAC_MODULE } from "src/modules/rbac";
import { Modules } from "@medusajs/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";

type WorkflowInput = {
  role: CreateRoleDTO[];
};
export const createRolesWorkflowId = "create-roles-workflow"

export const createRolesWorkflow = createWorkflow(
  createRolesWorkflowId,
  function (input: WorkflowData<WorkflowInput>) {
    const createdRoles = createRolesStep(input.role);

    const roleLinks = transform({input, createdRoles}, (data) => {
      return data.createdRoles.map((createdRole, i) => {
        const inputRole = data.input.role[i]
        return (
          inputRole.users?.map((user) => ({
            [RBAC_MODULE]: {
              role_id: createdRole.id,
            },
            [Modules.USER]: {
              user_id: user
            }
          })
        )) ?? []
      })
      .flat()
    })

    createRemoteLinkStep(roleLinks)

    return new WorkflowResponse(createdRoles);
  }
);