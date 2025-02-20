import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { deleteRolesStep } from "../steps/delete-roles"

export type DeleteRolesWorkflowInput = { ids: string[] }

export const deletePermissionsWorkflowId = "delete-role-workflow"
/**
 * This workflow deletes one or more roles.
 */
export const deleteRolesWorkflow = createWorkflow(
  deletePermissionsWorkflowId,
  (
    input: WorkflowData<DeleteRolesWorkflowInput>
  ): WorkflowData<void> => {
    deleteRolesStep(input.ids)

    const userIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })
  }
)