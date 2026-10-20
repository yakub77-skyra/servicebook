"use client"

import * as React from "react"

export type CurrentUser = {
  id: string
  email: string
  name: string
  phone: string | null
  role: "customer" | "admin"
} | null

// Fetches the current session from /api/auth/me on mount and whenever the
// window regains focus or the route changes. Returns { user, loading }.
//
// We use this instead of reading cookies() in a Server Component because
// the latter can be cached unpredictably in the Next.js dev server, causing
// the navbar to show a stale logged-out state right after login.
export function useCurrentUser() {
  const [user, setUser] = React.useState<CurrentUser>(null)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      const json = await res.json()
      setUser(json?.data ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refresh()
    // Re-check when the window regains focus (e.g. after a redirect back).
    const onFocus = () => refresh()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [refresh])

  return { user, loading, refresh }
}
