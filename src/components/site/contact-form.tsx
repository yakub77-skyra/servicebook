"use client"

import * as React from "react"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormErrors = {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+]?[\d\s-]{10,15}$/

export function ContactForm() {
  const { toast } = useToast()
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)

  function validate(data: FormData): FormErrors {
    const next: FormErrors = {}
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const phone = String(data.get("phone") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()

    if (!name) next.name = "Please enter your name"
    else if (name.length < 2) next.name = "Name is too short"

    if (!email) next.email = "Please enter your email"
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address"

    if (!phone) next.phone = "Please enter your phone number"
    else if (!PHONE_RE.test(phone))
      next.phone = "Enter a valid 10-digit phone number"

    if (!message) next.message = "Please tell us how we can help"
    else if (message.length < 10)
      next.message = "Message should be at least 10 characters"

    return next
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    // Phase 3: POST the lead to the database via /api/leads.
    // Phase 8 will also forward this to an n8n lead-capture webhook.
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
          source: "contact_form",
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        const msg = json?.error || "Something went wrong. Please try again."
        setSubmitting(false)
        toast({
          title: "Could not send message",
          description: msg,
          variant: "destructive",
        })
        return
      }

      setSubmitting(false)
      setDone(true)
      form.reset()

      toast({
        title: "Message sent!",
        description: "Our team will get back to you within 24 hours.",
      })
    } catch (err) {
      console.error("[contact form] submit error:", err)
      setSubmitting(false)
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-4 text-xl font-semibold">Thank you!</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Your message has been received. Our team will contact you within 24
          hours.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => setDone(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            placeholder="Priya Sharma"
            autoComplete="name"
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={errors.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
        </Field>
      </div>

      <Field label="Email address" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us what you need help with..."
          aria-invalid={!!errors.message}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We respect your privacy. Your details are never shared with third
        parties.
      </p>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
