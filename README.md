# ServiceBook AI

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

> A full-stack booking platform for local service businesses — built with Next.js 16, TypeScript, Prisma, and n8n automation.

ServiceBook AI lets customers browse services, book appointments, and pay online, while giving business owners a complete admin dashboard to manage services, bookings, customers, leads, and revenue. It ships with a mock payment gateway, JWT-based auth, and webhook-driven n8n workflows for booking notifications and lead capture — ready to demo to clients on Upwork.

---

## 📸 Screenshots

> _Add screenshots here once the project is deployed. Recommended captures:_
>
> - `screenshots/home.png` — Public landing page hero
> - `screenshots/services.png` — Services listing with search/filter
> - `screenshots/booking.png` — Booking page with date/time picker
> - `screenshots/checkout.png` — Mock payment checkout dialog
> - `screenshots/customer-dashboard.png` — Customer dashboard stats
> - `screenshots/admin-dashboard.png` — Admin dashboard with revenue
> - `screenshots/admin-services.png` — Admin service CRUD
> - `screenshots/admin-bookings.png` — Admin booking management

```md
![Home](screenshots/home.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## ✨ Features

### 🌐 Public
- **Home page** — hero, services preview, how-it-works, features, testimonials, and CTA sections
- **Services listing** — live search, category filter, and sort by price/rating
- **Service details** — SEO-friendly page with full description, rating, and book-now CTA
- **Booking page** — date picker + time slot selector with validation (no past dates, no double-booking)
- **Contact form** — saves lead to database **and** forwards to n8n webhook

### 👤 Customer
- **Signup / Login** — JWT-based auth with bcrypt password hashing, HTTP-only cookies
- **Dashboard** — stats: total bookings, upcoming bookings, total spent
- **My Bookings** — view, cancel, and pay for bookings
- **Profile** — view and edit personal details

### 🛡️ Admin
- **Separate admin login** — role-guarded access at `/admin/login`
- **Dashboard** — total bookings, revenue, customers, active services, recent bookings table
- **Services CRUD** — add, edit, delete, and toggle active/inactive
- **Bookings management** — inline status changes (pending → confirmed → completed → cancelled)
- **Customers list** — every customer with booking count and total spend
- **Leads table** — every contact form submission with source and timestamp
- **n8n Automation guide** — in-app setup instructions and webhook URLs

### 💳 Payments
- **Mock checkout flow** — card form (test card pre-filled), processing animation, success receipt
- **Auto-confirm** — booking status moves from `pending` → `confirmed` when payment succeeds
- **Payment records** — every payment stored with transaction ID and method
- **Realistic UX** — error handling, duplicate-payment prevention, and instant status updates everywhere

### 🤖 Automation (n8n)
- **Booking webhook** — every new booking forwards to `N8N_BOOKING_WEBHOOK_URL` (email customer + admin, schedule reminder)
- **Lead webhook** — every contact form submission forwards to `N8N_LEAD_WEBHOOK_URL` (add to CRM, notify sales team)
- **Callback webhook** — n8n can call back `/api/webhooks/booking-notification?key=SECRET` to update booking status

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Lucide icons |
| **Backend** | Next.js Route Handlers (API Routes) |
| **Database** | Prisma ORM + SQLite (swap to PostgreSQL for production) |
| **Authentication** | Custom JWT auth (`jose`), `bcryptjs` hashing, HTTP-only cookies |
| **Payments** | Mock payment gateway (simulates Razorpay/Stripe test flow) |
| **Automation** | n8n webhook integration |
| **State** | React Hook Form, TanStack Query |
| **UI** | Framer Motion, `next-themes` (dark/light), fully responsive |

---

## 🚀 Live Demo

> _Placeholder — add your deployed URL here once live._
>
> **Live URL:** `https://your-servicebook-demo.vercel.app`

---

## 📦 Setup Instructions

### Prerequisites
- **Node.js 18+** or **Bun** (recommended — faster installs)
- **Git**
- An **n8n** instance (optional — only for automation features)

### 1. Clone & install

```bash
git clone https://github.com/your-username/servicebook-ai.git
cd servicebook-ai
bun install        # or: npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL="file:./db/custom.db"
AUTH_SECRET="your-random-secret-here"   # generate with: openssl rand -base64 32
N8N_BOOKING_WEBHOOK_URL=""             # optional — set after n8n setup
N8N_LEAD_WEBHOOK_URL=""                # optional — set after n8n setup
WEBHOOK_SECRET=""                      # optional — used for n8n callback auth
```

### 3. Set up the database

```bash
bun run db:push     # creates all tables from prisma/schema.prisma
bun run db:seed     # seeds 4 services + demo admin + demo customer
```

### 4. Start the dev server

```bash
bun run dev         # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) and log in with one of the demo accounts below.

---

## 🔑 Demo Logins

> ⚠️ **These accounts are created by `bun run db:seed`.** Use them to test the app instantly.

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@servicebook.com` | `admin123` | `/admin/dashboard` |
| **Customer** | `customer@servicebook.com` | `customer123` | `/dashboard` |

