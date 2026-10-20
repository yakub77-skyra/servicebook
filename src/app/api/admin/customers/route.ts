import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/customers
// Returns all customer profiles with their booking counts + total spent.
export async function GET() {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const customers = await db.profile.findMany({
    where: { role: "customer" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      bookings: {
        select: { id: true, status: true, service: { select: { price: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Shape the data for the table: add computed bookingCount + totalSpent.
  const shaped = customers.map((c) => {
    const bookingCount = c.bookings.length
    const totalSpent = c.bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.service.price, 0)
    const { bookings, ...rest } = c
    return { ...rest, bookingCount, totalSpent }
  })

  return ok(shaped)
}
