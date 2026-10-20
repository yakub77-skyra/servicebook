import { cn } from "@/lib/utils"

// Booking status: pending | confirmed | cancelled | completed
export function BookingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    confirmed:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
    completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
    cancelled:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] || "bg-muted text-muted-foreground border-border"
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

// Payment status: pending | paid | failed
export function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    paid:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
    failed:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
  }
  const labels: Record<string, string> = {
    pending: "Payment pending",
    paid: "Paid",
    failed: "Payment failed",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status] || "bg-muted text-muted-foreground border-border"
      )}
    >
      {labels[status] || status}
    </span>
  )
}
