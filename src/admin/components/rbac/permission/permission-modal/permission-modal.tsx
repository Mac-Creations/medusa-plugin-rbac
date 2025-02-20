import { ProgressTabs, ProgressStatus, Button, FocusModal, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { FormProvider, UseFormReturn } from "react-hook-form"
import { PermissionDetailsForm } from "./components/permission-details-form/permission-details-form"
import { PermissionCreateSchemaType } from "../../../../routes/rbac/permissions/types"
import { useCreatePermission, usePermissions, useUpdatePermission } from "../../../../hooks/rbac/permissions"
import { PermissionsConfigurationForm } from "./components/permission-configuration-form"

enum Tab {
  GENERAL = "general",
  CONFIGURATION = "configuration",
}

type TabState = Record<Tab, ProgressStatus>

const PermissionModal = ({ form, permissionId, refetch, isOpen, onClose }:
  { form: UseFormReturn<PermissionCreateSchemaType>, permissionId?: string | null, refetch: () => void, isOpen: boolean, onClose: () => void, }) => {
  const [tab, setTab] = useState<Tab>(Tab.GENERAL)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.GENERAL]: "in-progress",
    [Tab.CONFIGURATION]: "not-started",
  })

  const { data: dataPermissions, refetch: permissionRefetch } = usePermissions({ id: permissionId });
  const permission = dataPermissions?.permissions.find((p) => p.id === permissionId);

  const { mutateAsync: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutateAsync: updatePermission, isPending: isUpdating } = useUpdatePermission();

  useEffect(() => {
    if (permission) {
      form.reset({
        id: permission.id,
        name: permission.name,
        target: permission.target,
        predefined: permission.predefined,
        action: permission.action
      });
    }
  }, [permission, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = { ...values }
    try {
      if (permissionId) {
        await updatePermission(payload);
        toast.success("The permission has been updated successfully")
      } else {
        await createPermission(payload);
        toast.success("The permission has been created successfully")
      }
    } catch (error) {
      toast.error((error as any).message)
    }
    form.reset()
    setTab(Tab.GENERAL)
    setTabState({
      [Tab.GENERAL]: "in-progress",
      [Tab.CONFIGURATION]: "not-started",
    })
    refetch();
    permissionRefetch();
    onClose();
  })

  const onNext = async (currentTab: Tab) => {
    const valid = await form.trigger()

    if (!valid) {
      return
    }

    if (currentTab === Tab.GENERAL) {
      setTab(Tab.CONFIGURATION)
    }

  }

  useEffect(() => {
    const currentState = { ...tabState }
    if (tab === Tab.GENERAL) {
      currentState[Tab.GENERAL] = "in-progress"
    }
    if (tab === Tab.CONFIGURATION) {
      currentState[Tab.GENERAL] = "completed"
      currentState[Tab.CONFIGURATION] = "in-progress"
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
                      status={tabState[Tab.GENERAL]}
                      value={Tab.GENERAL}
                      className="max-w-[200px] truncate"
                    >
                      GENERAL
                    </ProgressTabs.Trigger>
                    <ProgressTabs.Trigger
                      status={tabState[Tab.CONFIGURATION]}
                      value={Tab.CONFIGURATION}
                      className="max-w-[200px] truncate"
                    >
                      CONFIGURATION
                    </ProgressTabs.Trigger>
                  </ProgressTabs.List>
                </div>
              </FocusModal.Header>
              <FocusModal.Body className="size-full overflow-hidden">
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.GENERAL}
                >
                  <PermissionDetailsForm form={form} />
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  className="size-full overflow-y-auto"
                  value={Tab.CONFIGURATION}>
                  <PermissionsConfigurationForm form={form} />
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
    (tab === Tab.CONFIGURATION)
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

export default PermissionModal;