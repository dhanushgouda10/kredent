import { motion } from 'framer-motion'
import { Badge, Button, PageHeader } from '../components/ui'

export function CertificatePage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Certificate View" subtitle="Official MVJCE degree certificate verified on blockchain" />

        {/* Certificate Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-3xl border-4 border-[#e4ebf7] bg-white shadow-2xl sm:border-8">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6 text-center sm:p-8">
              <div className="mb-4 flex items-center justify-center">
                <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
              </div>
              <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-white/90 sm:text-sm">
                MVJ COLLEGE OF ENGINEERING
              </p>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Degree Certificate</h2>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-kredent-accent" />
                <div className="h-2 w-2 rounded-full bg-kredent-accent" />
                <div className="h-2 w-2 rounded-full bg-kredent-accent" />
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="space-y-5 text-center sm:space-y-6">
                <p className="text-base text-gray-600 sm:text-lg">This certifies that</p>

                <motion.h3
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="font-serif text-3xl font-bold text-kredent-navy sm:text-4xl lg:text-5xl"
                >
                  Aarav Rao
                </motion.h3>

                <p className="text-base text-gray-600 sm:text-lg">has successfully completed</p>

                <div className="rounded-xl border border-kredent-navy/20 bg-gradient-to-r from-kredent-navy/10 to-kredent-accent/10 p-6">
                  <p className="text-lg font-bold text-kredent-navy sm:text-xl">B.E. Computer Science and Engineering</p>
                  <p className="mt-2 text-base font-semibold text-kredent-accent sm:text-lg">Class of 2025</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h4 className="mb-4 font-semibold text-kredent-navy">Student Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">USN:</span>
                      <span className="font-semibold text-gray-900">1MJ21CS001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-semibold text-gray-900">Computer Science</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year of Completion:</span>
                      <span className="font-semibold text-gray-900">2025</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <h4 className="mb-4 font-semibold text-kredent-navy">Blockchain Verification</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issuer:</span>
                      <span className="font-semibold text-gray-900">MVJCE</span>
                    </div>
                    <div>
                      <span className="mb-1 block text-gray-600">Transaction Hash:</span>
                      <span className="block break-all rounded border border-gray-300 bg-white p-2 font-mono text-xs text-gray-700">
                        0x5cf9af434b0db73a76380383adca102f95a194d01
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge status="Valid" />
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:mt-12 lg:flex-row">
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-kredent-accent sm:h-16 sm:w-16">
                    <svg className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-kredent-navy">Blockchain Verified</p>
                    <p className="text-sm text-gray-600">Immutable certificate record</p>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-dashed border-kredent-navy/50 bg-white p-6 text-center">
                  <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">QR Code</p>
                  <p className="text-xs text-gray-500">Scan to verify</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12">
                <Button
                  variant="primary"
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Download Certificate
                </Button>

                <Button
                  to="/verify"
                  variant="outline"
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  Verify Another
                </Button>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="border-t border-gray-200 bg-gradient-to-r from-kredent-navy/5 to-kredent-accent/5 p-6">
              <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kredent-navy">
                    <span className="text-sm font-bold text-white">MVJ</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">MVJCE</p>
                    <p className="text-xs text-gray-600">Blockchain Verification System</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Certificate ID: CERT-2025-001</p>
                  <p className="text-xs text-gray-500">Issued: March 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
