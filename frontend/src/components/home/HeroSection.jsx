import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroVisual from '../../assets/images/home-stats.png'
import { Button } from '../ui'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />

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
            <span className="text-kredent-navy">Kredent</span>
            <br />
            <span className="text-kredent-accent">Blockchain-Based</span>
            <br />
            <span className="text-gray-800">Degree Verification System</span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Secure, tamper-proof digital degrees issued by MVJCE using blockchain technology.
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

        {/* Right Side - Image Card */}
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
        </motion.div>
      </div>
    </section>
  )
}
