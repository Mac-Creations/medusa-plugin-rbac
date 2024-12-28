import { useRoles } from "../../../hooks/rbac/roles";
import { Container, Heading, Text, Button } from "@medusajs/ui";
import { Link } from "react-router-dom"

export const RoleCardSettings = () => {
    const { data: dataRoles, loading: roleLoading } = useRoles();

  return (
    <Container className="flex flex-col space-y-4">
        <Heading>{dataRoles?.length} Roles</Heading>
        <Text className="text-wrap whitespace-pre">0 used</Text>
        <Text className="text-wrap">0 not used</Text>
        <Link to={"/rbac/roles"}>
            <Button>Configuration</Button>
        </Link>
    </Container>
  );
};
