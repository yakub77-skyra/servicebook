import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"

import { siteConfig } from "@/lib/site"
import { ContactForm } from "@/components/site/contact-form"

export const metadata: Metadata = {
  title: "Contact us — ServiceBook AI",
  description:
    "Have a question or need a custom service? Send us a message and our team will get back to you within 24 hours.",
}

const contactDetails = [
  {
    icon: Mail,
    label: "Email us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: siteConfig.address,
  },
  {
    icon: Clock,
    label: "Working hours",
    value: "Mon–Sat · 9:00 AM – 7:00 PM",
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <MessageSquare className="size-3.5 text-primary" />
            We reply within 24 hours
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Questions about a service, bulk bookings, or a custom request? Fill
            out the form and our team will reach out to you shortly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left: contact details */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer to reach out directly? Use any of the channels below.
            </p>

            <ul className="mt-6 space-y-4">
              {contactDetails.map((d) => (
                <li
                  key={d.label}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
