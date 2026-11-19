"use client"

import { useEffect, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Post, PostImage, WallPost } from "@/lib/supabase/database.types"

export type RealtimeStatus = "connecting" | "connected" | "disconnected"

function sortAndDedupePosts(posts: WallPost[]) {
  const uniquePosts = new Map<string, WallPost>()

  for (const post of posts) {
    const existing = uniquePosts.get(post.id)
    if (!existing) {
      uniquePosts.set(post.id, post)
      continue
    }

    const images = new Map(
      [...existing.post_images, ...post.post_images].map((image) => [image.id, image]),
    )
    uniquePosts.set(post.id, {
      ...existing,
      ...post,
      post_images: [...images.values()],
    })
  }

  return [...uniquePosts.values()].sort((first, second) => {
    const firstTime = first.created_at ? Date.parse(first.created_at) : 0
    const secondTime = second.created_at ? Date.parse(second.created_at) : 0

    return secondTime - firstTime
  })
}

export function usePosts() {
  const [posts, setPosts] = useState<WallPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] =
    useState<RealtimeStatus>("connecting")
  const [realtimeError, setRealtimeError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let channel: RealtimeChannel | undefined

    async function loadPosts() {
      try {
        const supabase = getSupabaseClient()
        channel = supabase
          .channel("wall-posts")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "posts" },
            (payload) => {
              const incomingPost = payload.new as Post
              if (!incomingPost.id) return

              setPosts((currentPosts) =>
                sortAndDedupePosts([
                  ...currentPosts,
                  { ...incomingPost, post_images: [] },
                ]),
              )
            },
          )
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "post_images" },
            async (payload) => {
              const incomingImage = payload.new as PostImage
              if (!incomingImage.id || !incomingImage.post_id) return

              let postWasMissing = false
              setPosts((currentPosts) => {
                const postExists = currentPosts.some(
                  (post) => post.id === incomingImage.post_id,
                )
                if (!postExists) {
                  postWasMissing = true
                  return currentPosts
                }

                return currentPosts.map((post) =>
                  post.id === incomingImage.post_id
                    ? {
                        ...post,
                        post_images: [
                          ...new Map(
                            [...post.post_images, incomingImage].map((image) => [
                              image.id,
                              image,
                            ]),
                          ).values(),
                        ],
                      }
                    : post,
                )
              })

              if (postWasMissing) {
                const { data } = await supabase
                  .from("posts")
                  .select(
                    "id, user_id, body, created_at, post_images(id, post_id, image_url, storage_path, created_at)",
                  )
                  .eq("id", incomingImage.post_id)
                  .single()

                if (data && active) {
                  setPosts((currentPosts) =>
                    sortAndDedupePosts([...currentPosts, data]),
                  )
                }
              }
            },
          )
          .subscribe((status, subscriptionError) => {
            if (!active) return

            if (status === "SUBSCRIBED") {
              setRealtimeStatus("connected")
            } else if (
              status === "CHANNEL_ERROR" ||
              status === "TIMED_OUT" ||
              status === "CLOSED"
            ) {
              setRealtimeStatus("disconnected")
              setRealtimeError(
                subscriptionError?.message ??
                  "Check that Realtime is enabled for public.posts.",
              )
            }
          })

        const { data, error: queryError } = await supabase
          .from("posts")
          .select(
            "id, user_id, body, created_at, post_images(id, post_id, image_url, storage_path, created_at)",
          )
          .order("created_at", { ascending: false, nullsFirst: false })

        if (!active) return

        if (queryError) {
          setError(queryError.message)
        } else {
          setPosts((currentPosts) =>
            sortAndDedupePosts([...(data ?? []), ...currentPosts]),
          )
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The posts could not be loaded.",
          )
          setRealtimeStatus("disconnected")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPosts()

    return () => {
      active = false
      if (channel) void getSupabaseClient().removeChannel(channel)
    }
  }, [])

  return { posts, loading, error, realtimeStatus, realtimeError }
}
