import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { ok, fail, isValidEmail } from "@/lib/api"
import { signSession, setSessionCookie } from "@/lib/session"

// POST /api/auth/login
// Body: { email, password, expectedRole? }
// expectedRole lets /admin/login reject non-admins with a clear message.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")
    const expectedRole = body.expectedRole === "admin" ? "admin" : undefined

    // --- Validation ---
    if (!email || !isValidEmail(email))
      return fail("Please enter a valid email address", 422)
    if (!password) return fail("Please enter your password", 422)

    // --- Find user ---
    const user = await db.profile.findUnique({ where: { email } })
    // Use the same generic error for "no user" and "wrong password"
    // so attackers can't enumerate accounts.
    if (!user) {
      return fail("Invalid email or password", 401)
    }

    // --- Verify password ---
    const passwordOk = await bcrypt.compare(password, user.password)
    if (!passwordOk) {
      return fail("Invalid email or password", 401)
    }

    // --- Role check (for admin login page) ---
    if (expectedRole && user.role !== expectedRole) {
      return fail(
        "This account does not have admin access. Please use the customer login.",
        403
      )
    }

    // --- Sign session + set cookie ---
    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "customer" | "admin",
    })

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    }

    const res = NextResponse.json({ success: true, data: safeUser }, { status: 200 })
    res.cookies.set(setSessionCookie(token))
    return res
  } catch (error) {
    console.error("[POST /api/auth/login] error:", error)
    return fail("Failed to log in", 500)
  }
}
