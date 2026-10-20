"use client"

import * as React from "react"
import Link from "next/link"
import { Mail, Lock, User, Phone, Loader2, UserPlus, Eye, EyeOff } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+]?[\d\s-]{10,15}$/

export function SignupForm() {
  const { toast } = useToast()
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  function validate(data: FormData): Record<string, string> {
    const next: Record<string, string> = {}
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const password = String(data.get("password") ?? "")

    if (!name) next.name = "Name is required"
    else if (name.length < 2) next.name = "Name is too short"

    if (!email) next.email = "Email is required"
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email"

    if (!phone) next.phone = "Phone is required"
    else if (!PHONE_RE.test(phone)) next.phone = "Enter a valid phone number"

    if (!password) next.password = "Password is required"
    else if (password.length < 6) next.password = "Use at least 6 characters"

    return next
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const next = validate(data)
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name")).trim(),
          email: String(data.get("email")).trim(),
          phone: String(data.get("phone")).trim(),
          password: String(data.get("password")),
        }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setSubmitting(false)
        toast({
          title: "Sign up failed",
          description: json?.error || "Could not create your account.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Account created!",
        description: "Welcome to ServiceBook AI.",
      })
      // Hard navigation so the new session cookie is evaluated server-side.
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[signup] error:", err)
      setSubmitting(false)
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Priya Sharma"
            className="h-11 pl-9"
            aria-invalid={!!errors.name}
          />
        </div>
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 pl-9"
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className="h-11 pl-9"
              aria-invalid={!!errors.phone}
            />
          </div>
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="h-11 pl-9 pr-10"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        <p className="text-xs text-muted-foreground">
          Use 6+ characters. We hash it securely with bcrypt.
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Create free account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
