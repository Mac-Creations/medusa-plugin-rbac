import { Role } from ".medusa/types/query-entry-points";
import { RoleDTO, PermissionDTO } from "./common"
import { FindParams, OperatorMap, PaginatedResponse, UserDTO } from "@medusajs/framework/types";

export interface CreateRoleDTO {
    name: string;
    permissions?: PermissionDTO[];
    users?: UserDTO[];
}

export interface UpdateRoleDTO extends Partial<RoleDTO> {}

export interface CreatePermissionDTO {
    name: string;
    metadata: Record<string, boolean>;
    roles?: RoleDTO[]
}

export interface UpdatePermissionDTO extends Partial<PermissionDTO> {
    /**
     * The ID of the permission.
     */
    id: string;
}

export interface MemberDTO extends Partial<UserDTO> {
    /**
     * Roles of the user.
     */
    role: RoleDTO[]
}

export interface AdminPermissionListParams extends FindParams {
    q?: string
    id?: string | string[]
    name: string;
    target: string;
    created_at?: OperatorMap<string>
    updated_at?: OperatorMap<string>
    deleted_at?: OperatorMap<string>
}

export interface AdminRoleListParams extends FindParams {
    q?: string
    id?: string | string[]
    name: string;
    created_at?: OperatorMap<string>
    updated_at?: OperatorMap<string>
    deleted_at?: OperatorMap<string>
}

export interface AdminRoleListResponse
    extends PaginatedResponse<{ roles: RoleDTO[] }> { }

export interface AdminPermissionListResponse
    extends PaginatedResponse<{ permissions: PermissionDTO[] }> { }

export interface AdminMemberListResponse
    extends PaginatedResponse<{ users: MemberDTO[] }> { }