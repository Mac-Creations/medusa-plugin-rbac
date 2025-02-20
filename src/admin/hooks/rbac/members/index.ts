import { useEffect, useState } from "react";
import { MemberStats, MemberDTO, AdminMemberListResponse, RoleDTO } from "../../../../modules/rbac/types";
import { 
  QueryKey, 
  useQuery, 
  UseQueryOptions
} from "@tanstack/react-query";

import { FetchError } from "@medusajs/js-sdk";

export const useMembers = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      Record<any, any>,
      FetchError,
      AdminMemberListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const filterQuery = new URLSearchParams(query).toString();
  const fetchPermissionSyncs = async (query?: Record<string, any>): Promise<MemberDTO[]> => {
    const response = await fetch(
      "/admin/users" + (query ? `?${filterQuery}` : ""),
    );

    if (!response.ok) {
      throw new Error(`Error fetching permissions: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      ...data,
      users: data.users.map((user: any) => ({
      ...user,
      role: user.role ? (Array.isArray(user.role) ? user.role : [user.role]) : [],
      }))
    }
  };

  return useQuery({
    queryKey: ["users", query],
    queryFn: () => fetchPermissionSyncs(query),
    ...options,
  });
};



export const useMembersCount = (
  query: Record<string, any> = {}
): {
  memberStats: MemberStats;
  loading: boolean;
} => {
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    totalAssigned: 0,
    totalUnassigned: 0
  });
  const [loading, setLoading] = useState(true);
  const filterQuery = new URLSearchParams(query).toString();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          "/admin/users" + (query ? `?${filterQuery}` : "")
        );
        const result = await response.json();
        const users = result.users;
        const totalMembers = result.count;
        const totalAssigned = users.filter((member: MemberDTO) => member.role && member.role.length > 0).length;
        const totalUnassigned = totalMembers - totalAssigned;

        setMemberStats({
          totalMembers,
          totalAssigned,
          totalUnassigned
        });
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { memberStats, loading };
};

export const assignRoleUser = async (
  member: MemberDTO,
): Promise<MemberDTO | null> => {
  if (!member) {
    console.error("Member is required to assign a role.");
    return null;
  }
  
  try {
    const response = await fetch(`/admin/rbac/assign/${member.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roles: member.role ? (Array.isArray(member.role) ? member.role.map((role) => role.id) : [(member.role as RoleDTO).id]) : [],
      }),
    });

    if (!response.ok) {
      const errorMessage = `Failed to assign role. Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error assigning role:", error);
    return null;
  }
};