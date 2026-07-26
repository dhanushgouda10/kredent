import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import verifyImage from '../assets/images/verify-layout.png'
import { Badge, Button, Card, CardHeader, Input, PageHeader, SkeletonLines } from '../components/ui'

export function VerifyDegreePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setShowResult(false)
    setTimeout(() => {
      setLoading(false)
      setShowResult(true)
    }, 1500)
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:py-16 lg:px-10">
        <PageHeader
          title="Verify Degree"
          subtitle="Enter the wallet address or certificate ID to verify the authenticity of the degree on the blockchain"
        />

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Side - Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <img src={verifyImage} alt="Blockchain Verification" className="h-72 w-full object-cover sm:h-96" />
              <div className="absolute inset-0 bg-gradient-to-t from-kredent-navy/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-serif text-xl font-bold sm:text-2xl">Secure Verification</h3>
                <p className="mt-1 text-sm text-white/90 sm:text-base">Powered by MVJCE Blockchain Technology</p>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-kredent-navy">Verification Features</h3>
              <div className="space-y-3">
                {[
                  'Instant verification on blockchain',
                  'Tamper-proof certificate records',
                  'QR code verification support',
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-kredent-accent">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:sticky lg:top-24"
          >
            <Card>
              <CardHeader
                title="Blockchain Verification"
                subtitle="Enter certificate details"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <Input
                    label="Wallet Address or Certificate ID"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
                    required
                  />

                  <Button type="submit" variant="primary" fullWidth loading={loading}>
                    {loading ? 'Verifying…' : 'Verify on Blockchain'}
                  </Button>
                </form>

                {/* Loading State */}
                {loading && <SkeletonLines lines={3} className="mt-6" />}

                {/* Result Card */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-6"
                    >
                      <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-semibold text-green-800">Verification Result</h3>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Student Name:</span>
                            <span className="font-semibold text-gray-900">Aarav Rao</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">USN:</span>
                            <span className="font-semibold text-gray-900">1MJ21CS001</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Department:</span>
                            <span className="font-semibold text-gray-900">Computer Science</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Degree:</span>
                            <span className="font-semibold text-gray-900">B.E. Computer Science</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year:</span>
                            <span className="font-semibold text-gray-900">2025</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Issuer:</span>
                            <span className="font-semibold text-gray-900">MVJCE</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge status="Valid" />
                          </div>
                          <div className="border-t border-green-200 pt-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-gray-600">QR Code:</span>
                              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div>
                              <span className="mb-1 block text-gray-600">Transaction Hash:</span>
                              <span className="block break-all rounded bg-gray-100 p-2 font-mono text-xs text-gray-700">
                                0x5cf9af434b0db73a76380383adca102f95a194d01
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
