import {
    moduleIntegrationTestRunner,
  } from "@medusajs/test-utils"
  import { RBAC_MODULE } from ".."
  import RbacModuleService from "../service"
  import { Permission } from "../models"
  
  moduleIntegrationTestRunner<RbacModuleService>({
      moduleName: RBAC_MODULE,
      moduleModels: [Permission],
      resolve: "./src/modules/rbac",
      testSuite: ({ service }) => {
        // TODO write tests
      },
  })