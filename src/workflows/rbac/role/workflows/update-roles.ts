import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { updateRolesStep } from "../steps"
import { RoleDTO, UpdateRoleDTO } from "../../../../modules/rbac/types"
import { RBAC_MODULE } from "src/modules/rbac";
import { arrayDifference, Modules } from "@medusajs/framework/utils";
import { createRemoteLinkStep, dismissRemoteLinkStep, updateRemoteLinksStep, useQueryGraphStep, useRemoteQueryStep } from "@medusajs/medusa/core-flows";
import roleUserLink from "../../../../links/role-user"

type UpdateRoleWorkflowInputDTO = {
  roles: UpdateRoleDTO[];
};

function prepareRoleLinks({
  input,
}: {
  input: UpdateRoleWorkflowInputDTO
}): Record<string, Record<string, any>>[] {
  if (!input.roles.length) {
    return []
  }

  return input.roles
    .filter((r) => r.users)
    .flatMap((r) =>
      r.users!.map((user) => ({
        [RBAC_MODULE]: {
          role_id: r.id,
        },
        [Modules.USER]: {
          user_id: user,
        },
      }))
    )
}

function prepareToDeleteRoleLinks({
  currentRoleLinks,
}: {
  currentRoleLinks: {
    role_id: string
    user_id: string
  }[]
}) {
  if (!currentRoleLinks.length) {
    return []
  }

  return currentRoleLinks.map(
    ({ role_id, user_id }) => ({
      [RBAC_MODULE]: {
        role_id,
      },
      [Modules.USER]: {
        user_id,
      },
    })
  )
}

function findRolesWithUsers({
  updatedRoles,
  input,
}: {
  updatedRoles: RoleDTO[]
  input: UpdateRoleWorkflowInputDTO
}) {
  let roleIds = updatedRoles.map((r) => r.id)

  console.log("roleIds", roleIds);

  if (input.roles) {
    const discardedRoleIds: string[] = input.roles
      .filter((r) => !r.users)
      .map((r) => r.id as string)
    return arrayDifference(roleIds, discardedRoleIds)
  }

  return roleIds
}


export const updateRolesWorkflowId = "update-roles-workflow"

export const updateRolesWorkflow = createWorkflow(
  updateRolesWorkflowId,
  function (input: WorkflowData<UpdateRoleWorkflowInputDTO>): WorkflowResponse<RoleDTO[]> {

    const updatedRoles = updateRolesStep(input.roles)

    const roleLinks = transform(
      { input },
      prepareRoleLinks
    )

    const rolesWithUsers = transform(
      { updatedRoles, input },
      findRolesWithUsers
    )

    const currentRoleLinks = useRemoteQueryStep({
      entry_point: roleUserLink.entryPoint,
      fields: ["role_id", "user_id"],
      variables: { filters: { role_id: rolesWithUsers } },
    }).config({ name: "get-current-role-links-step" })

    const toDeleteRoleLinks = transform(
      { currentRoleLinks },
      prepareToDeleteRoleLinks
    )

    dismissRemoteLinkStep(toDeleteRoleLinks).config({
      name: "delete-role-links-step",
    })


    createRemoteLinkStep(roleLinks).config({
      name: "create-role-links-step",
    })
    

    return new WorkflowResponse(updatedRoles);
  }
);