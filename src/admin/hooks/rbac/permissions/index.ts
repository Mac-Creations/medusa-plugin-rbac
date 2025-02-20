import { useState, useEffect } from "react";
import { AdminPermissionListResponse, PermissionDTO, PermissionStats } from "../../../../modules/rbac/types";
import { 
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query";
import { FetchError } from "@medusajs/js-sdk";

export const usePermissions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      Record<any, any>,
      FetchError,
      AdminPermissionListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const filterQuery = new URLSearchParams(query).toString();
  const fetchPermissionSyncs = async (query?: Record<string, any>) => {
    const response = await fetch(
      `/admin/rbac/permission`+ (query ? `?${filterQuery}` : ""),
    );

    if (!response.ok) {
      throw new Error(`Error fetching permissions: ${response.statusText}`);
    }

    return response.json();
  };
  return useQuery({
    queryKey: ["permissions", query],
    queryFn: () => fetchPermissionSyncs(query),
    ...options,
  });
};

export const usePermissionsCount = (
  query?: Record<string, any>
): {
  permissionStats: PermissionStats;
  loading: boolean;
} => {
  const [permissionStats, setPermissionStats] = useState({
    totalPermissions: 0,
    totalPredefined: 0,
    totalCustoms: 0
  });
  const [loading, setLoading] = useState(true);
  const filterQuery = new URLSearchParams(query).toString();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          "/admin/rbac/permission" + (query ? `?${filterQuery}` : "")
        );
        const result = await response.json();
        const permissions = result.permissions;
        const totalPermissions = result.count;
        const { totalPredefined, totalCustoms } = permissions.reduce(
          (acc: { 
            totalPredefined: number; 
            totalCustoms: number 
          }, permission: PermissionDTO) => {
            if (permission.predefined) {
              acc.totalPredefined += 1;
            } else {
              acc.totalCustoms += 1;
            }
            return acc;
          },
          { totalPredefined: 0, totalCustoms: 0 }
        );

        setPermissionStats({
          totalPermissions,
          totalPredefined,
          totalCustoms
        });
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return { permissionStats, loading };
};

export const useCreatePermission = (
  options?: UseMutationOptions<
    PermissionDTO,
    FetchError,
    PermissionDTO
  >
) => {
  return useMutation({
    mutationFn: (payload) => fetch("/admin/rbac/permission", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([payload])
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error creating permission: ${response.statusText}`);
      }
      return response.json();
    }),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdatePermission = (
  options?: UseMutationOptions<
    PermissionDTO,
    FetchError,
    PermissionDTO
  >
) => {
  return useMutation({
    mutationFn: (payload) => fetch(`/admin/rbac/permission/${payload.id}`, {
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