import { getCurrentUser } from "@/lib/session"
import { ok } from "@/lib/api"

// GET /api/auth/me
// Returns the currently logged-in user (or null). Used by client components
// like the Navbar to render auth-aware UI.
export async function GET() {
  const user = await getCurrentUser()
  return ok(user)
}
