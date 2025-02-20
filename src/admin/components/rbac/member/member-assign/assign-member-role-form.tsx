// other imports...
import { 
    Drawer,
    Heading,
    Label,
    Input,
    Button,
  } from "@medusajs/ui"
  import { 
    FormProvider,
    Controller,
  } from "react-hook-form"
  
  export const AssignMemberRoleForm = () => {
    return (
      <Drawer>
        <Drawer.Trigger asChild>
          <Button>Edit Item</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-hidden"
            >
            <Drawer.Header>
              <Heading className="capitalize">
                Edit Item
              </Heading>
            </Drawer.Header>
            <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-2">
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
            </Drawer.Body>
            <Drawer.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <Drawer.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </Drawer.Close>
                <Button size="small" type="submit">
                  Save
                </Button>
              </div>
            </Drawer.Footer>
            </form>
          </FormProvider>
        </Drawer.Content>
      </Drawer>
    )
  }