const STATUS_MAP = {
  valid: 'success',
  active: 'success',
  verified: 'success',
  revoked: 'danger',
  invalid: 'danger',
  pending: 'warning',
  draft: 'neutral',
}

const VARIANTS = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
}

/**
 * Status pill. Pass `status="Valid" | "Revoked" | ...` to auto-pick a
 * color, or `variant` directly for full control.
 */
export function Badge({ status, variant, children, className = '' }) {
  const resolved = variant ?? STATUS_MAP[status?.toLowerCase()] ?? 'neutral'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANTS[resolved]} ${className}`}
    >
      {children ?? status}
    </span>
  )
}
