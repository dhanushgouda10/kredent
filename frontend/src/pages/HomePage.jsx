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
      <section className="bg-slate-50/70 py-20 sm:py-28 relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-kredent-navy/5 px-4 py-1 text-xs font-bold tracking-[0.25em] text-kredent-accent uppercase border border-kredent-navy/10">
              BUILT FOR EVERYONE INVOLVED
            </span>
            <h2 className="heading-serif mt-2 text-3xl font-extrabold text-kredent-navy sm:text-4xl lg:text-5xl">
              One Platform, <span className="text-gradient-accent">Three Roles</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Tailored features for students, recruiters, and university administration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {audiences.map((audience, idx) => (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-kredent-accent/40 hover:shadow-[var(--shadow-card-hover)] relative"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kredent-navy via-kredent-accent to-kredent-navy opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-kredent-navy to-kredent-navy-deep text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  {audience.icon}
                </div>
                <p className="mb-1 text-xs font-bold tracking-widest text-kredent-accent uppercase">{audience.label}</p>
                <h3 className="mb-3 font-serif text-2xl font-bold text-kredent-navy group-hover:text-kredent-accent transition-colors">
                  {audience.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">{audience.description}</p>
                
                <ul className="mb-8 space-y-2.5 border-t border-slate-100 pt-6">
                  {audience.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button to={audience.action.to} variant="outline" className="mt-auto group-hover:bg-kredent-navy group-hover:text-white transition-colors">
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

