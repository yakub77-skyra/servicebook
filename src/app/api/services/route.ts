import { db } from "@/lib/db"
import { ok, fail } from "@/lib/api"
import { fallbackServices } from "@/lib/services"

// GET /api/services
// Returns all active services, newest first.
// Optional query: ?category=Cleaning  to filter by category.
// Falls back to static data when the DB is unreachable so the endpoint
// never 500s on Vercel without DATABASE_URL.
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
    console.error("[GET /api/services] DB unavailable, using fallback:", error)
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const services = fallbackServices.filter(
      (s) => !category || category === "All" || s.category === category
    )
    return ok(services)
  }
}
