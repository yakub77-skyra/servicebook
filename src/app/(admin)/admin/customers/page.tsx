import { Users } from "lucide-react"

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Customers</h1>
        <p className="mt-1 text-muted-foreground">
          All registered customer accounts.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
          <Users className="size-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Customer list coming soon</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          A searchable table of all customers with their booking history is
          built in Phase 6.
        </p>
      </div>
    </div>
  )
}
