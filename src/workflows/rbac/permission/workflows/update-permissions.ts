import {
    createWorkflow,
    transform,
    WorkflowData,
    WorkflowResponse,
  } from "@medusajs/workflows-sdk";
import { updatePermissionsStep } from "../steps"
import { PermissionDTO, UpdatePermissionDTO } from "../../../../modules/rbac/types"

type UpdatePermissionWorkflowInputDTO = {
  updates: UpdatePermissionDTO[];
};

export const updatePermissionsWorkflowId = "update-permissions-workflow"

export const updatePermissionsWorkflow = createWorkflow(
    updatePermissionsWorkflowId,
    function (input: WorkflowData<UpdatePermissionWorkflowInputDTO>): WorkflowResponse<PermissionDTO[]> {

      const updatedPermissions = updatePermissionsStep(input.updates)

      const  permissionIdEvents = transform({ updatedPermissions }, ({ updatedPermissions }) => {
        const arr = Array.isArray(updatedPermissions) ? updatedPermissions : [updatedPermissions]

        return arr?.map((permission) => {
          return { id: permission.id }
        })
      })
  
      return new WorkflowResponse(updatedPermissions);
    }
);