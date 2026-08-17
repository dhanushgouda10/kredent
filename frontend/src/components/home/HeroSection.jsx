import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroVisual from '../../assets/images/home-stats.png'
import { Button, ParallaxLayer } from '../ui'

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative background layers — pure depth cues, drift slowly on scroll via
          ParallaxLayer, never interfere with text (aria-hidden, pointer-events-none).
          Disabled automatically under prefers-reduced-motion (handled inside ParallaxLayer). */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" aria-hidden="true" />
      <ParallaxLayer speed={0.12} className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-kredent-navy/5 blur-3xl" aria-hidden="true" />
      <ParallaxLayer speed={-0.15} className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-kredent-accent/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-32">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold tracking-[0.3em] text-kredent-accent"
          >
            MVJCE DIGITAL TRUST PLATFORM
          </motion.p>

          <motion.h1
            className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-kredent-navy">Kredent —</span>{' '}
            <span className="text-kredent-accent">Blockchain-Verified</span>
            <br />
            <span className="text-gray-800">Degree Certificates</span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Every degree MVJCE issues is hashed, recorded on Polygon blockchain, and stamped with a
            QR code — so anyone can confirm it's genuine in seconds, with no account or phone call
            required.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button to="/verify" variant="primary" size="lg">
              Verify a Certificate
            </Button>
            <Button to="/login" variant="outline" size="lg">
              Student Login
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-1 text-sm text-gray-500"
          >
            College administrator?{' '}
            <Link to="/admin/login" className="font-medium text-kredent-navy underline-offset-2 hover:underline">
              Sign in here
            </Link>
          </motion.p>
        </motion.div>

        {/* Right Side - Image Card, with a subtle independent parallax drift as the page scrolls */}
        <ParallaxLayer speed={0.18} className="relative">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-card)]">
              <div className="bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-sm font-medium text-white">Blockchain Verification</span>
                </div>
              </div>

              <motion.img
                src={heroVisual}
                alt="MVJCE Blockchain Verification"
                className="h-56 w-full object-cover sm:h-64"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
              />

              <div className="bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Secure Verification</p>
                    <p className="text-xs text-gray-600">Powered by Blockchain</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kredent-accent">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge overlapping the card corner — a real, existing capability (SHA-256
                hashing), not a decorative-only element. Small continuous bob, disabled under
                reduced motion. */}
            <motion.div
              className="bg-gradient-accent shadow-fab absolute -bottom-5 -left-5 flex h-20 w-20 flex-col items-center justify-center rounded-full text-center text-white sm:h-24 sm:w-24"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1, y: [0, -6, 0] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.5, delay: 0.7 }
                  : { opacity: { duration: 0.5, delay: 0.7 }, scale: { duration: 0.5, delay: 0.7 }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 } }
              }
            >
              <svg className="mb-0.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] font-bold leading-tight sm:text-xs">SHA-256
                <br />Secured</span>
            </motion.div>
          </motion.div>
        </ParallaxLayer>
      </div>
    </section>
  )
}
