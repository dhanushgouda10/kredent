import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Wraps a child in a subtle vertical parallax offset tied to its own scroll
 * progress through the viewport — performant because it's driven by Framer
 * Motion's `useScroll`/`useTransform` motion values (updated via WAAPI on
 * the compositor thread), not a manual `onScroll` listener re-rendering
 * React on every pixel.
 *
 * `speed` controls how far the layer drifts relative to normal scroll:
 *   - 0.15–0.3  → background/decorative layers (move slower, feel "behind")
 *   - negative  → foreground elements that drift the opposite direction
 * Kept intentionally small (default range ±40px) so it reads as depth, not
 * a scroll-jacking effect. Disabled entirely under prefers-reduced-motion.
 */
export function ParallaxLayer({ children, speed = 0.2, className = '', ...rest }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const range = 120 * speed
  const y = useTransform(scrollYProgress, [0, 1], [range, -range])

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </motion.div>
  )
}
