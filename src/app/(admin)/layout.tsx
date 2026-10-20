import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { DashboardSidebar, type DashboardNavItem } from "@/components/site/dashboard-sidebar"

// Protected layout for all /admin/* pages (except /admin/login which is its
// own route outside this group). Requires an admin session.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  if (user.role !== "admin") redirect("/dashboard")

  const items: DashboardNavItem[] = [
    { title: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { title: "Services", href: "/admin/services", icon: "Wrench" },
    { title: "Bookings", href: "/admin/bookings", icon: "CalendarCheck" },
    { title: "Customers", href: "/admin/customers", icon: "Users" },
    { title: "Leads", href: "/admin/leads", icon: "MessageSquare" },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardSidebar
        items={items}
        user={{ name: user.name, email: user.email, role: "admin" }}
        areaLabel="Admin"
      />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
