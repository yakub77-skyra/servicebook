import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/session"
import { ok } from "@/lib/api"

// POST /api/auth/logout
// Clears the session cookie.
export async function POST() {
  const res = NextResponse.json({ success: true, data: null })
  res.cookies.set(clearSessionCookie())
  return res
}
