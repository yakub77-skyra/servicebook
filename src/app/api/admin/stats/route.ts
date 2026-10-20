import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/stats
// Returns dashboard summary: total bookings, revenue, pending, customers, recent.
export async function GET() {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalCustomers,
    paidPayments,
    recentBookings,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "pending" } }),
    db.booking.count({ where: { status: "confirmed" } }),
    db.booking.count({ where: { status: "completed" } }),
    db.booking.count({ where: { status: "cancelled" } }),
    db.profile.count({ where: { role: "customer" } }),
    db.payment.findMany({ where: { paymentStatus: "paid" }, select: { amount: true } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { service: true, customer: { select: { name: true, email: true } } },
    }),
  ])

  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  return ok({
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalCustomers,
    totalRevenue,
    recentBookings,
  })
}
