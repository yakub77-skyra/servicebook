import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/services
// Returns ALL services (including inactive), for the admin table.
export async function GET() {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const services = await db.service.findMany({
    orderBy: { createdAt: "asc" },
  })
  return ok(services)
}

// POST /api/admin/services
// Body: { title, shortDescription, description, price, durationMinutes, imageUrl, category, isActive }
export async function POST(request: Request) {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  try {
    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const title = String(body.title ?? "").trim()
    const shortDescription = String(body.shortDescription ?? "").trim()
    const description = String(body.description ?? "").trim()
    const price = Number(body.price)
    const durationMinutes = Number(body.durationMinutes)
    const imageUrl = String(body.imageUrl ?? "").trim()
    const category = String(body.category ?? "").trim()
    const isActive = body.isActive !== false

    // --- Validation ---
    if (!title) return fail("Title is required", 422)
    if (!shortDescription) return fail("Short description is required", 422)
    if (!description) return fail("Description is required", 422)
    if (!price || price < 0) return fail("Price must be a positive number", 422)
    if (!durationMinutes || durationMinutes < 5)
      return fail("Duration must be at least 5 minutes", 422)
    if (!imageUrl) return fail("Image URL is required", 422)
    if (!category) return fail("Category is required", 422)

    // --- Generate slug from title ---
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6)

    // Check slug uniqueness (rare collision, but safe)
    const existing = await db.service.findUnique({ where: { slug } })
    if (existing) return fail("Slug conflict, please try again", 409)

    const service = await db.service.create({
      data: {
        title,
        slug,
        shortDescription,
        description,
        price: Math.round(price),
        durationMinutes: Math.round(durationMinutes),
        imageUrl,
        category,
        isActive,
      },
    })

    return ok(service, 201)
  } catch (error) {
    console.error("[POST /api/admin/services] error:", error)
    return fail("Failed to create service", 500)
  }
}
