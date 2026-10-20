"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sparkles,
  Menu,
  X,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  CalendarDays,
  User,
  Wrench,
  CalendarCheck,
  Users,
  MessageSquare,
  Zap,
  Rocket,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

// Icons are mapped on the client side because Server Components can only
// pass plain serializable values to Client Components.
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarDays,
  User,
  Wrench,
  CalendarCheck,
  Users,
  MessageSquare,
  Zap,
  Rocket,
}

export type DashboardNavItem = {
  title: string
  href: string
  // string key looked up in iconMap (kept serializable for RSC -> CC passing)
  icon: string
}

type Props = {
  items: DashboardNavItem[]
  user: { name: string; email: string; role: "customer" | "admin" }
  areaLabel: string
}

export function DashboardSidebar({ items, user, areaLabel }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === pathname || pathname.startsWith(href + "/")

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      // Give the browser a moment to persist the cleared cookie before
      // navigating, otherwise the next page may still see the old session.
      await new Promise((r) => setTimeout(r, 100))
    } catch {
      // ignore network errors — still redirect
    }
    window.location.href = "/"
  }

  const NavList = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {areaLabel}
      </p>
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.title}
          </Link>
        )
      })}
      <div className="mt-2 border-t border-border/70 pt-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ExternalLink className="size-4" />
          Back to site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5 font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">ServiceBook</span>
        </div>
        <div className="flex-1 overflow-y-auto">{NavList}</div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar + sheet */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">ServiceBook</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <span className="font-bold">{areaLabel} menu</span>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex-1 overflow-y-auto">{NavList}</div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
