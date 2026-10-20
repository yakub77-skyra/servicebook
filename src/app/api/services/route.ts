import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"

// GET /api/services
// Returns all active services, newest first.
// Optional query: ?category=Cleaning  to filter by category.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const services = await db.service.findMany({
      where: {
        isActive: true,
        ...(category && category !== "All"
          ? { category }
          : {}),
      },
      orderBy: { createdAt: "asc" },
    })

    return ok(services)
  } catch (error) {
    console.error("[GET /api/services] error:", error)
    return fail("Failed to fetch services", 500)
  }
}
