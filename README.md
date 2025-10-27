# N2S Stack

N2S stands for Next.js + Supabase + Shadcn UI. This starter is the opinionated baseline I use for projects that need authentication, a PostgreSQL database, pleasant defaults for styling, and a batteries-included developer workflow.

## What's Inside
- Next.js 16 App Router with React 19 server and client components wired for streaming, layouts, and metadata.
- Supabase authentication and database access preconfigured for SSR, edge functions, and client mutations.
- Shadcn UI component library backed by Tailwind CSS v4, custom tokens, and motion utilities.
- TanStack Query + React Hot Toast for progressive enhancement on forms, mutations, and optimistic UX.
- Proxy-based session refreshing so Supabase auth stays consistent across server components and middleware.
- Supabase CLI integration with SQL migrations, seed helpers, and type generation ready out of the box.

## Project Structure
- `app/` – App Router entry points (marketing home, sign-in flow, account dashboard) plus global layout and providers.
- `components/` – Shadcn-derived UI primitives, auth forms, account settings, and layout chrome (header/footer).
- `hooks/` – Shareable React hooks such as mobile breakpoint detection.
- `utils/` – Supabase client/server factories, auth helper actions, toast utilities, and shared helpers.
- `supabase/` – SQL migrations for the default profile schema and storage policies.
- `proxy.ts` – Next middleware entry that keeps Supabase sessions fresh on every request.

## Prerequisites
- Node.js 18.18+ (or any runtime supported by Next.js 16).
- npm (ships with Node) or your package manager of choice.
- Supabase CLI (`npm install -g supabase`) if you want to run the database locally.
- A Supabase project where you can grab the project URL and anon/publishable API key.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` in the project root and populate the required values (see below).
3. Optionally start a local Supabase stack:
   ```bash
   npm run supabase:start
   ```
   This spins up Postgres, authentication, storage, and applies the migrations under `supabase/migrations`.
4. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000` to explore the starter. Update `app/page.tsx` or other routes and hot reload will take over.

## Environment Variables
Create `.env.local` (ignored by git) and provide:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Auth feature toggles (the stack expects at least one of the email or password flags to be true)
ALLOW_EMAIL=true
ALLOW_PASSWORD=true
ALLOW_OAUTH=true

# Optional URL overrides for auth callbacks and metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_URL=
```

If you deploy to Vercel, set `NEXT_PUBLIC_SITE_URL` to your production domain (or rely on `NEXT_PUBLIC_VERCEL_URL`).

## Supabase Toolkit
- `npm run supabase:start` / `stop` / `status` – manage the local Supabase containers.
- `npm run supabase:reset` – rebuild the local database from migrations.
- `npm run supabase:generate-types` – regenerate TypeScript types for your public schema into `types_db.ts`.
- `npm run supabase:generate-migration` – diff local DB changes into a new SQL migration.
- `npm run supabase:generate-seed` – dump the database into `supabase/seed.sql`.
- `npm run supabase:push` / `pull` / `link` – keep your Supabase project in sync.

The starter ships with `supabase/migrations/20251027184710_user_management_starter.sql`, which creates a `profiles` table, RLS policies, avatar storage bucket, and the trigger that seeds profile rows when a user signs up.

## Authentication Workflows
- Passwordless email magic links (`/signin/email_signin`).
- Traditional email + password flow with forgot/update password routes.
- OAuth providers (Google, GitHub, etc.) gated by environment toggles.
- Middleware-backed session refresh via `proxy.ts` so server components can read user data safely.
- Account management interface that updates Supabase auth metadata and (extendable) profile records.

The auth helpers live in `utils/auth-helpers/` and expose server actions (e.g., `signInWithEmail`, `signInWithPassword`, `updateName`) and client utilities (`handleRequest`, `signInWithOAuth`).

## UI System
- Tailwind CSS v4 drives atomic styling with a custom token theme defined in `app/globals.css`.
- Shadcn UI components (stored under `components/ui/`) provide buttons, dialogs, forms, navigation, data display, and more.
- Theme variables and the `dark` variant keep light/dark theming consistent across server and client components.
- Motion and stateful components lean on Radix primitives, Embla carousel, Lucide icons, and supporting libraries already installed.

## Scripts & Tooling
- `npm run dev`/`build`/`start` – standard Next.js workflow.
- `npm run lint` – Next.js + ESLint 9 with the TanStack Query plugin configured.
- TypeScript strict mode with path aliases (`@/...`) keeps imports clean.
- React Query devtools can easily be enabled in `app/providers.tsx` if you need deeper insight during development.

## Deployment
Deploy straight to Vercel or any Node-compatible host. Ensure the environment variables above are set in the target environment, and that Supabase network access is allowed from your deployment region. The Next.js middleware (`proxy.ts`) must be registered in `middleware.ts` or exported via a custom serverless function, depending on your deployment target.

## Troubleshooting
- **Auth flags misconfigured** – if `ALLOW_EMAIL` and `ALLOW_PASSWORD` are both `false`, the app will throw on boot because at least one method must remain available.
- **Missing Supabase tables** – the starter expects a `profiles` table (created by the bundled migration). Run `npm run supabase:reset` locally or push the migration to your hosted project.
- **Session not persisting** – confirm that `proxy.ts` is registered (rename it to `middleware.ts` or import it in your custom middleware entry) and that browser cookies are allowed on your domain.
- **OAuth redirects** – configure each provider inside the Supabase dashboard with the callback URL `https://your-domain.com/auth/callback`.

## Next Steps
- Connect Supabase Storage or Functions for more advanced use cases.
- Swap in your branding inside `app/layout.tsx`, `components/header.tsx`, and `components/footer.tsx`.
- Extend the database schema and regenerate types to match your domain.
- Harden forms with extra validation or instrumentation as you move toward production.

Happy shipping!
