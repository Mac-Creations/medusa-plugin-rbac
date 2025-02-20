import {
    createRemoteLinkStep,
    dismissRemoteLinkStep,
    useRemoteQueryStep
} from "@medusajs/core-flows";
import { arrayDifference, Modules } from "@medusajs/utils"
import {
    WorkflowData,
    WorkflowResponse,
    createWorkflow,
    transform,
} from "@medusajs/workflows-sdk";
import { RBAC_MODULE } from "src/modules/rbac";
import roleUserLink from "../../../../links/role-user"

type AssignUserRoleListWorkflowInputDTO = {
    user_id: string;
    roles: string[];
};

function prepareUserLinks({
  input,
}: {
  input: AssignUserRoleListWorkflowInputDTO
}): Record<string, Record<string, any>>[] {
  if (!input.roles.length) {
    return []
  }

  return input.roles
    .flatMap((role) => ({
      [RBAC_MODULE]: {
        role_id: role,
      },
      [Modules.USER]: {
        user_id: input.user_id,
      },
    }))

}

function prepareToDeleteUserLinks({
  input,
  currentUserLinks,
}: {
  input: AssignUserRoleListWorkflowInputDTO,
  currentUserLinks: {
    role_id: string
    user_id: string
  }[]
}) {

  if (!currentUserLinks.length) {
    return []
  }
  
  const currentRoleIds = currentUserLinks.map(link => link.role_id);
  const rolesToDelete = arrayDifference(currentRoleIds, input.roles);

  return rolesToDelete.map(role_id => ({
    [RBAC_MODULE]: {
      role_id,
    },
    [Modules.USER]: {
      user_id: input.user_id,
    },
  }));
}

export const assigneUserRoleListWorkflowId = "assign-user-role-workflow"

export const assigneUserRoleListWorkflow = createWorkflow(
  assigneUserRoleListWorkflowId,
    function (input: WorkflowData<AssignUserRoleListWorkflowInputDTO>) {

        const usersLinks = transform(
          { input },
          prepareUserLinks
        )

        const currentUserLinks = useRemoteQueryStep({
          entry_point: roleUserLink.entryPoint,
          fields: ["role_id", "user_id"],
          variables: { filters: { user_id: [ input.user_id ] } },
        }).config({ name: "get-current-user-links-step" })

        const toDeleteUserLinks = transform(
            { input, currentUserLinks },
            prepareToDeleteUserLinks
          )

        dismissRemoteLinkStep(toDeleteUserLinks).config({
            name: "delete-assign-links-step",
        })
        
        
        createRemoteLinkStep(usersLinks).config({
            name: "create-assign-links-step",
        })

        return new WorkflowResponse(currentUserLinks);
    }
);