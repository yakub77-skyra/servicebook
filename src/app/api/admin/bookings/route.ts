import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/bookings
// Returns all bookings with customer + service details.
// Optional: ?status=pending to filter.
export async function GET(request: Request) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const bookings = await db.booking.findMany({
    where: status && status !== "all" ? { status } : {},
    include: {
      service: true,
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return ok(bookings)
}
