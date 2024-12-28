import { model } from "@medusajs/framework/utils"
import { Permission } from "./permission"

export const Role = model.define("role", {
  id: model.id().primaryKey(),
  name: model.text(),
  permissions: model.manyToMany(() => Permission, {
    mappedBy: "roles",
    pivotTable: "role_permission",
    joinColumn: "role_id",
    inverseJoinColumn: "permission_id",
  }),
})