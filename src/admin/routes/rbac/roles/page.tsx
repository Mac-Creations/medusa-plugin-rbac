import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Table, Text } from "@medusajs/ui";
import { useRoles } from "../../../hooks/rbac/roles";
import { RoleDTO } from "../../../../modules/rbac/types";

const Roles = () => {
  const { data, loading } = useRoles();

  return (
    <Container className="flex flex-col p-0 overflow-hidden">
      <div className="p-6">
        <Heading className="txt-large-plus">Roles</Heading>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Policies</Table.HeaderCell>
            <Table.HeaderCell>Members</Table.HeaderCell>
            {/* <Table.HeaderCell>Actions</Table.HeaderCell> */}
          </Table.Row>
        </Table.Header>
        {loading && <Text>Loading...</Text>}
        {data && (
          <Table.Body>
            {data.map((role) => {
              return (
                <Table.Row key={role.id}>
                  <Table.Cell className="flex gap-2 items-center">
                    {role.name}
                  </Table.Cell>
                  <Table.Cell>Permission</Table.Cell>
                  <Table.Cell>permission</Table.Cell>
                  <Table.Cell>
                    <RoleCount role={role} />
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
  );
};

const RoleCount = ({ role }: { role: RoleDTO }) => {

  const permissionCount = role?.permissions?.length || 0;
  
  return <Text>{`${permissionCount} permissions`}</Text>;
};

export const config = defineRouteConfig({
  label: "Roles",
});

export default Roles;