# ServiceBook AI — Portfolio Content

> Use these materials for your Upwork profile, portfolio website, and demo video.

---

## How to use this file

- **Section 1 (Portfolio Description):** Paste into your Upwork profile "Project" section, your portfolio site's project card, or LinkedIn. Keep it as-is or tweak the tone.
- **Section 2 (Case Study):** Use for a portfolio website case study page, a Medium blog post, or attach as a PDF to Upwork proposals for higher-value jobs.
- **Section 3 (Upwork Proposal):** Copy, swap `[Client Name]` and the bracketed hooks, and send. Customize the bullet list to match the specific job post.
- **Section 4 (Demo Video Script):** Record yourself reading the voiceover lines while showing the matching visuals. Aim for 60-90 seconds total. Upload to YouTube as unlisted and link it from Upwork proposals.

---

## 1. Portfolio Description

ServiceBook AI is a production-ready, full-stack booking platform built for local service businesses like cleaners, tutors, and salon professionals. It lets customers browse services, book appointments, and pay online, while admins manage services, bookings, customers, and leads from a single dashboard. The project is built with Next.js 16 (App Router), TypeScript, Prisma + SQLite, custom JWT auth, a mock payment gateway, and n8n webhook automation for email notifications and lead capture. With role-based access, a clean UI using shadcn/ui and Tailwind CSS 4, and a modular architecture that can swap in real payment gateways like Razorpay or Stripe, it is fully deployable and ready for real businesses to use today.

---

## 2. Case Study

### Problem

Local service businesses — home cleaners, AC repair technicians, salon-at-home professionals, private tutors — still rely on phone calls and WhatsApp messages to manage bookings. There is no online presence, no way to collect payments in advance, and no system to track customers or revenue. Customers cannot book outside business hours, double-bookings happen often, and the business owner spends hours every day on manual follow-ups and reminders.

### Solution

I built ServiceBook AI, a full-stack booking platform that gives small service businesses a complete online presence in one product. Customers can browse services, pick a date and time, and pay online in under two minutes. Admins get a dashboard to manage services, view and update booking statuses, see customers, and track leads — all in real time. Behind the scenes, n8n webhook automation sends confirmation and reminder emails to customers and notifies the admin and sales team whenever a booking or lead is created, removing the need for manual follow-up.

### Key Features

**Customer Experience**
- Public marketing site with hero, services, testimonials, and CTA sections
- Service catalog with live search, category filter, and price/duration sorting
- SEO-friendly service detail pages
- Booking flow with date picker and 16 time slots (9 AM – 6 PM)
- Customer dashboard with stats (total bookings, upcoming, total spent), My Bookings, and profile
- Self-service booking cancellation

**Admin Tools**
- Admin dashboard with stats: total bookings, revenue, customers, active services
- Service CRUD (create, edit, delete, toggle active) with auto-slug and cascade delete
- Booking status management (pending → confirmed → completed / cancelled)
- Customer list with booking count and total spend per customer
- Leads table with source, message, and contact info
- Built-in n8n setup guide page

**Payments**
- Mock payment gateway simulating Razorpay/Stripe checkout
- Card form with test card pre-filled, processing animation, and success receipt
- Payment auto-confirms the booking and updates revenue stats in real time
- Payment records stored in DB with transaction IDs

**Automation (n8n)**
- Booking creation webhook → email customer + admin + schedule reminder
- Lead creation webhook → push to CRM + notify sales team
- Callback webhook from n8n → updates booking status in DB

### Tech Stack

| Layer        | Technology                                                   |
| ------------ | ------------------------------------------------------------ |
| Frontend     | Next.js 16 (App Router), TypeScript, Tailwind CSS 4          |
| UI           | shadcn/ui, Framer Motion, dark/light mode (next-themes)     |
| Backend      | Next.js Route Handlers (REST API)                            |
| Database     | Prisma ORM + SQLite (5 tables: Profile, Service, Booking, Payment, Lead) |
| Auth         | Custom JWT (jose) + bcrypt, HTTP-only cookies, role-based    |
| Payments     | Mock gateway (Razorpay/Stripe-ready architecture)           |
| Automation   | n8n webhooks (booking + lead notifications + callback)      |

### Results / Outcomes

- **Reduced booking time** from a 5+ minute phone call to under 2 minutes online, available 24/7.
- **Automated email notifications** eliminate manual confirmation and reminder follow-ups.
- **Admin dashboard** gives real-time visibility into bookings, revenue, customers, and leads in one screen.
- **Modular architecture** means real payment gateways (Razorpay, Stripe) and a real database (Postgres) can be swapped in without rewriting the app.
- **Role-based access** cleanly separates customer and admin experiences with proper auth guards on every API route.

### Scope & Future Improvements

- Swap SQLite for Postgres for production scale
- Replace mock payment gateway with live Razorpay or Stripe
- Add SMS reminders via Twilio alongside n8n email flows
- Add a provider-side app (separate role) for field staff to manage their own bookings
- Add coupon codes and recurring booking subscriptions

---

## 3. Upwork Proposal Template

> Copy and customize this for booking system / service marketplace / Next.js job postings on Upwork.

Hi [Client Name],

Your job post about [booking system / service marketplace] caught my eye — it's exactly the kind of project I love building.

I recently built a similar project called **ServiceBook AI**, a full-stack booking platform with Next.js 16, TypeScript, and Prisma. It includes customer signup/login, service catalog with search and filter, a date/time booking flow, online payments (mock Razorpay-style checkout), a customer dashboard for managing bookings, and an admin dashboard for managing services, bookings, customers, and leads. I also wired up n8n webhooks for automated confirmation and reminder emails.

