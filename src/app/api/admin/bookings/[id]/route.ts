import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

const VALID_STATUSES = ["pending", "confirmed", "cancelled", "completed"]

// PATCH /api/admin/bookings/[id]
// Body: { status: "pending" | "confirmed" | "cancelled" | "completed" }
// Lets an admin change any booking's status.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const status = String(body.status ?? "").trim().toLowerCase()

  if (!VALID_STATUSES.includes(status))
    return fail(
      `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      422
    )

  const existing = await db.booking.findUnique({ where: { id } })
  if (!existing) return fail("Booking not found", 404)

  const updated = await db.booking.update({
    where: { id },
    data: { status },
    include: {
      service: true,
      customer: { select: { id: true, name: true, email: true } },
    },
  })

  return ok(updated)
}
