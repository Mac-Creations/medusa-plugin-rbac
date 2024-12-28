import { useState, useEffect } from "react";
import { RoleDTO } from "../../../../modules/rbac/types";

export const useRoles = (
  query?: Record<string, any>
): {
  data: RoleDTO[] | null;
  loading: boolean;
} => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const filterQuery = new URLSearchParams(query).toString();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "/admin/rbac/role" + (query ? `?${filterQuery}` : "")
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return { data, loading };
};