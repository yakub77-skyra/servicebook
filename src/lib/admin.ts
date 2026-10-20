import { requireAdmin } from "@/lib/session"
import { fail } from "@/lib/api"

// Use at the top of any admin route handler. Returns the admin session or a
// 401/403 JSON response you can return directly.
//
//   const [session, denied] = await requireAdminOrDeny()
//   if (denied) return denied
//
export async function requireAdminOrDeny() {
  try {
    const session = await requireAdmin()
    return [session, null] as const
  } catch {
    return [null, fail("Admin authentication required", 401)] as const
  }
}
