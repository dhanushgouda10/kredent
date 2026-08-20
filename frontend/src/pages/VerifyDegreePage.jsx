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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50/80 py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader
          eyebrow="PUBLIC DEGREE VERIFICATION"
          title="Verify Degree Authenticity"
          subtitle="Enter the certificate number to instantly audit degree validity and smart contract status on Polygon"
        />

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Left Side - Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <img src={verifyImage} alt="Blockchain Verification" className="h-72 w-full object-cover sm:h-88" />
              <div className="absolute inset-0 bg-gradient-to-t from-kredent-navy/90 via-kredent-navy/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block rounded bg-kredent-accent px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase mb-2">
                  Polygon Amoy Network
                </span>
                <h3 className="font-serif text-2xl font-bold sm:text-3xl text-white">Instant Public Ledger Verification</h3>
                <p className="mt-1 text-sm text-slate-200">Zero sign-up required. Free for recruiters, employers & graduates.</p>
              </div>
            </div>

            <Card className="p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-bold text-kredent-navy">Key Verification Features</h3>
              <div className="space-y-4">
                {[
                  { title: 'SHA-256 Fingerprint Matching', desc: 'Checks document hash against the issued ledger record.' },
                  { title: 'Direct On-Chain Inquiry', desc: 'Reads live contract state directly from Polygon network.' },
                  { title: 'PDF Alteration Detection', desc: 'Allows drag-and-drop verification of PDF document copies.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-3.5">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-accent text-white shadow-sm">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:sticky lg:top-24"
          >
            <Card className="shadow-2xl border-slate-200">
              <div className="bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6 text-white">
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Lookup Degree</h2>
                    <p className="text-xs text-slate-200">Enter certificate number or scan document QR</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                  <Input
                    label="Certificate Number"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="e.g. CERT-2026-0001"
                    required
                    hint="Found on the printed or digital certificate document"
                  />

                  {formError && <Alert variant="error">{formError}</Alert>}

                  <Button type="submit" variant="accent" size="lg" fullWidth className="shadow-lg shadow-orange-500/20">
                    Verify Degree Now
                  </Button>
                </form>

                <div className="mt-8 rounded-xl bg-slate-50 p-4 text-center border border-slate-100">
                  <p className="text-xs text-slate-500">
                    Have a PDF certificate file? <br />
                    <span className="text-slate-700 font-medium">Enter the certificate number above to test PDF integrity.</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