**Quick test flow:**
1. Log in as **customer** → browse services → book an appointment → pay with the test card
2. Log in as **admin** → see the new booking → change its status → view revenue update

---

## 🗄️ Database Setup

### Prisma schema

The schema lives at `prisma/schema.prisma` and defines 5 models:

| Model | Description |
|-------|-------------|
| **Profile** | A user — either `customer` or `admin`. Stores bcrypt password hash. |
| **Service** | A bookable service with price, duration, category, rating, and active flag. |
| **Booking** | A customer's appointment for a service. Status: `pending` / `confirmed` / `cancelled` / `completed`. Payment status: `pending` / `paid` / `failed`. |
| **Payment** | A payment record linked to a booking. Stores amount, method, transaction ID, and status. |
| **Lead** | A contact form submission. Stores name, email, phone, message, and source. |

### Seed data

Running `bun run db:seed` creates:

- **4 services:**
  - 🏠 Home Cleaning — ₹499 / 60 min
  - ❄️ AC Repair — ₹699 / 45 min
  - 💇 Salon at Home — ₹899 / 90 min
  - 📚 Math Tutoring — ₹399 / 60 min
- **1 demo admin:** `admin@servicebook.com`
- **1 demo customer:** `customer@servicebook.com`

### Reset the database

```bash
rm db/custom.db          # delete the SQLite file
bun run db:push          # recreate tables
bun run db:seed          # reseed demo data
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | SQLite path — `file:./db/custom.db` |
| `AUTH_SECRET` | ✅ Yes | Secret used to sign JWT tokens. Generate with `openssl rand -base64 32`. |
| `N8N_BOOKING_WEBHOOK_URL` | ❌ Optional | n8n webhook URL fired on every new booking. |
| `N8N_LEAD_WEBHOOK_URL` | ❌ Optional | n8n webhook URL fired on every contact form submission. |
| `WEBHOOK_SECRET` | ❌ Optional | Shared secret for the `/api/webhooks/booking-notification` callback. Pass as `?key=SECRET`. |

---

## 🔌 n8n Automation Setup

ServiceBook AI integrates with [n8n](https://n8n.io) for two automations:

### 1. Booking notification workflow

Fires every time a customer creates a booking.

**Steps to build in n8n:**
1. Add a **Webhook** node → set method to `POST` → copy the production URL.
2. Add an **Email** node → send a confirmation email to the customer.
3. Add another **Email** node → notify the admin.
4. (Optional) Add a **Schedule Trigger** or **Wait** node → send a reminder 1 hour before the appointment.
5. Activate the workflow.
6. Paste the webhook URL into your `.env.local` as `N8N_BOOKING_WEBHOOK_URL`.

### 2. Lead capture workflow

Fires every time a visitor submits the contact form.

**Steps to build in n8n:**
1. Add a **Webhook** node → set method to `POST` → copy the production URL.
2. Add a **CRM node** (HubSpot, Notion, Google Sheets, etc.) → store the lead.
3. Add a **Slack** or **Email** node → notify the sales team.
4. Activate the workflow.
5. Paste the webhook URL into your `.env.local` as `N8N_LEAD_WEBHOOK_URL`.

### 3. Callback webhook (n8n → ServiceBook)

n8n can update a booking's status by calling back:

```
POST https://your-domain.com/api/webhooks/booking-notification?key=YOUR_WEBHOOK_SECRET
Content-Type: application/json

{
  "bookingId": "clxxxx...",
  "action": "confirm"
}
```

Supported actions: `confirm`, `complete`, `cancel`. The `key` query param must match your `WEBHOOK_SECRET` env var.

### Testing

After setup, create a booking through the UI and watch the n8n execution log light up. The admin **Automation** page (at `/admin/automation`) shows the current webhook URLs and setup checklist.

---

## 🚢 Deployment

### Frontend → Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Add all environment variables from the [Environment Variables](#-environment-variables) table.
4. Click **Deploy**. Vercel auto-detects Next.js and runs `bun run build`.

### Database

The dev database is a local SQLite file (`db/custom.db`). For production, swap to PostgreSQL:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"      // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Then set `DATABASE_URL` to your Postgres connection string (e.g. from [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)) and run:

```bash
bun run db:push
bun run db:seed
```

### n8n

Self-host with Docker or use [n8n.cloud](https://n8n.cloud):

```bash
# Quick local n8n (Docker)
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
# Open http://localhost:5678
```

---

## 📡 API Routes

All routes are JSON. Customer routes require a valid JWT cookie; admin routes require an admin role.

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/services` | List all active services |
| `POST` | `/api/leads` | Submit a contact form lead |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create a new customer account |
| `POST` | `/api/auth/login` | Log in (returns JWT in HTTP-only cookie) |
| `POST` | `/api/auth/logout` | Clear the auth cookie |
| `GET` | `/api/auth/me` | Get the current user's profile |

