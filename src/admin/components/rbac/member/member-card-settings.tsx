import { Container, Heading, Text, Button } from "@medusajs/ui";

import { Link } from "react-router-dom"
import { useMembersCount } from "../../../hooks/rbac/members";

export const MemberCardSettings = () => {
    const { memberStats } = useMembersCount({ fields: "*role" });

    return (
        <Container className="flex flex-col space-y-4">
            <Heading>{memberStats.totalMembers} Members </Heading>
            <Text className="text-wrap">{memberStats.totalAssigned} assigned</Text>
            <Text className="text-wrap">{memberStats.totalUnassigned} unassigned</Text>
            <Link to={"/rbac/members"}>
                <Button>Configuration</Button>
            </Link>
        </Container>
    );
};
