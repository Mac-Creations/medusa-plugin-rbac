import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Table, Text } from "@medusajs/ui";
import { useRoles } from "../../../hooks/rbac/roles";
import { usePermissions } from "../../../hooks/rbac/permissions";
import { PermissionDTO } from "../../../../modules/rbac/types";

const Roles = () => {
    const { data, loading } = usePermissions();

    return (
        <div>
            <div className="p-6">
                <Heading className="txt-large-plus">Permission</Heading>
            </div>
            <Container className="flex flex-col p-0 overflow-hidden">
                <div className="p-6">
                    <Heading className="txt-large-plus">Custom</Heading>
                </div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Target</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            {/* <Table.HeaderCell>Actions</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    {loading && <Text>Loading...</Text>}
                    {data && (
                        <Table.Body>
                            {data.map((permission) => {
                                return (
                                    <Table.Row key={permission.id}>
                                        <Table.Cell className="flex gap-2 items-center">
                                            {permission.name}
                                        </Table.Cell>
                                        <Table.Cell>Permission</Table.Cell>
                                        <Table.Cell>permission</Table.Cell>
                                        <Table.Cell>
                                            <RoleCount permission={permission} />
                                        </Table.Cell>
                                        {/* <Table.Cell>
                    <DriverActionsMenu driver={driver} />
                  </Table.Cell> */}
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    )}
                </Table>
                <div className="p-6"></div>
            </Container>
        </div>
    );
};

const RoleCount = ({ permission }: { permission: PermissionDTO }) => {
    const { data, loading } = useRoles({
        id: permission.id,
    });

    return <Text>{loading ? "Loading..." : data?.length}</Text>;
};

export const config = defineRouteConfig({
    label: "Permissions",
});

export default Roles;