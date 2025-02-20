import { Heading, Text, Label, Input } from "@medusajs/ui"
import { Controller, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { RoleCreateSchemaType } from "../../../../../../routes/rbac/roles/types"

type RoleGeneralSectionProps = {
  form: UseFormReturn<RoleCreateSchemaType>
}

export const RoleDetailsForm = ({
  form
}: RoleGeneralSectionProps) => {
  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <Header form={form}/>
        <div id="general" className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-x-1">
                        <Label size="small" weight="plus">
                          Name
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
    </div>
  )
}

const Header = ({form}: RoleGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <Heading>{form.getValues("name") ? "Edit" : "Create" } role</Heading>
      <Text className="text-ui-fg-subtle">
        Create and manage role. You can create multiple roles to
        organize your applications.
      </Text>
    </div>
  )
}