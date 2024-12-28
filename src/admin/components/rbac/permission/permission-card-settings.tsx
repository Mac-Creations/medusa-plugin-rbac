import { Container, Heading, Text, Button } from "@medusajs/ui";
import { Link } from "react-router-dom"
import { usePermissions } from "../../../hooks/rbac/permissions";

export const PermissionCardSettings = () => {
    const { data: dataPermissions, loading: roleLoading } = usePermissions();

    return (
        <Container className="flex flex-col space-y-4">
            <Heading>{dataPermissions?.length} Permissions</Heading>
            <Text className="text-wrap">0 predefined</Text>
            <Text className="text-wrap">0 custom</Text>
            <Link to={"/rbac/permissions"}>
                <Button>Configuration</Button>
            </Link>
        </Container>
    );
};
