import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { DashboardSidebar, type DashboardNavItem } from "@/components/site/dashboard-sidebar"

// Protected layout for all /dashboard/* pages.
// Requires a logged-in user. Admins are redirected to their own dashboard.
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (user.role === "admin") redirect("/admin/dashboard")

  const items: DashboardNavItem[] = [
    { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "My Bookings", href: "/dashboard/bookings", icon: "CalendarDays" },
    { title: "Profile", href: "/dashboard/profile", icon: "User" },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardSidebar
        items={items}
        user={{ name: user.name, email: user.email, role: "customer" }}
        areaLabel="Customer"
      />
      {/* Offset for the fixed desktop sidebar */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
