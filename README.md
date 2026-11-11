# SalonFlow – Beauty Salon Appointment Management System

A modern web application prototype designed to demonstrate how beauty salons can manage appointments, services, stylists, customers, and multiple salon locations from a single, polished interface.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Purpose](#project-purpose)
3. [Features](#features)
4. [Screenshots](#screenshots)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Installation Guide](#installation-guide)
8. [Environment Configuration](#environment-configuration)
9. [Demo Information](#demo-information)
10. [Project Status](#project-status)
11. [Future Improvements](#future-improvements)
12. [Disclaimer](#disclaimer)
13. [Author](#author)

---

## Project Overview

**SalonFlow** is a full-stack web application prototype that simulates the day-to-day operations of a beauty salon business with two physical locations. It combines a customer-facing website — where clients browse services, view salon locations, and book appointments online — with a password-protected admin dashboard for managing those appointments, stylists, services, and customer records.

The application is built as an independent portfolio project to demonstrate practical skills in modern front-end development, database design, and user experience for small business software. It is **not** an official product of any real salon.

---

## Project Purpose

Small beauty salon businesses frequently struggle with manual or fragmented booking systems — phone calls, paper calendars, and scattered messaging. SalonFlow addresses several common operational pain points:

- **Appointment organization** — A structured, multi-step online booking flow that captures location, service, stylist, date, time, and customer details in a guided sequence.
- **Booking management** — A central admin table to search, filter, confirm, complete, and cancel appointments by status, date, or location.
- **Multiple salon location management** — Support for two salon locations (Forsyth Street and Broome Street), each with its own address, contact details, opening hours, and assigned stylists.
- **Customer information management** — A customer directory with visit history, contact details, and a detail view showing each customer's full booking record.
- **Service and stylist management** — Admin tools to add and edit services (name, description, price, duration, active/inactive status) and manage stylists (profile, specialty, working hours, assigned location, availability).

---

## Features

All features listed below are implemented in the current source code.

### Customer-Facing Website

| Feature | Description |
|---------|-------------|
| **Homepage** | Premium hero section with the headline "Your Beauty, Your Time.", a services preview, two salon location cards, fictional customer testimonials, and a contact footer. |
| **Services Page** | Grid of service cards with images, descriptions, duration in minutes, and demo prices. Each card links directly to the booking flow with the service pre-selected. |
| **Locations Page** | Both salon locations displayed with full address, opening hours (day-by-day), contact phone and email, a map placeholder, and a "Book at this location" button. |
| **Online Booking** | A 7-step guided booking process: (1) choose location, (2) choose service, (3) choose stylist, (4) select date, (5) select time slot, (6) enter customer information, (7) review and confirm. Includes form validation for name, email, and phone. |
| **Booking Confirmation** | A confirmation screen displaying a unique booking reference (e.g. `SF-XXXXXXXX`) and a full summary of the appointment. |
| **Double-booking prevention** | Already-booked time slots are visually disabled and a database-level unique constraint prevents the same stylist from being booked twice at the same date and time. |
| **Toast notifications** | Success and error messages appear as non-blocking notifications for booking actions and data-loading failures. |

### Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Demo login** | A credential-gated admin login screen (session-based, not production auth). |
| **Dashboard overview** | Summary statistic cards for today's appointments, pending, confirmed, and completed counts, plus estimated revenue. Charts powered by Recharts: a 7-day appointments/revenue area chart, a status distribution pie chart, and a service-mix bar chart. |
| **Appointments management** | A searchable, filterable table (by customer name, booking reference, service, or stylist; filter by date, location, and status). Action buttons to confirm, mark completed, or cancel each appointment. |
| **Calendar** | A weekly and monthly calendar view with appointments color-coded by status (pending, confirmed, completed, cancelled). Navigation between weeks/months and a "Today" shortcut. |
| **Customers** | A searchable customer directory with total visits and last appointment date. A slide-in detail panel shows full booking history per customer. |
| **Stylists management** | Stylist cards with profile photo, specialty, bio, assigned location, working hours (day-by-day), and availability status. Add and edit stylists through a modal form. |
| **Services management** | A table of services with inline activate/deactivate toggle. Add and edit services (name, description, price, duration, image URL) through a modal form. |
| **Locations (admin)** | A read-only view of both salon locations with full details, opening hours, and map placeholders. |
| **Settings** | A settings page with business profile info, notification toggles, booking rule toggles, and a security/demo-info panel. |

### Design & UX

- Premium salon aesthetic: warm beige, ivory, soft blush pink, dark charcoal, and muted gold accent.
- Elegant serif (Cormorant Garamond) for headings, clean sans-serif (Inter) for body text.
- Fully responsive layouts for desktop, tablet, and mobile.
- Loading states, hover transitions, and subtle fade-in animations.
- Accessible form controls with labels and validation feedback.

---

## Screenshots

> Screenshots will be added here once the project is deployed. Replace the placeholders below with actual image paths or hosted URLs.

| Page | Screenshot |
|------|-----------|
| Homepage | `screenshots/homepage.png` |
| Online Booking | `screenshots/booking.png` |
| Admin Dashboard | `screenshots/dashboard.png` |
| Appointment Calendar | `screenshots/calendar.png` |

---

## Technology Stack

All technologies listed below are actual dependencies defined in `package.json`.

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev) | ^18.3.1 | UI library |
| [TypeScript](https://www.typescriptlang.org) | ^5.5.3 | Type-safe JavaScript |
| [Vite](https://vitejs.dev) | ^7.3.7 | Build tool and dev server |
| [React Router DOM](https://reactrouter.com) | ^6.30.6 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com) | ^3.4.1 | Utility-first CSS framework |
| [Lucide React](https://lucide.dev) | ^0.446.0 | Icon library |
| [Recharts](https://recharts.org) | ^2.15.4 | Dashboard charts and graphs |

### Backend & Database

| Technology | Purpose |
|-----------|---------|
| [Supabase](https://supabase.com) (`@supabase/supabase-js` ^2.57.4) | PostgreSQL database, data API, and client SDK |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| PostCSS & Autoprefixer | CSS processing |
| TypeScript ESLint | TypeScript-specific lint rules |

---

## Project Structure

```
salonflow-beauty-salon/
├── index.html                      # HTML entry point with font preloads
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind theme (colors, fonts, shadows)
├── postcss.config.js               # PostCSS configuration
├── vite.config.ts                  # Vite config with @/ path alias
├── tsconfig.json                   # TypeScript project references
├── tsconfig.app.json               # App-specific TypeScript config
├── .gitignore                      # Ignores node_modules, dist, .env
│
├── supabase/
│   └── migrations/
│       └── salonflow_schema.sql    # Database schema + seed data
│
└── src/
    ├── main.tsx                    # React entry point
    ├── App.tsx                     # Root component with routing
    ├── index.css                   # Tailwind directives + global styles
    ├── types.ts                    # TypeScript interfaces (Location, Service, etc.)
    ├── vite-env.d.ts               # Vite environment type declarations
    │
    ├── lib/
    │   ├── supabase.ts             # Supabase client singleton
    │   ├── db.ts                   # Database query and mutation functions
    │   └── time.ts                 # Date/time helper utilities
    │
    └── components/
        ├── Toast.tsx               # Toast notification provider and context
        │
        ├── site/                   # Customer-facing shared components
        │   ├── Navbar.tsx
        │   └── Footer.tsx
        │
        └── admin/                  # Admin shared components
            ├── AdminLayout.tsx     # Sidebar + topbar shell
            └── StatusBadge.tsx     # Appointment status pill badge

    └── pages/
        ├── site/                   # Customer-facing pages
        │   ├── HomePage.tsx
        │   ├── ServicesPage.tsx
        │   ├── LocationsPage.tsx
        │   └── BookingPage.tsx
        │
        └── admin/                  # Admin dashboard pages
            ├── AdminLogin.tsx
            ├── DashboardOverview.tsx
            ├── AppointmentsPage.tsx
            ├── CalendarPage.tsx
            ├── CustomersPage.tsx
            ├── StylistsPage.tsx
            ├── ServicesPage.tsx
            ├── LocationsAdminPage.tsx
            └── SettingsPage.tsx
```

---

## Installation Guide

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes bundled with Node.js)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/busukbiji52-collab/salonflow-beauty-salon.git
   cd salonflow-beauty-salon
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at the local URL printed in your terminal (typically `http://localhost:5173`).

4. **Build for production** (optional)

   ```bash
   npm run build
   ```

   This outputs optimized assets to the `dist/` directory.

5. **Preview the production build** (optional)

   ```bash
   npm run preview
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run typecheck` | Run the TypeScript compiler in check mode |

---

## Environment Configuration

The application connects to a Supabase backend using two environment variables. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Important:** Never commit real API keys or passwords to version control. The `.gitignore` file already excludes `.env` from Git. If you need to share a template, create a `.env.example` file with placeholder values only.

Both variables are read in `src/lib/supabase.ts` via Vite's `import.meta.env` and are required for the application to connect to its database. The Supabase project URL and anon key are safe for client-side use — the anon key is designed to be public and is protected by Row Level Security policies on every table.

---

## Demo Information

The admin dashboard is protected by a demo login screen. These credentials are hardcoded in the prototype for demonstration purposes only and are **not** production-grade authentication.

| Field | Value |
|-------|-------|
| **Email** | `admin@salonflow.demo` |
| **Password** | `SalonDemo123!` |

On the login screen, you can click **"Click to fill demo credentials"** to auto-populate the form.

> This is demo authentication for the prototype only. It does not use secure session management, password hashing, or any production security mechanism. Do not reuse this pattern in a live application.

### Demo Data

The database is seeded with fictional demo content:

- **2 salon locations** — Forsyth Street and Broome Street, New York, NY 10002.
- **6 services** — Women's Haircut, Men's Haircut, Hair Coloring, Blowout, Hair Styling, Scalp Treatment (with fictional demo prices).
- **4 stylists** — each with a specialty, bio, photo, assigned location, and working hours.
- **6 demo customers** — with names, emails, phone numbers, and notes.
- **10 demo appointments** — spread across today and nearby dates with a mix of pending, confirmed, completed, and cancelled statuses.

All testimonials on the homepage are fictional and clearly labeled as demo content.

---

## Project Status

**SalonFlow is an independent prototype.** It is fully functional as a demonstration but has not been deployed to production or hardened for real customer use.

### Completed

- Customer-facing website (home, services, locations, booking).
- 7-step online booking flow with validation and double-booking prevention.
- Booking confirmation screen with unique reference codes.
- Admin login (demo credentials).
- Dashboard overview with statistics and charts.
- Appointments table with search, filters, and status actions.
- Weekly and monthly calendar with status color-coding.
- Customer directory with detail drawer and booking history.
- Stylist management (add, edit, view).
- Service management (add, edit, activate/deactivate).
- Locations view (read-only).
- Settings page.
- Supabase database schema with seed data and Row Level Security policies.

### Planned / Not Yet Implemented

- Online payment processing (e.g. Stripe integration).
- Automated email or SMS booking reminders.
- Customer loyalty / rewards program.
- Real admin authentication with secure session management.
- Location and opening-hours editing from the admin panel.
- Role-based access control (e.g. separate owner vs. receptionist roles).
- Production deployment and CI/CD pipeline.

---

## Future Improvements

Potential directions for extending this prototype into a production-ready product:

1. **Online payments** — Integrate Stripe or another payment processor to accept deposits or full payment at booking time.
2. **Automated reminders** — Send email or SMS reminders to customers 24 hours before their appointment, reducing no-shows.
3. **Customer loyalty management** — Track visit frequency, offer repeat-customer discounts, and implement a points or referral system.
4. **Real authentication** — Replace the demo login with Supabase Auth (email/password or OAuth) and role-based access control.
5. **Editable locations** — Allow admins to update addresses, contact details, and opening hours directly from the dashboard.
6. **Staff scheduling** — A dedicated scheduling view for managing stylist shifts, time-off requests, and capacity planning.
7. **Analytics & reporting** — Exportable reports on revenue, service popularity, stylist performance, and customer retention.
8. **Multi-language support** — Internationalization for salons serving non-English-speaking clientele.
9. **Mobile app** — A companion mobile app for stylists to view their daily schedule on the go.

---

## Disclaimer

This is an **independent portfolio project** created for demonstration and educational purposes. It is **not** an official product of Lee Ren Beauty Salon, and no business affiliation, partnership, or endorsement is implied or intended.

All business names, addresses, service prices, customer data, and testimonials used in this application are **fictional demo content**. Any resemblance to real persons, businesses, or events is coincidental.

---

## Author

**Ahmad Yani**
Freelance Data & Digital Solutions

- GitHub: [busukbiji52-collab](https://github.com/busukbiji52-collab)
- Repository: [salonflow-beauty-salon](https://github.com/busukbiji52-collab/salonflow-beauty-salon)

---

### Repository Description (for GitHub)

> A modern beauty salon appointment management system prototype featuring online booking, scheduling, and an admin dashboard.

### Suggested GitHub Topics

`beauty-salon` `appointment-booking` `salon-management` `react` `typescript` `vite` `portfolio-project` `web-application`
