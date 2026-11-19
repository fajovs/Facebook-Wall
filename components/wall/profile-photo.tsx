"use client"

import Image from "next/image"
import { useState } from "react"

export function ProfilePhoto() {
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <div
      className="wall-profile-placeholder"
      role="img"
      aria-label={hasPhoto ? "Jovaney Agda's profile photo" : "Profile photo placeholder"}
    >
      {hasPhoto ? (
        <Image
          src="/profile.jpg"
          alt="Jovaney Agda"
          fill
          priority
          sizes="(max-width: 720px) 100px, 24vw"
          onError={() => setHasPhoto(false)}
        />
      ) : (
        <Image
          src="/profile-placeholder.svg"
          alt="Add your photo as public/profile.jpg"
          fill
          priority
          sizes="(max-width: 720px) 100px, 24vw"
        />
      )}
    </div>
  )
}
