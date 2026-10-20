import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"

import { LoginForm } from "@/components/site/login-form"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Log in — ServiceBook AI",
  description: "Log in to your ServiceBook AI account to manage your bookings.",
}

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 sm:py-16">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 w-fit text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Log in to manage your bookings and payments.
          </p>
        </div>

        <LoginForm
          redirectTo="/dashboard"
          demoCreds={[
            { label: "Customer account", email: "customer@servicebook.com", password: "customer123" },
            { label: "Admin account", email: "admin@servicebook.com", password: "admin123" },
          ]}
        />
      </div>
    </section>
  )
}
