import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Badge, Card, EmptyState, PageHeader, SkeletonStatCard, StatCard } from '../../components/ui'
import { getMyCertificates } from '../../services/certificateService'
import { getOwnProfile } from '../../services/studentService'

// Mirrors IssuedCertificatesPage's STATUS_META (admin side) — kept as a local copy rather than a
// shared export so this Phase 4 addition doesn't touch the existing admin page at all.
const STATUS_META = {
  PENDING_MINT: { label: 'Pending Mint', variant: 'warning' },
  MINTED: { label: 'Minted', variant: 'success' },
  MINT_FAILED: { label: 'Mint Failed', variant: 'danger' },
  REVOKED: { label: 'Revoked', variant: 'danger' },
}

function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, variant: 'neutral' }
}

export function StudentDashboardPage() {
  const [profile, setProfile] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getOwnProfile(), getMyCertificates({ size: 100 })])
      .then(([profileData, certPage]) => {
        setProfile(profileData)
        setCertificates(certPage.content ?? [])
        setError('')
      })
      .catch((err) => setError(err.message || 'Could not load your dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const totalCount = certificates.length
  const mintedCount = certificates.filter((c) => c.status === 'MINTED').length
  const revokedCount = certificates.filter((c) => c.status === 'REVOKED').length
  const recentCertificates = [...certificates]
    .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
    .slice(0, 5)

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader
          eyebrow="STUDENT DASHBOARD"
          title={`Welcome, ${profile?.fullName ?? '...'}`}
          subtitle={
            profile
              ? `USN: ${profile.usn ?? '—'}  ·  Department: ${profile.department ?? '—'}`
              : undefined
          }
        />

        {error && (
          <Alert variant="error" title="Could not load dashboard" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Certificates"
                value={totalCount}
                iconBgClassName="bg-blue-100 text-blue-600"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Minted"
                value={mintedCount}
                valueClassName="text-green-600"
                iconBgClassName="bg-green-100 text-green-600"
                delay={0.05}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Revoked"
                value={revokedCount}
                valueClassName="text-red-600"
                iconBgClassName="bg-red-100 text-red-600"
                delay={0.1}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 105.636 5.636a9 9 0 0012.728 12.728zM9.5 9.5l5 5m0-5l-5 5" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        <Card>
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-kredent-navy">Recent Certificates</h2>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : recentCertificates.length === 0 ? (
            <EmptyState
              title="No certificates yet"
              description="Certificates issued to you by the college will appear here."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {recentCertificates.map((cert) => (
                <div key={cert.id} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cert.degreeName}</p>
                    <p className="text-sm text-gray-500">
                      {cert.department} · Year: {cert.yearOfCompletion}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusMeta(cert.status).variant}>{statusMeta(cert.status).label}</Badge>
                    <Link
                      to={`/student/certificates/${cert.id}`}
                      className="text-sm font-semibold text-kredent-accent hover:text-orange-700"
                    >
                      View Certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
