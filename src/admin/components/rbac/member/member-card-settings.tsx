import { Container, Heading, Text, Button } from "@medusajs/ui";

import { Link } from "react-router-dom"

export const MemberCardSettings = () => {

    return (
        <Container className="flex flex-col space-y-4">
            <Heading>Members </Heading>
            <Text className="text-wrap">0 assigned</Text>
            <Text className="text-wrap">0 unassigned</Text>
            <Link to={"/rbac/members"}>
                <Button>Configuration</Button>
            </Link>
        </Container>
    );
};
