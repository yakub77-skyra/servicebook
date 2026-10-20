---
Task ID: 1
Agent: main
Task: Phase 1 — Project setup, folder structure, theme, and basic layout (Navbar, Footer, Home hero) for ServiceBook AI

Work Log:
- Reviewed existing project scaffold (Next.js 16 + TS + Tailwind 4 + shadcn/ui + Prisma/SQLite).
- Adapted user's JS+Supabase request to environment stack (TypeScript + Prisma/SQLite) and explained to user.
- Configured blue/indigo theme in src/app/globals.css (light + dark mode, success/warning semantic colors, custom scrollbar).
- Added ThemeProvider (next-themes) and updated root layout metadata + favicon to ServiceBook AI branding.
- Created src/lib/site.ts (central brand config + public nav).
- Built src/components/site/navbar.tsx (sticky header, desktop nav, mobile Sheet menu, active-link highlight).
- Built src/components/site/footer.tsx (brand, quick links, contact, socials, sticky via flex column).
- Built src/components/site/page-placeholder.tsx (reusable "coming in phase X" component).
- Created src/app/(public)/layout.tsx with min-h-screen flex column (sticky footer).
- Built src/app/(public)/page.tsx (hero + how-it-works + features + CTA).
- Added placeholder pages for /services, /booking, /contact, /login, /signup so nav links don't 404.
- Ran `bun run lint` — clean, no errors.
- Verified with Agent Browser: home renders all sections, navbar sticky, mobile menu opens, navigation to /services works, footer sticky (flex layout confirmed), no console errors. Screenshots saved (phase1-home-desktop.png, phase1-home-mobile.png, phase1-shortpage-footer.png).

Stage Summary:
- Phase 1 foundation complete and browser-verified.
- Folder structure uses (public) route group now; (auth)/(customer)/(admin) + api/ route groups will be created in their respective phases.
- Design system: indigo primary, rounded corners, soft shadows, responsive.
- Ready for user confirmation before Phase 2 (full public UI pages: services list, service details, contact form).
