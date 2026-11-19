# Facebook Wall

A responsive, Facebook-inspired wall built with Next.js, React, Tailwind CSS, and Supabase. Visitors can publish short posts, optionally attach a photo, and see new posts appear through Supabase Realtime. The app has no login, user authentication, or sessions.

## Features

- Create posts up to 280 characters.
- Attach an optional JPG, PNG, or GIF photo up to 5 MB.
- Browse posts in newest-first order.
- Receive new posts and photo attachments through Supabase Realtime.
- View a responsive profile page for Jovaney Agda.
- Use a profile image from the `public` folder.

## Requirements

- Node.js supported by the installed Next.js version.
- An existing Supabase project configured with the required tables and Storage bucket.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root with your Supabase project URL and publishable key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

   Use the URL and key from the same Supabase project. Keep `.env.local` private; never add a service-role key to client-side environment variables.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

This project uses the existing database schema; it does not create or migrate tables. Configure Supabase with:

- `public.posts` for post text and timestamps.
- `public.post_images` for photo URLs and Storage paths, linked to posts with `post_id`.
- A public Storage bucket named `post-images` with policies that allow the app's intended uploads and reads.
- Both `public.posts` and `public.post_images` enabled in the `supabase_realtime` publication.

The anonymous browser client needs the appropriate database permissions to read and create posts and photo records. Realtime only works when the tables are published in the same Supabase project referenced by `.env.local`.

## Profile photo

Place your photo at:

```text
public/profile.jpg
```

The app displays `public/profile-placeholder.svg` until `profile.jpg` is available. The same photo is used for the profile area and post avatars. Restart the development server if you add the image while it is running.

## Project scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

There is currently no automated test script configured.

## Deployment

Deploy the existing project with Vercel. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Vercel project's environment variables, then build and deploy. Confirm that the production Supabase project has the same tables, Storage bucket, permissions, and Realtime publication configured.

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4 and shadcn/ui setup
- Supabase JavaScript client for database, Storage, and Realtime
