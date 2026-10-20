import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceBook AI — Book Trusted Local Services Online",
  description:
    "ServiceBook AI is a modern booking platform for local service businesses. Browse services, book appointments, pay securely, and manage your bookings — all in one place.",
  keywords: [
    "ServiceBook AI",
    "local services booking",
    "home cleaning",
    "AC repair",
    "salon at home",
    "online appointment booking",
    "service marketplace",
  ],
  authors: [{ name: "ServiceBook AI" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ServiceBook AI — Book Trusted Local Services Online",
    description:
      "Browse services, book appointments, pay securely, and manage your bookings — all in one place.",
    siteName: "ServiceBook AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceBook AI — Book Trusted Local Services Online",
    description:
      "Browse services, book appointments, pay securely, and manage your bookings — all in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
