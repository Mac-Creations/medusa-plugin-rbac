import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { createPermissionStep } from "../steps"
import { PermissionDTO } from "../../../../modules/rbac/types"

type WorkflowInput = {
  permission: PermissionDTO[];
};
export const createPermissionsWorkflowId = "create-permissions-workflow"

export const createPermissionWorkflow = createWorkflow(
  createPermissionsWorkflowId,
  function (input: WorkflowData<WorkflowInput>) {
    const permission = createPermissionStep(input.permission);

    return new WorkflowResponse(permission);
  }
);