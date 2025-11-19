# Wellcart Farm

Starter Next.js 14 App Router workspace for Wellcart's farm-retailer console. The project bundles
Tailwind CSS, TypeScript, and the Supabase JavaScript SDK so new flows can be prototyped quickly.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and populate the Supabase variables.
3. Provision Supabase resources by running the SQL in `supabase/schema.sql` (via the Supabase SQL editor or `supabase db execute`) to create the `retailer_profiles` and `product_catalog_items` tables, disable RLS, and seed public storage buckets for logos, product photos, and SKU CSV uploads.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000` to explore the dashboard, onboarding, upload, and eligibility pages.

## Available routes

- `/` – dashboard overview linking to each workflow.
- `/onboard` – outlines onboarding steps for new retailers.
- `/upload` – highlights upload entry points for photos, CSV files, and manual SKU edits.
- `/eligibility/[id]` – renders a single eligibility request and is wired to the mock API.
- `/api/*` – API route scaffolding that echoes data back to the caller for quick integration testing.
