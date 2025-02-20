import { Heading, Text, Switch } from "@medusajs/ui"
import { Controller, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { RoleCreateSchemaType } from "../../../../../../routes/rbac/roles/types"
import { useState } from "react";
import { Table } from "../../../../../common/table"
import { useMembers } from "../../../../../../hooks/rbac/members";

type RoleMembersSectionProps = {
  form: UseFormReturn<RoleCreateSchemaType>
}

export const RoleMembersForm = ({
  form
}: RoleMembersSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const limit = 20
  const { data: dataUsers } = useMembers({
    limit,
    offset: currentPage * limit,
  });

  const handleStatusChange = async (id: string, checked: boolean) => {
    const currentUsers = form.getValues("users") as string[] || [];
    if (checked) {
      form.setValue("users", [...currentUsers, id] as string[]);
    } else {
      form.setValue("users", currentUsers.filter((userId: string) => userId !== id) as string[]);
    }
  };

  const columns = [
    {
        key: "id",
        label: "Name",
        render: (value: string) => {
            const user = dataUsers?.users.find(user => user.id === value);
            if (!user) return null;
            return (<>{user.first_name} {user.last_name}</>);
        },
    },
    {
        key: "email",
        label: "Email",
    },
    {
      key: "id",
      label: "Allow",
      render: (value: string) => {
        return (
          <Switch
            id={value}
            checked={(form.getValues("users") as string[])?.includes(value) ?? false}
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
                name="users"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-4">
                      <Table
                        columns={columns}
                        data={(dataUsers?.users || []) as unknown as Record<string, unknown>[]}
                        limit={limit}
                        count={dataUsers?.count || 0}
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
      <Heading>Edit users</Heading>
      <Text className="text-ui-fg-subtle">
        Define users for this role.
      </Text>
    </div>
  )
}