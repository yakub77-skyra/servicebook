import { MessageSquare, Mail, Phone, Calendar } from "lucide-react"

import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Leads</h1>
        <p className="mt-1 text-muted-foreground">
          Contact form submissions from the website.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{leads.length} total</Badge>
        <span>· newest first</span>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
            <MessageSquare className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No leads yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When visitors submit the contact form, their messages will appear
            here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                  <span>{lead.name}</span>
                  <Badge variant="outline" className="text-xs font-normal">
                    {lead.source}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="size-3.5" />
                    {lead.email}
                  </span>
                  {lead.phone && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="size-3.5" />
                      {lead.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {new Date(lead.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  {lead.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
