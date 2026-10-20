import { CalendarCheck } from "lucide-react"

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          View and update the status of all customer bookings.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
          <CalendarCheck className="size-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No bookings yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Once customers start booking (Phase 5), all bookings will appear here
          for status management.
        </p>
      </div>
    </div>
  )
}
