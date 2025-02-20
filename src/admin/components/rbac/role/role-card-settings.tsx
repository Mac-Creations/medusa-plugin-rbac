import { useRolesCount } from "../../../hooks/rbac/roles";
import { Container, Heading, Text, Button } from "@medusajs/ui";
import { Link } from "react-router-dom"

export const RoleCardSettings = () => {
    const { roleStats } = useRolesCount();

  return (
    <Container className="flex flex-col space-y-4">
        <Heading>{roleStats.totalRoles} Roles</Heading>
        <Text className="text-wrap whitespace-pre">{roleStats.rolesWithUsers} used</Text>
        <Text className="text-wrap">{roleStats.rolesWithoutUsers} not used</Text>
        <Link to={"/rbac/roles"}>
            <Button>Configuration</Button>
        </Link>
    </Container>
  );
};
