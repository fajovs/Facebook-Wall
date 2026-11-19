"use client"

import { ImagePlus, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { getSupabaseClient } from "@/lib/supabase/client"

const MAX_MESSAGE_LENGTH = 280
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]

function countCharacters(value: string) {
  return Array.from(value).length
}

export function MessageComposer() {
  const [message, setMessage] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitLock = useRef(false)
  const imagePreviewRef = useRef<string | null>(null)
  const trimmedMessage = message.trim()
  const characterCount = countCharacters(message)
  const remainingCharacters = MAX_MESSAGE_LENGTH - characterCount
  const countIsNearLimit = remainingCharacters <= 30

  useEffect(() => () => {
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current)
  }, [])

  function handleChange(value: string) {
    setMessage(Array.from(value).slice(0, MAX_MESSAGE_LENGTH).join(""))
    if (error) setError(null)
  }

  function handleImageChange(file: File | undefined) {
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or GIF image.")
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Images must be 5 MB or smaller.")
      return
    }
    setError(null)
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current)
    const previewUrl = URL.createObjectURL(file)
    imagePreviewRef.current = previewUrl
    setImagePreview(previewUrl)
    setImage(file)
  }

  function clearImage() {
    if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current)
    imagePreviewRef.current = null
    setImagePreview(null)
    setImage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current) return

    const body = message.trim()
    const bodyLength = countCharacters(body)

    if (!body) {
      setError("Write a message before sharing it.")
      return
    }

    if (bodyLength > MAX_MESSAGE_LENGTH) {
      setError("Messages can be up to 280 characters.")
      return
    }

    submitLock.current = true
    setSubmitting(true)
    setError(null)

    let storagePath: string | null = null
    let createdPostId: string | null = null

    try {
      const supabase = getSupabaseClient()

      if (image) {
        const extension =
          image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1]
        storagePath = `${crypto.randomUUID()}.${extension}`
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(storagePath, image, { contentType: image.type, upsert: false })
        if (uploadError) throw uploadError
      }

      const { data: post, error: insertError } = await supabase
        .from("posts")
        .insert({ body })
        .select("id")
        .single()

      if (insertError) throw insertError
      createdPostId = post.id

      if (image && storagePath) {
        const { data: publicUrl } = supabase.storage
          .from("post-images")
          .getPublicUrl(storagePath)
        const { error: imageError } = await supabase.from("post_images").insert({
          post_id: post.id,
          image_url: publicUrl.publicUrl,
          storage_path: storagePath,
        })

        if (imageError) throw imageError
      }

      setMessage("")
      clearImage()
    } catch (submitError) {
      const supabase = getSupabaseClient()
      if (createdPostId) {
        await supabase.from("posts").delete().eq("id", createdPostId)
      }
      if (storagePath) {
        await supabase.storage.from("post-images").remove([storagePath])
      }
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your message could not be shared. Please try again.",
      )
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  return (
    <form className="wall-composer" onSubmit={handleSubmit}>
      <div className="wall-composer-heading">
        <h2>Write a post</h2>
        <p>Share a quick update on Jovaney&apos;s wall.</p>
      </div>
      <label className="sr-only" htmlFor="wall-message">
        Write a message
      </label>
      <textarea
        id="wall-message"
        className="wall-composer-input"
        value={message}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="What's on your mind?"
        rows={4}
        aria-describedby="wall-message-help"
        disabled={submitting}
      />

      {imagePreview && image && (
        <div className="wall-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt={`Preview of ${image.name}`} />
          <button
            type="button"
            className="wall-image-remove"
            onClick={clearImage}
            disabled={submitting}
            aria-label="Remove attached image"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      <div className="wall-composer-footer">
        <p
          id="wall-message-help"
          className={`wall-character-count${countIsNearLimit ? " is-near-limit" : ""}`}
          aria-live="polite"
        >
          {remainingCharacters} characters left
        </p>
        <div className="wall-composer-actions">
          <label className={`wall-attach-button${submitting ? " is-disabled" : ""}`}>
            <ImagePlus aria-hidden="true" className="size-4" />
            <span>{image ? "Change photo" : "Add photo"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={(event) => {
                handleImageChange(event.target.files?.[0])
                event.target.value = ""
              }}
              disabled={submitting}
              aria-label="Attach a photo (optional)"
            />
          </label>
          <button
            className="wall-share-button"
            type="submit"
            disabled={!trimmedMessage || submitting || characterCount > MAX_MESSAGE_LENGTH}
          >
            {submitting ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
