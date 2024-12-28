import {
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"
import { RBAC_MODULE } from ".."
import RbacModuleService from "../service"
import { Role } from "../models"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

moduleIntegrationTestRunner<RbacModuleService>({
    moduleName: RBAC_MODULE,
    moduleModels: [Role],
    resolve: "./src/modules/rbac",
    testSuite: ({ service }) => {
      // TODO write tests
    },
})