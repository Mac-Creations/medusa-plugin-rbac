import RbacModuleService from "../service";

export interface RoleDTO {
    id: string;
    name: string;
    permissions?: PermissionDTO[];
}

export interface PermissionDTO {
    id: string;
    name: string;
    metadata: Record<string, boolean>;
    roles?: RoleDTO[]
}

declare module "@medusajs/framework/types" {
    export interface ModuleImplementations {
        rbacModuleService: RbacModuleService;
    }
}