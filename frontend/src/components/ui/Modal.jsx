import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Generic modal shell: backdrop click-to-close, Escape-to-close, and a
 * fade/scale transition on both open and close. Controlled entirely by the
 * `open` prop so callers keep their existing state (e.g. `open={!!selected}`)
 * instead of conditionally mounting/unmounting the component themselves.
 */
export function Modal({ open, onClose, title, children, size = 'lg' }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const maxWidth = size === 'md' ? 'max-w-lg' : size === 'sm' ? 'max-w-md' : 'max-w-2xl'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6 text-white">
                <h3 className="text-xl font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
