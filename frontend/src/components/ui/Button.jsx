import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-kredent-navy text-white shadow-sm hover:bg-kredent-navy-dark hover:shadow-lg disabled:bg-gray-400',
  accent:
    'bg-gradient-accent text-white shadow-sm hover:shadow-lg disabled:bg-gray-400 disabled:bg-none',
  outline:
    'border-2 border-kredent-navy text-kredent-navy hover:bg-kredent-navy hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent',
  ghost: 'text-kredent-navy hover:bg-kredent-navy/10 disabled:text-gray-400',
  danger:
    'border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white disabled:border-gray-300 disabled:text-gray-400',
  pill: 'bg-gradient-accent text-white shadow-lg rounded-full disabled:bg-gray-400 disabled:bg-none',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
}

/**
 * Shared button primitive. Renders a <button>, or a react-router <Link> when
 * `to` is provided. Keeps the same visual language (navy/orange, rounded-lg)
 * used throughout the app, just centralized so every page doesn't hand-roll
 * its own hover/disabled/loading classes.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  to,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading
  const shape = variant === 'pill' ? 'rounded-full' : 'rounded-lg'

  const classes = [
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
    'disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0',
    shape,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
          aria-hidden="true"
        />
      ) : (
        icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  )

  const motionProps = isDisabled
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.15 },
      }

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={classes} aria-disabled={isDisabled}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      className={classes}
      {...motionProps}
      {...rest}
    >
      {content}
    </motion.button>
  )
}
