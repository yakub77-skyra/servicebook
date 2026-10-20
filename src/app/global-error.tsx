"use client"

// Global error boundary — prevents the raw "Application error / Digest"
// screen when an unexpected server error slips through. Shows a friendly
// message with a retry button instead.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("[global-error]", error)
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            The page couldn&apos;t load. This is usually a temporary database
            connection issue. Please try again.
          </p>
          {error?.digest && (
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <div style={{ marginTop: 12 }}>
            <a href="/" style={{ color: "#4f46e5", fontSize: 14 }}>
              ← Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
