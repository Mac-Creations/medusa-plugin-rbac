import { useState } from "react"
import { Button, Select, toast, Drawer, Badge } from "@medusajs/ui"
import { MemberDTO, RoleDTO } from "../../../../../modules/rbac/types"
import { assignRoleUser } from "../../../../hooks/rbac/members";
import * as React from "react"

const AssignMemberRoleForm = ({
  member,
  role,
  onRoleAssigned
}: { member: MemberDTO, role: RoleDTO[], onRoleAssigned: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [roleId, setRoleId] = React.useState<string | undefined>()
  const [assignedRoles, setAssignedRoles] = useState<RoleDTO[]>(member.role || []);

  const onAddRole = () => {
    if (!roleId) {
      toast.error("Please select a role");
      return;
    }
    if (assignedRoles.some(r => r.id === roleId)) {
      toast.error("Role is already assigned");
      return;
    }
    const selectedRole = role.find(r => r.id === roleId);
    if (selectedRole) {
      setAssignedRoles(prevRoles => [...prevRoles, selectedRole]);
      setRoleId(undefined);
    }
  }

  const onRemoveRole = (id: string) => {
    const updatedRoles = assignedRoles.filter(r => r.id !== id);
    setAssignedRoles(updatedRoles);
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const updatedMember = {
        ...member,
        role: assignedRoles
      }
      const result = await assignRoleUser(updatedMember);
      if (result) {
        toast.success("Role assigned successfully!");
        onRoleAssigned();
      } else {
        toast.error("Failed to assign role");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to assign role");
    } finally {
      setRoleId(undefined);
      setLoading(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={(openChanged) => setOpen(openChanged)}>
      <Drawer.Trigger
        onClick={() => {
          setOpen(true)
        }}
        asChild
        aria-label="Open Assign Role Drawer"
      >
        <Button>Assign</Button>
      </Drawer.Trigger>
      <Drawer.Content aria-describedby="Assign">
        <Drawer.Header>
          <Drawer.Title>Select role</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <fieldset className="my-4">
            <legend className="mb-2">Choose role</legend>
            <Select onValueChange={setRoleId} value={roleId} aria-describedby="Select a Role">
              <Select.Trigger>
                <Select.Value placeholder="Select a role" />
              </Select.Trigger>
              <Select.Content>
                {role.map((item) => (
                  <Select.Item key={item.id} value={item.id}>
                    {item.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </fieldset>
          <fieldset className="my-4">
            <Button onClick={onAddRole} variant="secondary">Add</Button>
          </fieldset>
          {assignedRoles.map((r: RoleDTO) => (
              <Badge onClick={() => onRemoveRole(r.id)} key={r.id} className="m-1" color="green">{r.name}</Badge>
            ))}
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button type="submit" onClick={onSubmit} isLoading={loading} disabled={loading}>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

export default AssignMemberRoleForm