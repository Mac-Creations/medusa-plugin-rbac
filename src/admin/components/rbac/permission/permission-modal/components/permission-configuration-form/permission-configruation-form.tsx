import { Heading, Text, Switch, Label, Input, Select } from "@medusajs/ui"
import { Controller, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useState } from "react";
import { Table } from "../../../../../common/table"
import { useMembers } from "../../../../../../hooks/rbac/members";
import { PermissionCreateSchemaType } from "../../../../../../routes/rbac/permissions/types";
import { PermissionType } from "../../../../../../../modules/rbac/types";

type PermissionConfigurationSectionProps = {
  form: UseFormReturn<PermissionCreateSchemaType>
}

export const PermissionsConfigurationForm = ({
  form
}: PermissionConfigurationSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [permissionType, setPermissionType] = useState<PermissionType | undefined>(form.getValues('action'))
  const limit = 20
  


  const handlePermissionTypeChange = async (value: PermissionType) => {
    form.setValue("action", value)
    setPermissionType(value)
  }

  // const handleStatusChange = async (id: string, checked: boolean) => {
  //   const currentUsers = form.getValues("users") as string[] || [];
  //   if (checked) {
  //     form.setValue("users", [...currentUsers, id] as string[]);
  //   } else {
  //     form.setValue("users", currentUsers.filter((userId: string) => userId !== id) as string[]);
  //   }
  // };

  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <Header />
        <div id="general" className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4 w-1/2">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-x-1">
                  <Label size="small" weight="plus">
                    Choose action type
                  </Label>
                </div>
                <Select onValueChange={(value) => handlePermissionTypeChange(value as PermissionType)} value={permissionType} aria-describedby="Select an action">
                  <Select.Trigger>
                    <Select.Value placeholder="Select an action type" />
                  </Select.Trigger>
                  <Select.Content>
                    {Object.values(PermissionType).map((item) => (
                      <Select.Item key={item} value={item}>
                        {item.toUpperCase()}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>

              <Controller
                control={form.control}
                name="target"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-x-1">
                        <Label size="small" weight="plus">
                          Matcher
                        </Label>
                      </div>
                      <Input {...field} />
                    </div>
                  )
                }}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <Heading>Configuration permission</Heading>
      {/* <Text className="text-ui-fg-subtle">
        Define users for this role.
      </Text> */}
    </div>
  )
}