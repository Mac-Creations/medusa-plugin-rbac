import { model } from "@medusajs/framework/utils"
import { Role } from "./role"
import { PermissionType } from "../types"


export const Permission = model.define("permission", {
  id: model.id().primaryKey(),
  name: model.text(),
  target: model.text(),
  predefined: model.boolean(),
  action: model.enum(PermissionType),
  roles: model.manyToMany(() => Role, {
    mappedBy: "permissions",
  }),
})