import Service from "./service";
import { Module } from "@medusajs/utils";

export const RBAC_MODULE = "rbacModuleService";

export default Module(RBAC_MODULE, {
  service: Service,
});