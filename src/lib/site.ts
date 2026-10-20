// Central place for brand and navigation info used across the app.
export const siteConfig = {
  name: "ServiceBook AI",
  shortName: "ServiceBook",
  tagline: "Book trusted local services in minutes",
  description:
    "A modern booking platform for local service businesses. Browse services, book appointments, pay securely, and manage your bookings — all in one place.",
  email: "hello@servicebook.ai",
  phone: "+91 90000 00000",
  address: "Bengaluru, Karnataka, India",
  social: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
}

// Public navigation links shown in the navbar / footer
export const publicNav = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Book", href: "/booking" },
  { title: "Contact", href: "/contact" },
] as const

export type NavItem = { title: string; href: string }
