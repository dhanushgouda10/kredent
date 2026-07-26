/**
 * Base card shell used across the app. Replaces the many hand-copied
 * "bg-white rounded-2xl shadow-xl border border-gray-100" blocks with one
 * consistent component (same radius, shadow and hover behavior everywhere).
 */
export function Card({ children, className = '', hover = false, as: Comp = 'div', ...rest }) {
  return (
    <Comp
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[var(--shadow-card)] ${
        hover ? 'transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** The repeated navy gradient header bar (icon + title + subtitle) used on most form/table cards. */
export function CardHeader({ icon, title, subtitle, action, className = '' }) {
  return (
    <div className={`bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 md:p-8 ${className}`}>{children}</div>
}
