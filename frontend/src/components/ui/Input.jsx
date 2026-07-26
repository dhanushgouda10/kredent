const BASE =
  'w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400'

const STATE = {
  default: 'border-gray-300 focus:border-kredent-navy focus:ring-kredent-navy/25',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-500/25',
}

export function Label({ children, required, htmlFor, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-sm font-semibold text-gray-700 ${className}`}>
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {children}
    </p>
  )
}

/**
 * Text input with a consistent label / error / focus treatment. Passes
 * through any native <input> prop, so existing usages (name, value,
 * onChange, required, type, placeholder...) keep working unchanged.
 */
export function Input({ label, id, required, error, hint, className = '', containerClassName = '', ...rest }) {
  const inputId = id ?? rest.name

  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`${BASE} ${error ? STATE.error : STATE.default} ${className}`}
        {...rest}
      />
      {error && <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

export function Select({ label, id, required, error, hint, className = '', containerClassName = '', children, ...rest }) {
  const selectId = id ?? rest.name

  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}
      <select
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        className={`${BASE} ${error ? STATE.error : STATE.default} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
