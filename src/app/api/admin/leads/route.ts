import { db } from "@/lib/db"
import { ok } from "@/lib/api"
import { requireAdminOrDeny } from "@/lib/admin"

// GET /api/admin/leads
// Returns all leads, newest first.
export async function GET() {
  const [, denied] = await requireAdminOrDeny()
  if (denied) return denied

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return ok(leads)
}
