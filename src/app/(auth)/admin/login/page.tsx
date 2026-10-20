import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react"

import { LoginForm } from "@/components/site/login-form"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Admin login — ServiceBook AI",
  description: "Staff access to the ServiceBook AI admin dashboard.",
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 w-fit text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Admin login</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Staff access only. Sign in with an admin account.
          </p>
        </div>

        <LoginForm
          expectedRole="admin"
          redirectTo="/admin/dashboard"
          demoCreds={[
            { label: "Admin account", email: "admin@servicebook.com", password: "admin123" },
          ]}
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Sparkles className="mr-1 inline size-3" />
        ServiceBook AI · Admin Portal
      </p>
    </section>
  )
}
