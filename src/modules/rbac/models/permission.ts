import { model } from "@medusajs/framework/utils"
import { Role } from "./role"


export const Permission = model.define("permission", {
  id: model.id().primaryKey(),
  name: model.text(),
  metadata: model.json().nullable(),
  roles: model.manyToMany(() => Role, {
    mappedBy: "permissions",
  }),
})