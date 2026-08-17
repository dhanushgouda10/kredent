import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-reveal wrapper — replaces the repeated
 * `initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}`
 * block that was hand-copied across HomePage/InfoSection/FlowSection/etc.
 * Centralizing it means every section animates identically, and reduced-
 * motion users get a plain instant appearance instead of relying on the
 * global CSS override alone — Framer Motion drives these transforms via
 * JS/WAAPI, not a CSS `transition`, so it needs its own explicit check via
 * `useReducedMotion()` to actually respect the OS setting.
 */
export function Reveal({ children, delay = 0, y = 24, duration = 0.5, className = '', as = 'div' }) {
  const prefersReducedMotion = useReducedMotion()
  const Comp = motion[as] ?? motion.div

  if (prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </Comp>
  )
}
