"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sparkles, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react"

import { siteConfig, publicNav } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"

export function Navbar() {
  const pathname = usePathname()
  const { user, loading } = useCurrentUser()
  const [open, setOpen] = React.useState(false)

  // Close the mobile menu whenever the route changes
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" : "/dashboard"
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : ""

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      await new Promise((r) => setTimeout(r, 100))
    } catch {
      // ignore
    }
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                  aria-label="Open user menu"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs p-0">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <span className="flex items-center gap-2 font-bold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="size-4" />
                  </span>
                  {siteConfig.name}
                </span>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {publicNav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent",
                        isActive(item.href) ? "bg-accent text-primary" : "text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {loading ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : user ? (
                  <>
                    <div className="mb-1 flex items-center gap-3 px-1 py-2">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button asChild variant="outline">
                        <Link href={dashboardHref}>
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>
                      </Button>
                    </SheetClose>
                    <Button variant="ghost" onClick={handleLogout} className="text-destructive">
                      <LogOut className="size-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
