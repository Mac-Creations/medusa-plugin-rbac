import { Container, Heading, Text, Button } from "@medusajs/ui";
import { Link } from "react-router-dom"
import { usePermissionsCount } from "../../../hooks/rbac/permissions";

export const PermissionCardSettings = () => {
    const { permissionStats } = usePermissionsCount();

    return (
        <Container className="flex flex-col space-y-4">
            <Heading>{permissionStats.totalPermissions} Permissions</Heading>
            <Text className="text-wrap">{permissionStats.totalPredefined} predefined</Text>
            <Text className="text-wrap">{permissionStats.totalCustoms} customs</Text>
            <Link to={"/rbac/permissions"}>
                <Button>Configuration</Button>
            </Link>
        </Container>
    );
};
