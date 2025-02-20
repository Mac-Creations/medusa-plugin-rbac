import { ProgressTabs, ProgressStatus, Button, FocusModal, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { RoleDetailsForm } from "./components/role-details-form/role-details-form"
import { RoleCreateSchemaType } from "../../../../routes/rbac/roles/types"
import { RolePermissionsForm } from "./components/role-permissions-form"
import { useCreateRole, useRoles, useUpdateRole } from "../../../../hooks/rbac/roles"
import { RoleMembersForm } from "./components/role-members-form"

enum Tab {
  DETAILS = "details",
  PERMISSIONS = "permissions",
  MEMBERS = "members",
}

type TabState = Record<Tab, ProgressStatus>

const RoleModal = ({ form, roleId, refetch, isOpen, onClose }:
  { form: UseFormReturn<RoleCreateSchemaType>, roleId?: string | null, refetch: () => void, isOpen: boolean, onClose: () => void, }) => {
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.PERMISSIONS]: "not-started",
    [Tab.MEMBERS]: "not-started",
  })

  const { data: dataRoles, refetch: roleRefetch } = useRoles({ id: roleId });
  const role = dataRoles?.roles.find((r) => r.id === roleId);

  const { mutateAsync: createRole, isPending: isCreating } = useCreateRole();
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole();

  useEffect(() => {
    if (role) {
      form.reset({
        id: role.id,
        name: role.name,
        permissions: role.permissions?.map((p) => p.id) ?? [],
        users: role.users?.map((u) => u.id) ?? [],
      });
    }
  }, [role, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = { ...values }
    try {
      if (roleId) {
        await updateRole(payload);
        toast.success("The role has been updated successfully")
      } else {
        await createRole(payload);
        toast.success("The role has been created successfully")
      }
    } catch (error) {
      toast.error((error as any).message)
    }
    form.reset()
    setTab(Tab.DETAILS)
    setTabState({
      [Tab.DETAILS]: "in-progress",
      [Tab.PERMISSIONS]: "not-started",
      [Tab.MEMBERS]: "not-started",
    })
    refetch();
    roleRefetch();
    onClose();
  })

  const onNext = async (currentTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    if (currentTab === Tab.DETAILS) {
      setTab(Tab.PERMISSIONS)
    }

    if (currentTab === Tab.PERMISSIONS) {
      setTab(Tab.MEMBERS)
    }
  }

  useEffect(() => {
    const currentState = { ...tabState }
    if (tab === Tab.DETAILS) {
      currentState[Tab.DETAILS] = "in-progress"
    }
    if (tab === Tab.PERMISSIONS) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.PERMISSIONS] = "in-progress"
    }
    if (tab === Tab.MEMBERS) {
      currentState[Tab.DETAILS] = "completed"
      currentState[Tab.PERMISSIONS] = "completed"
      currentState[Tab.MEMBERS] = "in-progress"
    }

    setTabState({ ...currentState })
  }, [tab])

  return (
    <FocusModal open={isOpen} onOpenChange={onClose}>
      <FocusModal.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex h-full flex-col overflow-hidden"
          >
            <ProgressTabs
              value={tab}
              onValueChange={async (tab) => {
                const valid = await form.trigger()

                if (!valid) {
                  return
                }

                setTab(tab as Tab)
              }}
              className="flex h-full flex-col overflow-hidden"
            >
              <FocusModal.Header>
                <div className="-my-2 w-full border-l">
                  <ProgressTabs.List className="justify-start-start flex w-full items-center">
                    <ProgressTabs.Trigger
                      status={tabState[Tab.DETAILS]}
                      value={Tab.DETAILS}
                      className="max-w-[200px] truncate"
                    >
                      DETAILS
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState[Tab.PERMISSIONS]}
                      value={Tab.PERMISSIONS}
                      className="max-w-[200px] truncate"
                    >
                      PERMISSIONS
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState[Tab.MEMBERS]}
                      value={Tab.MEMBERS}
                      className="max-w-[200px] truncate"
                    >
                      MEMBERS
                    </ProgressTabs.Trigger>
                  </ProgressTabs.List>
                </div>
              </FocusModal.Header>
              <FocusModal.Body className="size-full overflow-hidden">
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.DETAILS}
                >
                  <RoleDetailsForm form={form} />
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.PERMISSIONS}>
                  <RolePermissionsForm form={form} />
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.MEMBERS}>
                  <RoleMembersForm form={form} />
                </ProgressTabs.Content>
              </FocusModal.Body>
            </ProgressTabs>
            <FocusModal.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button variant="secondary" size="small" onClick={onClose}>
                    Cancel
                  </Button>
                </FocusModal.Close>
                <PrimaryButton
                  tab={tab}
                  next={onNext}
                  isLoading={isCreating || isUpdating}
                />
              </div>
            </FocusModal.Footer>
          </form>
        </FormProvider>
      </FocusModal.Content>
    </FocusModal>
  )
}

type PrimaryButtonProps = {
  tab: Tab
  next: (tab: Tab) => void
  isLoading?: boolean
}

const PrimaryButton = ({
  tab,
  next,
  isLoading,
}: PrimaryButtonProps) => {

  if (
    (tab === Tab.MEMBERS)
  ) {
    return (
      <Button
        data-name="publish-button"
        key="submit-button"
        type="submit"
        variant="primary"
        size="small"
        isLoading={isLoading}
      >
        Publish
      </Button>
    )
  }

  return (
    <Button
      key="next-button"
      type="button"
      variant="primary"
      size="small"
      onClick={() => next(tab)}
    >
      Continue
    </Button>
  )
}

export default RoleModal;