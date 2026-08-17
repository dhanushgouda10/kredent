import { Reveal } from './Reveal'

/**
 * Icon + title + description card used for landing-page "how it works" /
 * "why trust this" style grids. Deliberately minimal — the visual weight
 * comes from consistent spacing and the shared shadow token, not per-card
 * one-off styling.
 */
export function FeatureCard({ icon, title, description, delay = 0, className = '' }) {
  return (
    <Reveal delay={delay} y={16}>
      <div
        className={`h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] ${className}`}
      >
        {icon && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-kredent-navy/10 text-kredent-navy">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-base font-semibold text-kredent-navy">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </Reveal>
  )
}
