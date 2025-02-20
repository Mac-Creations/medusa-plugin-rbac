import { Badge, Table } from "@medusajs/ui";
import { MemberDTO, RoleDTO } from "../../../../modules/rbac/types";
import AssignMemberRoleForm from "./assign-member-role-form";

export const MemberRow = ({ member, role, onRoleAssigned }: { member: MemberDTO, role: RoleDTO[], onRoleAssigned: () => void }) => {
    return (
        <Table.Row>
            <Table.Cell>{member.first_name} {member.last_name}</Table.Cell>
            <Table.Cell>{member.email}</Table.Cell>
            <Table.Cell>
                {!member.role ? (
                    <Badge className="m-1">Unassigned</Badge>
                ) : Array.isArray(member.role) ? (
                    member.role.map((r, index) => (
                        <Badge key={index} className="m-1" color="green">{r.name}</Badge>
                    ))
                ) : (
                    <Badge className="m-1" color="green">{member.role.name}</Badge>
                )}
            </Table.Cell>
            <Table.Cell>
                <AssignMemberRoleForm member={member} role={role} onRoleAssigned={onRoleAssigned} />
            </Table.Cell>
        </Table.Row>
    );
};