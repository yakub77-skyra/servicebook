import { CalendarDays } from "lucide-react"

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your past and upcoming appointments.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
          <CalendarDays className="size-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No bookings yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Your bookings will show up here. The booking flow is built in Phase 5.
        </p>
      </div>
    </div>
  )
}
