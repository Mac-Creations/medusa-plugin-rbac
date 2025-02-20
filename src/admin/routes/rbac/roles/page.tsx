import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading } from "@medusajs/ui";
import { useRoles } from "../../../hooks/rbac/roles";
import { RoleActionsMenu } from "../../../components/rbac/role";
import { useState } from "react";
import { usePermissions } from "../../../hooks/rbac/permissions";
import RoleModal from "../../../components/rbac/role/role-modal/role-modal";
import { Table } from "../../../components/common/table";
import { PermissionDTO } from "../../../../modules/rbac/types";
import { UserDTO } from "@medusajs/types";
import {
  useForm,
} from "react-hook-form"
import { RoleCreateSchemaType } from "./types";

const Roles = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const limit = 5;

  const { data: dataRoles, refetch: refetchRoles } = useRoles({
    fields: "id,name,permissions.*,users.id",
    limit,
    offset: currentPage * limit
  });
  const { data: dataPermission } = usePermissions({ fields: "roles.id" });

  const form = useForm<RoleCreateSchemaType>({
    defaultValues: {
      name: "",
      permissions: [],
      users: [],
    },
  })

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "permissions",
      label: "Policies",
      render: (value: PermissionDTO[]) => (
        <>
          {value.length} allowed
          <br />
          {(dataPermission?.count ?? 0) - value.length} denied
        </>
      ),
    },
    {
      key: "users",
      label: "Members",
      render: (value: UserDTO[]) => value.length,
    },
    {
      key: "id",
      label: " ",
      render: (value: string) => (
        <RoleActionsMenu id={value} refetch={refetchRoles} onEdit={handleEdit} />
      ),
    },
  ];

  const handleCreate = () => {
    setSelectedRoleId(null);
    form.reset({ name: "", permissions: [], users: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedRoleId(id);
    setIsModalOpen(true);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between p-6">
        <Heading className="h2">Roles</Heading>
        <div className="flex items-center justify-center gap-x-2">
          <Button variant="secondary" onClick={handleCreate}> 
            Create role
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        data={(dataRoles?.roles || []) as unknown as Record<string, unknown>[]}
        limit={limit}
        count={dataRoles?.count || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="p-6"></div>
        <RoleModal
          form={form}
          roleId={selectedRoleId}
          isOpen={isModalOpen}
          refetch={refetchRoles}
          onClose={() => setIsModalOpen(false)}
        />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Roles",
});

export default Roles;