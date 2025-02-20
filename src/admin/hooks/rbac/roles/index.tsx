import { useState, useEffect } from "react";
import { AdminRoleListResponse, PermissionType, RoleDTO, RoleStats } from "../../../../modules/rbac/types";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query";

import { FetchError } from "@medusajs/js-sdk";
import { sdk } from "../../../lib/config";

export const useRoles = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      Record<any, any>,
      FetchError,
      AdminRoleListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const filterQuery = new URLSearchParams(query).toString();
  const fetchRoleSyncs = async (query?: Record<string, any>) => {
    const response = await fetch(
      "/admin/rbac/role" + (query ? `?${filterQuery}` : ""),
    );

    if (!response.ok) {
      throw new Error(`Error fetching permissions: ${response.statusText}`);
    }

    return response.json();
  };

  return useQuery({
    queryKey: ["roles", query],
    queryFn: () => fetchRoleSyncs(query),
    ...options,
  });
};

export const useRolesCount = (
  query?: Record<string, any>
): {
  roleStats: RoleStats;
  loading: boolean;
} => {
  const [roleStats, setRoleStats] = useState({
    totalRoles: 0,
    rolesWithUsers: 0,
    rolesWithoutUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const filterQuery = new URLSearchParams(query).toString();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "/admin/rbac/role" + (query ? `?${filterQuery}` : "")
        );
        const result = await response.json();
        const roles = result.roles;
        const totalRoles = result.count;
        const rolesWithUsers = roles.filter((role: RoleDTO) => role.users && role.users.length > 0).length;
        const rolesWithoutUsers = totalRoles - rolesWithUsers;

        setRoleStats({
          totalRoles,
          rolesWithUsers,
          rolesWithoutUsers
        });
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roleStats, loading };
};

export const useCreateRole = (
  options?: UseMutationOptions<
    RoleDTO,
    FetchError,
    { 
      name: string; permissions?: string[] 
      | { name: string; predefined: boolean; action: PermissionType; id?: string }[][]
    }
  >
) => {
  return useMutation({
    mutationFn: (payload) => fetch("/admin/rbac/role", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([payload])
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error creating role: ${response.statusText}`);
      }
      return response.json();
    }),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateRole = (
  options?: UseMutationOptions<
    RoleDTO,
    FetchError,
    { 
      name: string; id?: string; permissions?: string[] 
      | { name: string; predefined: boolean; action: PermissionType; id?: string }[][]
    }
  >
) => {
  return useMutation({
    mutationFn: (payload) => fetch(`/admin/rbac/role/${payload.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error creating role: ${response.statusText}`);
      }
      return response.json();
    }),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export async function useDeleteRole(roleId: string) {
  try {
    await sdk.client.fetch('/admin/rbac/role/' + roleId, {
      method: 'DELETE',
    })
    return true;
  } catch (error) {
    return false;
  }
}
