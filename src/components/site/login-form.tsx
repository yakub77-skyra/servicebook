"use client"

import * as React from "react"
import Link from "next/link"
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  // When set (e.g. "admin"), the API rejects non-matching roles with 403.
  expectedRole?: "admin"
  // Where to send the user after a successful login.
  redirectTo: string
  // Hint card shown under the form (demo credentials).
  demoCreds?: { email: string; password: string; label: string }[]
}

export function LoginForm({ expectedRole, redirectTo, demoCreds }: Props) {
  const { toast } = useToast()
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")

    const next: { email?: string; password?: string } = {}
    if (!email) next.email = "Email is required"
    if (!password) next.password = "Password is required"
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedRole }),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setSubmitting(false)
        toast({
          title: "Login failed",
          description: json?.error || "Could not log you in.",
          variant: "destructive",
        })
        return
      }

      toast({ title: "Welcome back!", description: "Logged in successfully." })
      // Hard navigation so the new session cookie is evaluated server-side.
      window.location.href = redirectTo
    } catch (err) {
      console.error("[login] error:", err)
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
        <Label htmlFor="email">Email address</Label>
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
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Log in
          </>
        )}
      </Button>

      {!expectedRole && (
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      )}

      {demoCreds && demoCreds.length > 0 && (
        <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Demo accounts (click to fill):
          </p>
          <div className="space-y-1.5">
            {demoCreds.map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => {
                  const f = document.getElementById("email") as HTMLInputElement | null
                  const p = document.getElementById("password") as HTMLInputElement | null
                  if (f) f.value = c.email
                  if (p) p.value = c.password
                  setErrors({})
                }}
                className="flex w-full flex-col items-start rounded-md bg-background px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
              >
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="text-muted-foreground">{c.email} · {c.password}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}
