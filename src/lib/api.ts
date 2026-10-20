import { NextResponse } from "next/server"

// Standard success response.
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

// Standard error response.
export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  )
}

// Validates an email string.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validates a phone number (10-15 digits, optional + prefix).
export function isValidPhone(phone: string): boolean {
  return /^[+]?[\d\s-]{10,15}$/.test(phone)
}
