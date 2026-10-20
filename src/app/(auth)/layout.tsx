// Minimal layout for the admin login page (no public navbar/footer).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-muted/20">{children}</div>
}