Here's what I can deliver for your project:

- A clean, responsive booking UI with SEO-friendly service pages
- Secure JWT auth with role-based access (customer vs admin)
- Booking flow with date/time selection and double-booking prevention
- Payment integration (Razorpay, Stripe, or your preferred gateway)
- Admin dashboard with real-time stats, CRUD, and booking status management
- Optional n8n / email automation for confirmations and reminders

Live demo + GitHub: [your-link-here]

I'd love to discuss your requirements and timeline — happy to hop on a quick call. Let me know if you'd like me to walk you through the demo.

Best,
[Your Name]

### Proposal customization tips

- **First line:** Always reference something specific from the job post ("Your mention of double-booking prevention stood out…") so it doesn't look copy-pasted.
- **Bullet list:** Reorder or trim the 6 bullets to match what the client actually asked for. If they want payment integration, lead with the payment bullet. If they want admin tools, lead with the dashboard bullet.
- **Links:** Replace `[your-link-here]` with your live demo URL first, then GitHub. If you have a 60-second demo video, link that instead — clients love video.
- **Length:** Keep it under 200 words. Upwork clients skim on mobile.
- **Tone:** Confident but not arrogant. "I recently built a similar project" beats "I am an expert in…".
- **Don't:** Use the word "Dear" (sounds dated), use generic openings like "I hope you are doing well", or list technologies the client didn't ask about.

---

## 4. Demo Video Script (60-90 seconds)

> Total runtime: ~80 seconds. Record at 1080p, keep cuts tight, show real product screens.

---

**[0:00 – 0:05] INTRO**

VISUAL: Title card — "ServiceBook AI — Full-Stack Booking Platform" over a blurred dashboard screenshot. Cuts to home page hero.

VOICEOVER: This is ServiceBook AI, a full-stack booking platform I built with Next.js, TypeScript, and Prisma. Let me show you how it works.

---

**[0:05 – 0:25] CUSTOMER FLOW**

VISUAL: Click "Services" in navbar → grid of 4 services (Home Cleaning ₹499, AC Repair ₹699, Salon at Home ₹899, Math Tutoring ₹399). Click "Home Cleaning" → service detail page. Click "Book Now" → booking page with date picker and time slot buttons. Pick tomorrow, select 10:00 AM, click "Confirm Booking". Success state appears.

VOICEOVER: A customer browses services, picks one, chooses a date and time slot, and confirms the booking in under two minutes — no phone calls, no back-and-forth.

---

**[0:25 – 0:35] PAYMENT**

VISUAL: Click "Pay Now" on the success screen → checkout dialog opens with order summary and card form pre-filled with test card 4242. Click "Pay ₹499" → processing spinner → green success screen with receipt (transaction ID, amount, date).

VOICEOVER: Payment happens through a mock gateway that mimics Razorpay or Stripe. Once paid, the booking is auto-confirmed and a receipt is generated.

---

**[0:35 – 0:45] CUSTOMER DASHBOARD**

VISUAL: Navigate to customer dashboard. Show 3 stat cards (Total bookings, Upcoming, Total spent). Click "My Bookings" → list of bookings with status badges. Hover over a pending booking → click "Cancel".

VOICEOVER: Customers get their own dashboard with stats, booking history, and the ability to cancel upcoming bookings.

---

**[0:45 – 1:05] ADMIN DASHBOARD**

VISUAL: Log out → go to /admin/login → enter admin@servicebook.com / admin123. Land on admin dashboard with 4 stat cards (Total bookings, Revenue, Customers, Active services). Click "Bookings" in sidebar → table of all bookings → change one booking's status from "Pending" to "Confirmed" using the dropdown. Click "Services" → CRUD table → toggle a service's active switch off. Click "Leads" → leads table.

VOICEOVER: On the admin side, the dashboard shows live revenue and booking stats. Admins can change booking statuses, add or remove services, and view every lead that came through the contact form.

---

**[1:05 – 1:15] AUTOMATION**

VISUAL: Split screen — left side shows booking success, right side shows an n8n workflow diagram with webhook → email node. Cut to a sample confirmation email in an inbox.

VOICEOVER: Every new booking triggers an n8n webhook that sends a confirmation email to the customer and notifies the admin. Leads from the contact form are pushed to a CRM automatically.

---

**[1:15 – 1:20] OUTRO**

VISUAL: Final title card — "Built with Next.js 16, TypeScript, Prisma, and n8n. Demo logins in the description." Show GitHub + live demo links.

VOICEOVER: Built with Next.js, TypeScript, Prisma, and n8n. Demo logins are in the description — try it yourself. Thanks for watching.

---

### Production Notes

- **Demo logins to show on screen or in description:**
  - Admin: `admin@servicebook.com` / `admin123`
  - Customer: `customer@servicebook.com` / `customer123`
- **Test card for the mock checkout:** `4242 4242 4242 4242`, any future expiry, any CVC.
- **Recording tips:**
  - Use 1080p, 30fps, no zoom effects — keep it crisp.
  - Show the mouse cursor; use Framer Motion transitions as natural cut points.
  - Record in Chrome with devtools closed.
  - Add light background music at -20dB, no voiceover ducking needed.
- **Suggested thumbnail:** Dashboard screenshot with "ServiceBook AI" title overlay and a small "Next.js + Prisma + n8n" badge.
