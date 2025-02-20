import RbacModule from "../modules/rbac"
import UserModule from "@medusajs/medusa/user"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  RbacModule.linkable.role,
  {
    linkable: UserModule.linkable.user,
    isList: true,
  }
)

