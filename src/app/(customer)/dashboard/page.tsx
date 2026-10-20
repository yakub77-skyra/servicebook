import Link from "next/link"
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  CreditCard,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { format, parseISO } from "date-fns"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/site/status-badges"

export const dynamic = "force-dynamic"

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser()

  // --- Stats ---
  // Never throw a Digest when the DB is unreachable (Vercel without DATABASE_URL).
  let bookings: Awaited<ReturnType<typeof db.booking.findMany>> = []
  try {
    if (user) {
      bookings = await db.booking.findMany({
        where: { customerId: user.id },
        include: { service: true },
        orderBy: { createdAt: "desc" },
      })
    }
  } catch (error) {
    console.error("[dashboard] DB unavailable, showing empty state:", error)
    bookings = []
  }

  const totalBookings = bookings.length
  const activeBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  )
  const upcoming = activeBookings.filter((b) => {
    const slot = parseISO(`${b.bookingDate}T${b.bookingTime}:00`)
    return slot >= new Date()
  })
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.service.price, 0)

  const recentBookings = bookings.slice(0, 3)

  const stats = [
    {
      label: "Total bookings",
      value: String(totalBookings),
      icon: CalendarDays,
      tint: "text-primary",
      note: totalBookings === 0 ? "No bookings yet" : "All time",
    },
    {
      label: "Upcoming",
      value: String(upcoming.length),
      icon: Clock,
      tint: "text-amber-500",
      note: upcoming.length === 0 ? "Nothing scheduled" : "Active appointments",
    },
    {
      label: "Total spent",
      value: formatPrice(totalSpent),
      icon: CreditCard,
      tint: "text-emerald-600",
      note: totalSpent === 0 ? "No payments yet" : "On paid bookings",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hi, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to your dashboard. Manage your bookings and profile here.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
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

      {/* Recent bookings or empty state */}
      {recentBookings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Recent bookings</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/bookings">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{b.service.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(b.bookingDate), "EEE, d MMM")} · {b.bookingTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={b.status} />
                  <PaymentStatusBadge status={b.paymentStatus} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Sparkles className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">No bookings yet</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Browse our verified services and book your first appointment in
              under two minutes.
            </p>
            <Button asChild className="mt-6">
              <Link href="/services">
                Browse services
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick action */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
          <CheckCircle2 className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">Need a service quickly?</p>
          <p className="text-xs text-muted-foreground">
            Book in under 2 minutes with instant confirmation.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/booking">Book now</Link>
        </Button>
      </div>
    </div>
  )
}
