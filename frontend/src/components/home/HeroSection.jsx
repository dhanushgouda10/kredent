import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroVisual from '../../assets/images/home-stats.png'
import { Button, ParallaxLayer } from '../ui'

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-gray-50/60 pt-6 pb-16 sm:py-20 lg:py-28">
      {/* Decorative background parallax layers — slow drift, non-interactive */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" aria-hidden="true" />
      
      <ParallaxLayer speed={0.08} className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-kredent-navy/10 blur-3xl" aria-hidden="true" />
      <ParallaxLayer speed={-0.12} className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-kredent-accent/15 blur-3xl" aria-hidden="true" />
      <ParallaxLayer speed={0.18} className="pointer-events-none absolute left-1/3 bottom-10 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* Left Side - Hero Text Content (Minimal movement for clarity) */}
        <ParallaxLayer speed={0.04}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Pill Chip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-kredent-navy/15 bg-kredent-navy/5 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-kredent-accent animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-kredent-navy uppercase">
                MVJCE Official Digital Trust Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-serif text-4xl font-extrabold tracking-tight text-kredent-navy sm:text-5xl lg:text-6xl lg:leading-[1.12]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Kredent — <br className="hidden sm:inline" />
              <span className="text-gradient-accent">Blockchain-Verified</span> <br />
              <span className="text-slate-800">Degree Certificates</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Every degree MVJCE issues is hashed, recorded on the Polygon blockchain, and stamped with a
              tamper-proof QR code — enabling instant, 100% reliable verification without phone calls or wait times.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Button to="/verify" variant="accent" size="lg" className="shadow-lg shadow-orange-500/20">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify a Certificate
              </Button>
              <Button to="/login" variant="outline" size="lg">
                Student Login
              </Button>
            </motion.div>

            {/* Admin sign-in link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-2 pt-1 text-sm text-slate-500"
            >
              <svg className="h-4 w-4 text-kredent-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              College Administrator?{' '}
              <Link to="/admin/login" className="font-semibold text-kredent-navy underline decoration-kredent-accent decoration-2 underline-offset-4 hover:text-kredent-accent transition-colors">
                Sign in to Admin Portal
              </Link>
            </motion.p>
          </motion.div>
        </ParallaxLayer>

        {/* Right Side - Hero Card with Medium Parallax */}
        <ParallaxLayer speed={0.16} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(6,43,99,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(6,43,99,0.18)]">
              {/* Window Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-kredent-navy to-kredent-navy-deep px-5 py-3.5">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/90" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/90" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/90" />
                  <span className="ml-2 font-mono text-xs text-slate-200">Polygon Amoy Network</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Verified
                </div>
              </div>

              {/* Main Visual */}
              <div className="relative overflow-hidden bg-slate-900">
                <motion.img
                  src={heroVisual}
                  alt="MVJCE Blockchain Verification"
                  className="h-60 w-full object-cover sm:h-72 transition-transform duration-700 ease-out"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-300 uppercase">MVJCE Degree Certificate</p>
                    <p className="font-mono text-xs text-amber-300">CERT-2026-MVJCE-001</p>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                    MINTED
                  </span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="bg-slate-50/80 p-5 backdrop-blur-sm border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">Tamper-Proof Verification</p>
                    <p className="text-xs text-slate-500">SHA-256 Fingerprint + Polygon Ledger</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-accent shadow-md text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating SHA-256 Badge - Subtle Faster Parallax Layer */}
            <ParallaxLayer speed={-0.1} className="absolute -bottom-6 -left-6 z-20">
              <motion.div
                className="bg-gradient-accent shadow-fab flex h-22 w-22 flex-col items-center justify-center rounded-2xl border-2 border-white/40 text-center text-white sm:h-26 sm:w-26"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, y: [0, -8, 0] }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.5, delay: 0.6 }
                    : {
                        opacity: { duration: 0.5, delay: 0.6 },
                        scale: { duration: 0.5, delay: 0.6 },
                        y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                      }
                }
              >
                <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] font-extrabold uppercase leading-tight sm:text-xs">
                  SHA-256<br />Secured
                </span>
              </motion.div>
            </ParallaxLayer>

            {/* Floating Top Right Tag */}
            <ParallaxLayer speed={-0.08} className="absolute -top-4 -right-4 z-20 hidden sm:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg border border-slate-200/80 backdrop-blur-md"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-kredent-navy text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Instant Lookup</p>
                  <p className="text-[10px] text-slate-500">QR Scan or Cert No.</p>
                </div>
              </motion.div>
            </ParallaxLayer>
          </motion.div>
        </ParallaxLayer>
      </div>
    </section>
  )
}
