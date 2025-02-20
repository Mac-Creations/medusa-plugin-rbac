import RbacModuleService from "../service";
import { UserDTO } from "@medusajs/framework/types";

export enum PermissionType {
    READ = "read",
    WRITE = "write",
    DELETE = "delete"
}

export interface RoleDTO {
    id: string;
    name: string;
    permissions?: PermissionDTO[];
    users?: UserDTO[];
}

export interface PermissionDTO {
    id?: string;
    name: string;
    target: string;
    predefined: boolean;
    action: PermissionType;
    roles?: RoleDTO[]
}

export interface RoleStats {
    totalRoles: number;
    rolesWithUsers: number;
    rolesWithoutUsers: number;
}

export interface PermissionStats {
    totalPermissions: number;
    totalPredefined: number;
    totalCustoms: number;
}

export interface MemberStats {
    totalMembers: number;
    totalAssigned: number;
    totalUnassigned: number;
}


declare module "@medusajs/framework/types" {
    export interface ModuleImplementations {
        rbacModuleService: RbacModuleService;
    }
}