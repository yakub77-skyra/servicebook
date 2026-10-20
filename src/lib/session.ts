// Session / authentication library.
// Uses JWT (jose) signed with AUTH_SECRET and stored in an HTTP-only cookie.
// Works in both Route Handlers and Server Components (via next/headers).

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"
import { db } from "@/lib/db"

const COOKIE_NAME = "sb_session"
const SESSION_MAX_AGE_DAYS = 7

// Derive a secret key from the env var (falls back to a dev secret so the
// app doesn't crash in local dev if AUTH_SECRET is missing).
function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me"
  return new TextEncoder().encode(raw)
}

export type SessionUser = {
  userId: string
  email: string
  name: string
  role: "customer" | "admin"
}

type SessionPayload = SessionUser & {
  // exp is added by jose automatically
}

// Create a signed JWT for the given user.
export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_DAYS}d`)
    .setSubject(user.userId)
    .sign(getSecret())
}

// Verify a JWT and return its payload (or null if invalid/expired).
export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    // Basic shape check
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null
    }
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name as string,
      role: payload.role as "customer" | "admin",
    }
  } catch {
    return null
  }
}

// Read the current session from the cookie. Use this in Server Components
// and Route Handlers that need the logged-in user.
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return verifySession(token)
}

// Look up the full profile row (without password) for the current session.
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  const profile = await db.profile.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
  })
  return profile
}

// --- Route guards (use in protected layouts / pages) ---

// Requires a logged-in user (any role). Redirects to /login if absent.
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

// Requires an admin. Redirects to /admin/login if absent or non-admin.
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) redirect("/admin/login")
  if (session.role !== "admin") redirect("/dashboard")
  return session
}

// --- Cookie helpers (use in Route Handler responses) ---

export const sessionCookieName = COOKIE_NAME
export const sessionMaxAgeSeconds = SESSION_MAX_AGE_DAYS * 24 * 60 * 60

export function setSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  }
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  }
}
