import { motion } from 'framer-motion'

/**
 * The centered "title + subtitle" block repeated at the top of every
 * standalone page (Verify, Certificate, Issue Degree, Issued Certificates,
 * Admin Login...). Extracted so spacing/typography stay identical
 * everywhere instead of being re-typed per page.
 */
export function PageHeader({ eyebrow, title, subtitle, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-10 text-center md:mb-12 ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-kredent-accent">{eyebrow}</p>
      )}
      <h1 className="font-serif text-4xl font-bold leading-tight text-kredent-navy lg:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 lg:text-lg">{subtitle}</p>}
    </motion.div>
  )
}
