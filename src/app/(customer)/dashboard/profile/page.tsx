import { Mail, Phone, ShieldCheck, CalendarDays } from "lucide-react"

import { getCurrentUser } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  const info = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Phone, label: "Phone", value: user?.phone || "Not provided" },
    {
      icon: CalendarDays,
      label: "Member since",
      value: user
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Your account details and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Account details</span>
            <Badge variant="secondary" className="capitalize">
              <ShieldCheck className="mr-1 size-3" />
              {user?.role}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {user?.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div>
              <p className="text-lg font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <ul className="space-y-3">
            {info.map((row) => (
              <li key={row.label} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <row.icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-medium">{row.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
        Profile editing will be added in a future phase.
      </p>
    </div>
  )
}
