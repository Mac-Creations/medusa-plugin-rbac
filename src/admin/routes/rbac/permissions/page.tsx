import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Switch  } from "@medusajs/ui";
import { useRoles } from "../../../hooks/rbac/roles";
import { usePermissions } from "../../../hooks/rbac/permissions";
import { PermissionDTO, PermissionType } from "../../../../modules/rbac/types";
import { useState } from "react";
import { Table } from "../../../components/common/table";
import { PermissionCreateSchemaType } from "./types";
import { useForm } from "react-hook-form"
import { PermissionActionsMenu } from "../../../components/rbac/permission";
import PermissionModal from "../../../components/rbac/permission/permission-modal/permission-modal";

const Permissions = () => {
    const [customCurrentPage, setCustomCurrentPage] = useState(0)
    const [predefinedCurrentPage, setPredefinedCurrentPage] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null);
    const limit = 20
    
    const { data: dataCustomPermission, refetch: refetchCustomPermissions } = usePermissions({
        predefined: false,
        limit,
        offset: customCurrentPage * limit,
    });

    const { data: dataPredefinedPermission } = usePermissions({
        predefined: true,
        limit,
        offset: predefinedCurrentPage * limit,
    });

    const form = useForm<PermissionCreateSchemaType>({
        defaultValues: {
          name: "",
          target: "",
          predefined: false,
          action: undefined,
        },
    })

    const customColumns = [
        
        {
            key: "name",
            label: "Name",
        },
        {
            key: "action",
            label: "Action",
            render: (value: string) => {
                return (<>{value.toUpperCase()}</>);
            }
        },
        {
            key: "name",
            label: "Target",
        },
        {
            key: "id",
            label: " ",
            render: (value: string) => (
                <PermissionActionsMenu id={value} refetch={refetchCustomPermissions} onEdit={handleEdit} />
            ),
        },
    ];

    const predefinedColumns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "action",
            label: "Action",
            render: (value: string) => {
                return (<>{value.toUpperCase()}</>);
            }
        },
        {
            key: "name",
            label: "Target",
        },
    ];

    const handleCreate = () => {
        setSelectedPermissionId(null);
        form.reset({ name: "", target: "", predefined: false, action: undefined });
        setIsModalOpen(true);
      };
    
      const handleEdit = (id: string) => {
        setSelectedPermissionId(id);
        setIsModalOpen(true);
      };
    return (
        <div>
            <div className="p-6">
                <Heading className="txt-large-plus">Permission</Heading>
            </div>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between p-6">
                    <Heading className="h2">Custom</Heading>
                    <div className="flex items-center justify-center gap-x-2">
                        <Button variant="secondary" onClick={handleCreate}> 
                            Create permission
                        </Button>
                    </div>
                </div>
                <Table
                    columns={customColumns}
                    data={(dataCustomPermission?.permissions || []) as unknown as Record<string, unknown>[]}
                    limit={limit}
                    count={dataCustomPermission?.count || 0}
                    currentPage={customCurrentPage}
                    setCurrentPage={setCustomCurrentPage}
                />
                <div className="p-3"></div>
            </Container>
            <div className="p-3"></div>
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between p-6">
                    <Heading className="h2">Predefined</Heading>
                </div>
                <Table
                    columns={predefinedColumns}
                    data={(dataPredefinedPermission?.permissions || []) as unknown as Record<string, unknown>[]}
                    limit={limit}
                    count={dataPredefinedPermission?.count || 0}
                    currentPage={predefinedCurrentPage}
                    setCurrentPage={setPredefinedCurrentPage}
                />
                <div className="p-3"></div>
            </Container>
            <PermissionModal
                form={form}
                permissionId={selectedPermissionId}
                isOpen={isModalOpen}
                refetch={refetchCustomPermissions}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export const config = defineRouteConfig({
    label: "Permissions",
});

export default Permissions;