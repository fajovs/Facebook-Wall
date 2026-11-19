import Image from "next/image"
import { UserRound } from "lucide-react"

import type { WallPost } from "@/lib/supabase/database.types"

function formatTimestamp(value: string | null) {
  if (!value) return { label: "Date unavailable", full: "Date unavailable" }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return { label: "Date unavailable", full: "Date unavailable" }
  }

  const full = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000))
  if (elapsedMinutes < 1) return { label: "now", full }
  if (elapsedMinutes < 60) return { label: `${elapsedMinutes}m`, full }

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return { label: `${elapsedHours}h`, full }

  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays < 7) return { label: `${elapsedDays}d`, full }

  return { label: full, full }
}

export function PostCard({ post }: { post: WallPost }) {
  const timestamp = formatTimestamp(post.created_at)

  return (
    <article className="wall-post">
      <div className="wall-post-heading">
        <div className="wall-post-person">
          <span className="wall-post-avatar" aria-hidden="true">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="wall-post-author">Greg Wientjes</p>
            <time
              className="wall-post-time"
              dateTime={post.created_at ?? undefined}
              title={timestamp.full}
            >
              {timestamp.label}
            </time>
          </div>
        </div>
      </div>
      <p className="wall-post-body">
        {post.body?.trim() || "This post has no message text."}
      </p>
      {post.post_images.length > 0 && (
        <div className="wall-post-images">
          {post.post_images.map((image) => (
            <Image
              key={image.id}
              src={image.image_url}
              alt="Photo shared on Greg's wall"
              width={1200}
              height={900}
              unoptimized
              className="wall-post-image"
            />
          ))}
        </div>
      )}
    </article>
  )
}
