import Link from "next/link"
import { CalendarDays, Sparkles, ArrowRight, CreditCard, Clock } from "lucide-react"

import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hi, {user?.name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to your dashboard. Manage your bookings and profile here.
        </p>
      </div>

      {/* Stat cards (placeholders until the booking flow is built in Phase 5) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              Total bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-xs text-muted-foreground">No bookings yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-4 text-amber-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="mt-1 text-xs text-muted-foreground">Nothing scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="size-4 text-emerald-600" />
              Total spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹0</p>
            <p className="mt-1 text-xs text-muted-foreground">No payments yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty state + CTA */}
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

      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
        Booking management and history will appear here once the booking flow is
        built in Phase 5.
      </p>
    </div>
  )
}