### Customer (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | List the current user's bookings |
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/[id]` | View a single booking |
| `PATCH` | `/api/bookings/[id]` | Cancel a booking |
| `POST` | `/api/payments/create` | Create a payment intent for a booking |
| `POST` | `/api/payments/verify` | Verify a payment (mock gateway) — auto-confirms booking |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Dashboard stats (bookings, revenue, customers, services) |
| `GET` | `/api/admin/services` | List all services (including inactive) |
| `POST` | `/api/admin/services` | Create a service |
| `GET` | `/api/admin/services/[id]` | Get a single service |
| `PATCH` | `/api/admin/services/[id]` | Update a service |
| `DELETE` | `/api/admin/services/[id]` | Delete a service (cascades to bookings) |
| `GET` | `/api/admin/bookings` | List all bookings |
| `PATCH` | `/api/admin/bookings/[id]` | Change a booking's status |
| `GET` | `/api/admin/customers` | List all customers with booking stats |
| `GET` | `/api/admin/leads` | List all leads |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/booking-notification` | n8n callback to update booking status |

---

## 🗺️ Project Structure

```
servicebook-ai/
├── prisma/
│   ├── schema.prisma          # 5 models: Profile, Service, Booking, Payment, Lead
│   └── seed.ts                # Seeds 4 services + demo users
├── src/
│   ├── app/
│   │   ├── (public)/          # Home, services, service detail, booking, contact, login, signup
│   │   ├── (auth)/            # Admin login page
│   │   ├── (customer)/        # Customer dashboard, bookings, profile
│   │   ├── (admin)/           # Admin dashboard, services, bookings, customers, leads, automation
│   │   ├── api/
│   │   │   ├── auth/          # signup, login, logout, me
│   │   │   ├── bookings/      # customer booking endpoints
│   │   │   ├── payments/      # create + verify (mock gateway)
│   │   │   ├── admin/         # stats, services, bookings, customers, leads
│   │   │   ├── leads/         # public lead submission
│   │   │   ├── services/      # public service listing
│   │   │   └── webhooks/      # n8n booking-notification callback
│   │   ├── layout.tsx         # Root layout with ThemeProvider
│   │   └── globals.css        # Tailwind 4 + theme tokens
│   ├── components/
│   │   ├── site/              # App-specific: navbar, footer, booking-form, payment-button, etc.
│   │   ├── ui/                # shadcn/ui primitives (button, dialog, table, etc.)
│   │   └── theme-provider.tsx # next-themes wrapper
│   ├── hooks/                 # use-current-user, use-toast, use-mobile
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── session.ts         # JWT sign/verify + auth helpers
│       ├── admin.ts           # requireAdmin guard
│       ├── n8n.ts             # Webhook forwarders
│       ├── api.ts             # Fetch wrappers
│       ├── services.ts        # Service data helpers
│       ├── format.ts          # Date/price formatters
│       ├── site.ts            # Brand config + nav
│       └── utils.ts           # cn() class merger
├── public/                    # Logo, robots.txt
├── .env.local                 # Your env vars (not committed)
├── package.json
└── README.md
```

### Available scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the dev server on `http://localhost:3000` |
| `bun run lint` | Run ESLint |
| `bun run build` | Production build |
| `bun run db:push` | Push schema to database (creates/updates tables) |
| `bun run db:generate` | Regenerate Prisma Client |
| `bun run db:seed` | Seed demo data (services + users) |
| `bun run db:migrate` | Create a Prisma migration |
| `bun run db:reset` | Reset database (migrations mode) |

---

## 🔮 Future Improvements

- 💳 **Real payments** — integrate Razorpay/Stripe (the mock gateway is a drop-in replacement)
- 🔔 **Real-time notifications** — WebSocket-based booking updates instead of polling
- 📱 **Mobile app** — React Native client reusing the same API
- 🌍 **Multi-language** — i18n with `next-intl` (already installed)
- 📅 **Calendar sync** — Google Calendar / Outlook integration for customers
- ⭐ **Reviews & ratings** — let customers leave reviews after completed bookings
- 🏆 **Loyalty program** — points and discounts for repeat customers
- 📊 **Analytics dashboard** — revenue charts, booking trends, customer cohorts
- 🗺️ **Service-area maps** — geolocation-based service filtering
- 🤖 **AI chatbot** — recommend services and answer FAQs

---

## 📄 License

Released under the **MIT License**.

```
MIT License

Copyright (c) 2025 ServiceBook AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Your Name**
Freelance Full-Stack Web Developer

- 💼 **Upwork:** [https://www.upwork.com/freelancers/your-profile](https://www.upwork.com/freelancers/your-profile)
- 🐙 **GitHub:** [https://github.com/your-username](https://github.com/your-username)
- ✉️ **Email:** your.email@example.com

> _Built as a portfolio project to demonstrate full-stack Next.js, Prisma, and n8n automation skills for prospective clients on Upwork._
