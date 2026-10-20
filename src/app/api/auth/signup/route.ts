import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { ok, fail, isValidEmail, isValidPhone } from "@/lib/api"
import { signSession, setSessionCookie } from "@/lib/session"

// POST /api/auth/signup
// Body: { name, email, phone, password }
// Creates a customer account, sets a session cookie, returns the new user.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) return fail("Invalid JSON body", 400)

    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim().toLowerCase()
    const phone = String(body.phone ?? "").trim()
    const password = String(body.password ?? "")

    // --- Validation ---
    if (!name || name.length < 2)
      return fail("Please enter your full name (at least 2 characters)", 422)

    if (!email || !isValidEmail(email))
      return fail("Please enter a valid email address", 422)

    if (!phone || !isValidPhone(phone))
      return fail("Please enter a valid phone number", 422)

    if (!password || password.length < 6)
      return fail("Password must be at least 6 characters", 422)

    // --- Check email is not already registered ---
    const existing = await db.profile.findUnique({ where: { email } })
    if (existing) {
      return fail("An account with this email already exists. Try logging in.", 409)
    }

    // --- Create the user (always role: customer for public signup) ---
    const hashed = await bcrypt.hash(password, 10)
    const user = await db.profile.create({
      data: { name, email, phone, role: "customer", password: hashed },
      select: { id: true, email: true, name: true, phone: true, role: true },
    })

    // --- Sign session + set cookie ---
    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "customer" | "admin",
    })

    const res = NextResponse.json({ success: true, data: user }, { status: 201 })
    res.cookies.set(setSessionCookie(token))
    return res
  } catch (error) {
    console.error("[POST /api/auth/signup] error:", error)
    return fail("Failed to create your account", 500)
  }
}
