import Link from "next/link"
import {
  CalendarCheck,
  Users,
  IndianRupee,
  Clock,
  ArrowRight,
} from "lucide-react"

import { getCurrentUser } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  const stats = [
    {
      label: "Total bookings",
      value: "0",
      icon: CalendarCheck,
      tint: "text-primary",
      note: "No bookings yet",
    },
    {
      label: "Pending",
      value: "0",
      icon: Clock,
      tint: "text-amber-500",
      note: "Awaiting confirmation",
    },
    {
      label: "Total revenue",
      value: "₹0",
      icon: IndianRupee,
      tint: "text-emerald-600",
      note: "No paid bookings",
    },
    {
      label: "Customers",
      value: "1",
      icon: Users,
      tint: "text-indigo-500",
      note: "Registered users",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user?.name.split(" ")[0]}. Here&apos;s what&apos;s
            happening today.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          <span className="mr-1 size-1.5 rounded-full bg-emerald-500" />
          {user?.role} account
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <s.icon className={`size-4 ${s.tint}`} />
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manage services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, or remove services from your catalog.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/services">
                Go to services
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">View leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See contact form submissions captured from the website.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/leads">
                View leads
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
        Full admin management (services CRUD, booking status, customer list,
        leads table) is built in Phase 6.
      </p>
    </div>
  )
}
