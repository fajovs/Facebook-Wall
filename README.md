# Facebook Wall

A responsive, 2008-inspired wall built with Next.js, Tailwind CSS, and Supabase. The app has no user login or session flow.

## Run locally

Make sure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then run:

```bash
npm install
npm run dev
```

The home page reads and publishes messages in the existing `public.posts` table. Supabase Realtime must include `public.posts` in the `supabase_realtime` publication for live inserts to appear without refreshing.

The profile image is a placeholder for now. Add your image under `public` when it is ready.
