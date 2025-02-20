import { Button, Drawer, Heading, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../modals/route-drawer"

export const MemberAssign = () => {
    const { t } = useTranslation()
    // const { searchParams } = useProductTableQuery({})
    // const { mutateAsync } = useExportProducts(searchParams)
    // const { handleSuccess } = useRouteModal()

    const handleAssignRequest = async () => {
        await mutateAsync(
            {},
            {
                onSuccess: () => {
                    toast.info(t("products.export.success.title"), {
                        description: t("products.export.success.description"),
                    })
                    handleSuccess()
                },
                onError: (err) => {
                    toast.error(err.message)
                },
            }
        )
    }

    return (
        <RouteDrawer>
            <RouteDrawer.Header>
                <RouteDrawer.Title asChild>
                    <Heading>{t("products.edit.header")}</Heading>
                </RouteDrawer.Title>
            </RouteDrawer.Header>
        </RouteDrawer>
        // <>
        //     <Drawer.Body>
        //         <fieldset className="my-4">
        //             <legend className="mb-2">Choose role</legend>
        //             <Select onValueChange={setRoleId} value={roleId} aria-describedby="Select a Role">
        //                 <Select.Trigger>
        //                     <Select.Value placeholder="Select a role" />
        //                 </Select.Trigger>
        //                 <Select.Content>
        //                     {role.map((item) => (
        //                         <Select.Item key={item.id} value={item.id}>
        //                             {item.name}
        //                         </Select.Item>
        //                     ))}
        //                 </Select.Content>
        //             </Select>
        //         </fieldset>
        //     </Drawer.Body>
        //     <Drawer.Footer>
        //         <div className="flex items-center gap-x-2">
        //             <Drawer.Close asChild>
        //                 <Button size="small" variant="secondary">
        //                     {t("actions.cancel")}
        //                 </Button>
        //             </Drawer.Close>
        //             <Button onClick={handleAssignRequest} size="small">
        //                 {t("actions.save")}
        //             </Button>
        //         </div>
        //     </Drawer.Footer>
        // </>
    )
}