import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { deletePermissionsStep } from "../steps/delete-permissions"

export type DeletePermissionsWorkflowInput = { ids: string[] }

export const deletePermissionsWorkflowId = "delete-permission-workflow"
/**
 * This workflow deletes one or more permissions.
 */
export const deletePermissionsWorkflow = createWorkflow(
  deletePermissionsWorkflowId,
  (
    input: WorkflowData<DeletePermissionsWorkflowInput>
  ): WorkflowData<void> => {
    deletePermissionsStep(input.ids)

    const userIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })
  }
)