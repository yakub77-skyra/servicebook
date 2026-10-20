import Link from "next/link"
import { format, parseISO } from "date-fns"
import {
  CalendarCheck,
  Clock,
  IndianRupee,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { formatPrice } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badges"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  // --- Stats (all in parallel) ---
  const [
    totalBookings,
    pendingBookings,
    completedBookings,
    totalCustomers,
    totalServices,
    activeServices,
    paidPayments,
    recentBookings,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "pending" } }),
    db.booking.count({ where: { status: "completed" } }),
    db.profile.count({ where: { role: "customer" } }),
    db.service.count(),
    db.service.count({ where: { isActive: true } }),
    db.payment.findMany({
      where: { paymentStatus: "paid" },
      select: { amount: true },
    }),
    db.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        service: true,
        customer: { select: { name: true, email: true } },
      },
    }),
  ])

  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  const stats = [
    {
      label: "Total bookings",
      value: String(totalBookings),
      icon: CalendarCheck,
      tint: "text-primary",
      note: `${pendingBookings} pending`,
    },
    {
      label: "Total revenue",
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      tint: "text-emerald-600",
      note: `${completedBookings} completed`,
    },
    {
      label: "Customers",
      value: String(totalCustomers),
      icon: Users,
      tint: "text-indigo-500",
      note: "Registered users",
    },
    {
      label: "Active services",
      value: `${activeServices}/${totalServices}`,
      icon: TrendingUp,
      tint: "text-amber-500",
      note: "Currently bookable",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user!.name.split(" ")[0]}. Here&apos;s what&apos;s
            happening today.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          <span className="mr-1.5 size-1.5 rounded-full bg-emerald-500" />
          {user!.role} account
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manage services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, or remove services.
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
            <CardTitle className="text-base">Manage bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Confirm, complete, or cancel bookings.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/bookings">
                View bookings
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
              Contact form submissions.
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

      {/* Recent bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Recent bookings</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/bookings">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No bookings yet. They will appear here once customers start
              booking.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Customer</th>
                    <th className="pb-2 pr-4 font-medium">Service</th>
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/50">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{b.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.customer.email}
                        </p>
                      </td>
                      <td className="py-3 pr-4">{b.service.title}</td>
                      <td className="py-3 pr-4">
                        <p>{format(parseISO(b.bookingDate), "d MMM")}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.bookingTime}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="py-3">
                        <PaymentStatusBadge status={b.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
