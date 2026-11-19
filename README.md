# Facebook Wall

Next.js app configured with TypeScript, Tailwind CSS, Supabase SSR, and shadcn/ui.

## Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set your Supabase project URL and publishable key.
3. Start the development server with `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) to view the app.

Supabase clients are available from `@/lib/supabase/client` in browser code and `@/lib/supabase/server` in server code. The root `proxy.ts` refreshes Supabase auth cookies for Next.js 16.

Use the shadcn CLI to add UI components, for example `npx shadcn@latest add card`.
