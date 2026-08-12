import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import verifyImage from '../assets/images/verify-layout.png'
import { Alert, Button, Card, Input, PageHeader } from '../components/ui'

export function VerifyDegreePage() {
  const [certificateNumber, setCertificateNumber] = useState('')
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const trimmed = certificateNumber.trim()
    if (!trimmed) {
      setFormError('Enter a certificate number to verify.')
      return
    }
    setFormError('')
    navigate(`/verify/${encodeURIComponent(trimmed)}`)
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:py-16 lg:px-10">
        <PageHeader
          title="Verify Degree"
          subtitle="Enter the certificate number to verify the authenticity of the degree on the blockchain"
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
                  'Instant, tamper-proof verification',
                  'Confirms the certificate was genuinely issued by MVJCE',
                  'No login or account required',
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
              <div className="bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Certificate Verification</h2>
                    <p className="text-sm text-white/80">Enter the certificate number to check its status</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <Input
                    label="Certificate Number"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="e.g. CERT-2026-0001"
                    required
                  />

                  {formError && <Alert variant="error">{formError}</Alert>}

                  <Button type="submit" variant="primary" fullWidth>
                    Verify Certificate
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
