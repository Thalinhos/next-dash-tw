import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen">
    {/* <div> */}
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
      <main className="flex-1 flex items-center justify-center p-6">
      {/* <main> */}
        {children}
      </main>
       <Toaster />
    </SidebarProvider>
    </div>
  )
}
