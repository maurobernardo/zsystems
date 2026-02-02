'use client'

import Image from 'next/image'

type LogoProps = {
  size?: number
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
  alt?: string
}

export default function Logo({
  size = 48,
  fill = false,
  sizes,
  className,
  priority = false,
  alt = 'Z-Systems logo',
}: LogoProps) {
  if (fill) {
    return (
      <Image
        src="/images/logo.png"
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    )
  }

  return (
    <Image
      src="/images/logo.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  )
}


