"use client"

import Image from "next/image"
import { useState } from "react"

export function ProfileAvatar() {
  const [imageSrc, setImageSrc] = useState("/profile.jpg")

  return (
    <span className="wall-post-avatar">
      <Image
        src={imageSrc}
        alt="Jovaney Agda"
        fill
        sizes="42px"
        onError={() => setImageSrc("/profile-placeholder.svg")}
      />
    </span>
  )
}
