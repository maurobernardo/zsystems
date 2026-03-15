'use client'

/** Pill-shaped transparent card for section title - used only on Sobre Nós and Projectos */
export default function SectionTitlePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-6 py-2.5 mb-4">
      <span className="text-secondary-light text-sm font-semibold uppercase tracking-wide">
        {children}
      </span>
    </div>
  )
}
