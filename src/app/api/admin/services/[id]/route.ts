import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/services/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const { id } = await params
  const service = await db.service.findUnique({ where: { id } })
  if (!service) return fail("Service not found", 404)
  return ok(service)
}

// PATCH /api/admin/services/[id]
// Body: partial service fields (title, shortDescription, description, price,
// durationMinutes, imageUrl, category, isActive)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return fail("Invalid JSON body", 400)

  // Build a clean update object from allowed fields.
  const data: Record<string, unknown> = {}
  if (body.title !== undefined) {
    const t = String(body.title).trim()
    if (!t) return fail("Title cannot be empty", 422)
    data.title = t
    // Update slug too (keep it unique-ish)
    const newSlug =
      t
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6)
    data.slug = newSlug
  }
  if (body.shortDescription !== undefined)
    data.shortDescription = String(body.shortDescription).trim()
  if (body.description !== undefined)
    data.description = String(body.description).trim()
  if (body.price !== undefined) {
    const p = Number(body.price)
    if (p < 0) return fail("Price must be positive", 422)
    data.price = Math.round(p)
  }
  if (body.durationMinutes !== undefined) {
    const d = Number(body.durationMinutes)
    if (d < 5) return fail("Duration must be at least 5 minutes", 422)
    data.durationMinutes = Math.round(d)
  }
  if (body.imageUrl !== undefined)
    data.imageUrl = String(body.imageUrl).trim()
  if (body.category !== undefined)
    data.category = String(body.category).trim()
  if (body.isActive !== undefined) data.isActive = !!body.isActive

  if (Object.keys(data).length === 0)
    return fail("No fields to update", 422)

  try {
    // Check service exists first.
    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) return fail("Service not found", 404)

    // If updating slug, check uniqueness.
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await db.service.findUnique({
        where: { slug: data.slug as string },
      })
      if (conflict) return fail("Slug conflict, please try again", 409)
    }

    const updated = await db.service.update({ where: { id }, data })
    return ok(updated)
  } catch (error) {
    console.error("[PATCH /api/admin/services/:id] error:", error)
    return fail("Failed to update service", 500)
  }
}

// DELETE /api/admin/services/[id]
// Hard-deletes the service. Bookings referencing it cascade-delete too
// (configured in the Prisma schema with onDelete: Cascade).
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const { id } = await params
  const existing = await db.service.findUnique({ where: { id } })
  if (!existing) return fail("Service not found", 404)

  // Count bookings that will be cascade-deleted (for transparency).
  const bookingCount = await db.booking.count({ where: { serviceId: id } })

  await db.service.delete({ where: { id } })

  return ok({ deleted: true, cascadedBookings: bookingCount })
}
