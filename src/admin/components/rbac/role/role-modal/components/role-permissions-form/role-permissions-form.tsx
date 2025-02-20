import { Heading, Text, Switch } from "@medusajs/ui"
import { Controller, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { RoleCreateSchemaType } from "../../../../../../routes/rbac/roles/types"
import { usePermissions } from "../../../../../../hooks/rbac/permissions"
import { useState } from "react";
import { Table } from "../../../../../common/table"

type RoleGeneralSectionProps = {
  form: UseFormReturn<RoleCreateSchemaType>
}

export const RolePermissionsForm = ({
  form
}: RoleGeneralSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const limit = 20
  const { data: dataPermission } = usePermissions({
    limit,
    offset: currentPage * limit,
  });

  const handleStatusChange = async (id: string, checked: boolean) => {
    const currentPermissions = form.getValues("permissions") as string[] || [];
    if (checked) {
      form.setValue("permissions", [...currentPermissions, id] as string[]);
    } else {
      form.setValue("permissions", currentPermissions.filter((permissionId: string) => permissionId !== id) as string[]);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Target",
    },
    {
      key: "action",
      label: "Action",
      render: (value: string) => {
        return (<>{value}</>);
      }
    },
    {
      key: "id",
      label: "Allow",
      render: (value: string) => {
        return (
          <Switch
            id={value}
            checked={(form.getValues("permissions") as string[])?.includes(value) ?? false}
            onCheckedChange={(checked) => handleStatusChange(value, checked)}
          />
        )
      }
    },
  ];

  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[1400px] flex-col gap-y-8">
        <Header />
        <div id="general" className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col p-0 overflow-hidden">
              <Controller
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-4">
                      <Table
                        columns={columns}
                        data={(dataPermission?.permissions || []) as unknown as Record<string, unknown>[]}
                        limit={limit}
                        count={dataPermission?.count || 0}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  )
                }}
              />
            </div>
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
      <Heading>Edit permissions</Heading>
      <Text className="text-ui-fg-subtle">
        Define permissions for this role.
      </Text>
    </div>
  )
}