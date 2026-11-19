"use client"

import { Radio } from "lucide-react"

import { PostCard } from "@/components/wall/post-card"
import { usePosts } from "@/hooks/use-posts"

export function PostFeed() {
  const { posts, loading, error, realtimeStatus, realtimeError } = usePosts()

  return (
    <section className="wall-feed" aria-label="Wall posts">
      <div className="wall-feed-heading">
        <h2>Recent posts</h2>
        <p
          className={`wall-live-status ${realtimeStatus === "connected" ? "is-connected" : ""}`}
          aria-live="polite"
        >
          <Radio aria-hidden="true" className="size-3.5" />
          {realtimeStatus === "connected"
            ? "Live updates on"
            : realtimeStatus === "connecting"
              ? "Connecting to live updates..."
              : "Live updates unavailable"}
        </p>
      </div>

      {realtimeStatus === "disconnected" && (
        <p className="wall-feed-alert" role="status">
          {realtimeError ?? "Check that Realtime is enabled for public.posts and public.post_images."}
        </p>
      )}

      {error && (
        <div className="wall-feed-alert" role="alert">
          <strong>Could not load posts.</strong> {error}
        </div>
      )}

      {loading && posts.length === 0 && (
        <div className="wall-feed-placeholder" role="status">
          Loading posts...
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="wall-feed-placeholder" role="status">
          No posts yet. Be the first to write on Greg&apos;s wall.
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  )
}
