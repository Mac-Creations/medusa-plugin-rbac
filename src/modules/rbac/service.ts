import { MedusaService } from "@medusajs/utils";
import { Role, Permission } from "./models";

class RbacModuleService extends MedusaService({
  Role,
  Permission,
}) {}

export default RbacModuleService;