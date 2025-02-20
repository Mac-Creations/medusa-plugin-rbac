import { EllipsisHorizontal, PencilSquare, Spinner, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton, toast } from "@medusajs/ui";
import { useDeleteRole, useRoles } from "../../../hooks/rbac/roles";
import { useState } from "react";
import { RoleCreateSchemaType } from "../../../routes/rbac/roles/types";
import { useForm } from "react-hook-form";

export const RoleActionsMenu = ({ id, refetch, onEdit }: { id: string, refetch: () => void, onEdit: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await useDeleteRole(id);
    setIsDeleting(false);
    refetch();
    toast.success("The role has been deleted successfully")
  }
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
      <DropdownMenu.Item className="gap-x-2" onClick={() => onEdit(id)}>
        <PencilSquare className="text-ui-fg-subtle"/>
        Edit
      </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
          {isDeleting ? (
            <Spinner className="animate-spin" />
          ) : (
            <Trash className="text-ui-fg-subtle" />
          )}
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
