import { RoleDTO, PermissionDTO } from "./common"

export interface CreateRoleDTO {
    name: string;
    permissions?: PermissionDTO[];
}

export interface UpdateRoleDTO extends Partial<RoleDTO> {
    /**
     * The ID of the role.
     */
    id: string;
}

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
