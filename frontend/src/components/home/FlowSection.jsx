import { motion } from 'framer-motion'
import { ParallaxLayer } from '../ui'

// Plain-language version of the real certificate lifecycle (see CertificateService.uploadFile /
// issueOnBlockchain on the backend)
const steps = [
  {
    title: '1. Issuance',
    subtitle: 'College Uploads Certificate',
    description: 'MVJCE uploads the signed degree certificate for the student through the secure admin portal.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    title: '2. Fingerprinting',
    subtitle: 'SHA-256 & QR Stamping',
    description: 'A unique digital fingerprint and QR code are generated and permanently stamped onto the document.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    title: '3. Ledger Minting',
    subtitle: 'Locked on Polygon',
    description: 'The certificate hash is recorded on Polygon blockchain — immutable and permanent.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: '4. Student Access',
    subtitle: 'Instant Portal View',
    description: 'The student can view, download, and share their verified certificate anytime from their portal.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 15.5c0 2.5-4 4.5-9 4.5s-9-2-9-4.5a12.083 12.083 0 012.84-4.922L12 14z" />
      </svg>
    ),
  },
  {
    title: '5. Public Audit',
    subtitle: 'Zero-Account Verification',
    description: 'An employer scans the QR or enters the certificate number to confirm validity instantly.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function FlowSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-kredent-navy via-[#072452] to-kredent-navy-deep py-20 text-white sm:py-28">
      {/* Background ambient lighting */}
      <ParallaxLayer speed={0.1} className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />
      <ParallaxLayer speed={-0.12} className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-kredent-accent/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1200px] px-5 lg:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold tracking-[0.25em] text-kredent-accent uppercase backdrop-blur-md">
            END-TO-END VERIFICATION LIFECYCLE
          </span>
          <h2 className="heading-serif mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white">
            From Issuance to Verification
          </h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Every certificate follows a transparent, tamper-proof process — requiring no separate apps or technical setup.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {/* Horizontal connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/3 hidden h-0.5 bg-gradient-to-r from-transparent via-kredent-accent/40 to-transparent lg:block" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-md transition-all duration-300 hover:border-kredent-accent/40 hover:bg-white/[0.12] hover:shadow-[0_12px_32px_rgba(247,148,29,0.15)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
                <span className="font-mono text-xs font-bold tracking-widest text-slate-400 group-hover:text-kredent-accent">
                  STEP 0{idx + 1}
                </span>
              </div>

              <h3 className="mb-1 text-base font-bold text-white group-hover:text-kredent-accent transition-colors">
                {step.title}
              </h3>
              <p className="mb-2 text-xs font-semibold text-kredent-accent/90">{step.subtitle}</p>
              <p className="text-xs leading-relaxed text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

