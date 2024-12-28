import { useState, useEffect } from "react";
import { PermissionDTO } from "../../../../modules/rbac/types";

export const usePermissions = (
  query?: Record<string, any>
): {
  data: PermissionDTO[] | null;
  loading: boolean;
} => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const filterQuery = new URLSearchParams(query).toString();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "/admin/rbac/permission" + (query ? `?${filterQuery}` : "")
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