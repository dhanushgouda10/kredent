import { motion } from 'framer-motion'

// Plain-language version of the real certificate lifecycle (see CertificateService.uploadFile /
// issueOnBlockchain on the backend) — deliberately avoids exposing implementation terms like
// "smart contract" or "NFT" here. This is a trust-building explainer for a non-technical visitor
// (student, HR recruiter, parent), not a technical architecture diagram.
const steps = [
  {
    title: 'College issues the certificate',
    description: 'MVJCE uploads the signed degree certificate for the student through the admin portal.',
  },
  {
    title: 'Certificate is secured',
    description: 'A unique digital fingerprint and QR code are generated and permanently linked to the document.',
  },
  {
    title: 'Record is locked on blockchain',
    description: 'The certificate is recorded on a tamper-proof blockchain ledger that nobody can alter or delete.',
  },
  {
    title: 'Student receives access',
    description: 'The student can view, download, and share their verified certificate anytime from their portal.',
  },
  {
    title: 'Anyone can verify instantly',
    description: 'An employer scans the QR or enters the certificate number to confirm it is genuine — no login needed.',
  },
]

export function FlowSection() {
  return (
    <section className="bg-gradient-to-br from-[#0f3470] to-kredent-navy py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-kredent-accent">HOW IT WORKS</p>
          <h2 className="heading-serif text-3xl sm:text-4xl">From Issuance to Verification</h2>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            Every certificate follows the same secure path — no separate app or technical knowledge required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="relative rounded-xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm transition-colors duration-200 hover:border-white/30 hover:bg-white/10"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-kredent-accent text-sm font-bold">
                {idx + 1}
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">{step.title}</h3>
              <p className="text-xs leading-relaxed text-white/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
