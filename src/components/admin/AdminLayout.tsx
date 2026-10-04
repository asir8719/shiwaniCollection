import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
  return (
    <div>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Dashboard" />
                <main className="admin-content">
                    <Outlet/>
                </main>
            </SidebarInset>
        </SidebarProvider>
    </div>
  )
}

export default AdminLayout