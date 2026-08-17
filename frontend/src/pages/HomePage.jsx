import { motion } from 'framer-motion'
import { HeroSection } from '../components/home/HeroSection'
import { InfoSection } from '../components/home/InfoSection'
import { FlowSection } from '../components/home/FlowSection'
import { TrustSection } from '../components/home/TrustSection'
import { Button } from '../components/ui'
import aboutImage from '../assets/images/home-about.png'

// Who the platform serves, and what each of them can actually do in it — no invented numbers,
// just the real capabilities already built (see App.jsx routes / respective pages).
const audiences = [
  {
    label: 'Students',
    title: 'Access your verified credentials anytime',
    description:
      'View every certificate issued to you, check its blockchain status, and download an official copy whenever you need it — for job applications, higher education, or your own records.',
    points: ['See all certificates issued to you', 'Check verification & blockchain status', 'Download your certificate PDF'],
    action: { label: 'Student Login', to: '/login' },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 15.5c0 2.5-4 4.5-9 4.5s-9-2-9-4.5a12.083 12.083 0 012.84-4.922L12 14z" />
      </svg>
    ),
  },
  {
    label: 'Employers & Recruiters',
    title: 'Confirm a degree in seconds — no account needed',
    description:
      'Enter a certificate number or scan the QR code on the document to see whether it was genuinely issued by MVJCE, whether it has been revoked, and whether the PDF you were sent matches the original.',
    points: ['Instant validity check, no sign-up', 'Clear valid / revoked status', 'Detects tampered or altered PDFs'],
    action: { label: 'Verify a Certificate', to: '/verify' },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'College Administration',
    title: 'Issue and manage credentials with full oversight',
    description:
      'Upload a signed certificate and Kredent handles the rest — securing it, generating its verification QR, and recording it permanently. Every action is logged for institutional audit.',
    points: ['Streamlined certificate issuance', 'Revoke certificates when required', 'Complete audit trail of all activity'],
    action: { label: 'Admin Sign In', to: '/admin/login' },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 15.5c0 2.5-4 4.5-9 4.5s-9-2-9-4.5a12.083 12.083 0 012.84-4.922L12 14zM12 14v7" />
      </svg>
    ),
  },
]

export function HomePage() {
  return (
    <>
      <HeroSection />

      <InfoSection
        title="Why Kredent Exists"
        description="Paper degree certificates are easy to forge and slow to verify — employers routinely spend days confirming a candidate's qualifications through phone calls and physical document checks. Kredent gives MVJ College of Engineering a faster, tamper-proof way to issue degrees: every certificate is digitally secured and permanently recorded, so anyone can confirm its authenticity in seconds, without ever having to contact the college directly."
        image={aboutImage}
      />

      {/* Who It's For */}
      <section className="bg-[#f4f6fb] py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-kredent-accent">BUILT FOR EVERYONE INVOLVED</p>
            <h2 className="heading-serif text-3xl text-kredent-navy sm:text-4xl">One Platform, Three Roles</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {audiences.map((audience, idx) => (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-kredent-navy/10 text-kredent-navy">
                  {audience.icon}
                </div>
                <p className="mb-1 text-xs font-semibold tracking-wider text-kredent-accent">{audience.label.toUpperCase()}</p>
                <h3 className="mb-3 font-serif text-xl font-bold text-kredent-navy">{audience.title}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600">{audience.description}</p>
                <ul className="mb-6 space-y-2">
                  {audience.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-kredent-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
                <Button to={audience.action.to} variant="outline" className="mt-auto">
                  {audience.action.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FlowSection />

      <TrustSection />
    </>
  )
}
