import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Badge } from "@medusajs/ui";
import { useMembers } from "../../../hooks/rbac/members";
import { useState } from "react";
import { useRoles } from "../../../hooks/rbac/roles";
import AssignMemberRoleForm from "../../../components/rbac/member/assign-member-role-form";
import { Table } from "../../../components/common/table";
import { RoleDTO, MemberDTO } from "../../../../modules/rbac/types";

const Members = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 20;

    const { data: membersData, refetch: refetchMembers } = useMembers({
        fields: "*role",
        limit,
        offset: (currentPage * limit),
    });

    const { data: rolesData } = useRoles();

    const columns = [
        {
            key: "id",
            label: "Name",
            render: (value: string) => {
                const member = membersData?.users.find(user => user.id === value);
                if (!member) return null;
                return (<>{member.first_name} {member.last_name}</>);
            },
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "id",
            label: "Role",
            render: (value: string) => {
                const member = membersData?.users.find(user => user.id === value);
                return !member?.role || member.role.length === 0 ? (
                    <Badge className="m-1">Unassigned</Badge>
                ) : (
                    member.role.map((r: RoleDTO) => (
                        <Badge key={r.id} className="m-1" color="green">{r.name}</Badge>
                    ))
                );
            },
        },
        {
            key: "id",
            label: "Assign Role",
            render: (value: string) => (
                <AssignMemberRoleForm 
                    member={membersData?.users.find(user => user.id === value) as MemberDTO} 
                    role={rolesData?.roles || []} 
                    onRoleAssigned={refetchMembers} 
                />
            ),
        },
    ];



    return (
        <Container className="flex flex-col p-0 overflow-hidden">
            <div className="p-6">
                <Heading className="txt-large-plus">Members</Heading>
            </div>
            <Table
                columns={columns}
                data={(membersData?.users || []) as unknown as Record<string, unknown>[]}
                limit={limit}
                count={membersData?.count || 0}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <div className="p-6"></div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Members",
});

export default Members;