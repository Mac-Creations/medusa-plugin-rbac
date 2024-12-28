import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Heading } from "@medusajs/ui";
import { Users } from "@medusajs/icons"
import { RoleCardSettings } from "../../components/rbac/role";
import { PermissionCardSettings } from "../../components/rbac/permission";
import { MemberCardSettings } from "../../components/rbac/member";

const RbacSettings = () => {
  return (
    <div>
      <div className="p-6">
        <Heading className="txt-large-plus">RBAC settings</Heading>
      </div>
        <div className="grid grid-cols-4 gap-4">
          <RoleCardSettings />
          <PermissionCardSettings />
          <MemberCardSettings />
        <div className="p-6"></div>
      </div>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "RBAC",
  icon: Users,
});

export default RbacSettings;