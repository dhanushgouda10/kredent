import { Reveal, FeatureCard } from '../ui'

// Every item here maps to a real, implemented capability — no invented stats or claims.
// SHA-256: HashUtil.sha256Hex computed on the QR-stamped PDF (CertificateService.uploadFile).
// Blockchain record: SkillChainCredential contract on Polygon Amoy, read back independently by
// PublicVerificationService.verify() rather than trusting the database alone.
// QR verification: QrCodeUtil + PdfStampingService stamp a link to /verify/:certificateNumber.
// No account required: /api/verify/** is fully public per SecurityConfig.
// Revocation: AdminCertificateController.revokeOnBlockchain, reflected instantly in verify().
// Secure storage: Supabase Storage, service-role key never sent to the frontend.
const items = [
  {
    title: 'SHA-256 document hashing',
    description:
      "Every certificate PDF is fingerprinted after its QR code is stamped on. Change a single byte — even re-saving the file — and the fingerprint no longer matches.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Independent blockchain record',
    description:
      'Issuance and revocation are recorded on Polygon. Verification reads the live contract directly — it never just trusts what the database says.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'QR-linked verification',
    description:
      "Every issued certificate carries a QR code stamped directly onto the document, linking to its public verification page — no separate app or lookup needed.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 4.5h4.5v4.5h-4.5v-4.5zm0 10.5h4.5v4.5h-4.5v-4.5zm10.5-10.5h4.5v4.5h-4.5v-4.5zm.75 6.75h.008v.008h-.008v-.008zm3 0h.008v.008h-.008v-.008zm-3 3h.008v.008h-.008v-.008zm3 0h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'No account needed to verify',
    description:
      'Anyone with a certificate number or QR code can check its authenticity instantly — no sign-up, no login, no waiting on the college.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: 'Instant revocation',
    description:
      'If a certificate ever needs to be revoked, the change is reflected on-chain and shows up immediately for anyone verifying it afterward.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM7 17L17 7" />
      </svg>
    ),
  },
  {
    title: 'Secure document storage',
    description:
      "Original certificate files are stored in access-controlled cloud storage — never exposed directly, and never accessible without going through the platform.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 6.75h16.5M3.75 6.75a2.25 2.25 0 012.25-2.25h12a2.25 2.25 0 012.25 2.25M3.75 6.75v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V6.75" />
      </svg>
    ),
  },
]

export function TrustSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-kredent-accent">TRUST &amp; SECURITY</p>
            <h2 className="heading-serif text-3xl text-kredent-navy sm:text-4xl">Why You Can Trust a Kredent Certificate</h2>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              Every safeguard below is already built into the platform — not marketing language.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} delay={idx * 0.06} />
          ))}
        </div>
      </div>
    </section>
  )
}
