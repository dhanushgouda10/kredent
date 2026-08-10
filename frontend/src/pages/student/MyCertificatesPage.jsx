import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Badge, Card, EmptyState, PageHeader, SkeletonRow } from '../../components/ui'
import { downloadCertificateFile, getMyCertificates } from '../../services/certificateService'

const STATUS_META = {
  PENDING_MINT: { label: 'Pending Mint', variant: 'warning' },
  MINTED: { label: 'Minted', variant: 'success' },
  MINT_FAILED: { label: 'Mint Failed', variant: 'danger' },
  REVOKED: { label: 'Revoked', variant: 'danger' },
}

function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, variant: 'neutral' }
}

export function MyCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    getMyCertificates({ size: 100 })
      .then((page) => {
        setCertificates(page.content ?? [])
        setLoadError('')
      })
      .catch((err) => setLoadError(err.message || 'Could not load your certificates'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (cert) => {
    setActionError('')
    setDownloadingId(cert.id)
    try {
      await downloadCertificateFile(cert.id, `${cert.certificateNumber}.pdf`)
    } catch (err) {
      setActionError(err.message || 'Failed to download certificate')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="My Certificates" subtitle="Certificates issued to you by MVJCE" />

        {loadError && (
          <Alert variant="error" title="Could not load certificates" className="mb-6">
            {loadError}
          </Alert>
        )}
        {actionError && (
          <Alert variant="error" title="Action failed" className="mb-6">
            {actionError}
          </Alert>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Certificate</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Department</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Year</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Issued</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Minted</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Token ID</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={8} />)
                ) : certificates.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title="No certificates yet"
                        description="Once the college issues you a certificate, it will show up here."
                      />
                    </td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{cert.degreeName}</p>
                        <code className="text-xs text-gray-500">{cert.certificateNumber}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.yearOfCompletion}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusMeta(cert.status).variant}>{statusMeta(cert.status).label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.issuedAt?.slice(0, 10) ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.mintedAt?.slice(0, 10) ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cert.tokenId ?? '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/student/certificates/${cert.id}`}
                            className="rounded text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                          >
                            View
                          </Link>
                          {cert.fileAvailable && (
                            <button
                              onClick={() => handleDownload(cert)}
                              disabled={downloadingId === cert.id}
                              className="rounded text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 disabled:opacity-50"
                            >
                              {downloadingId === cert.id ? 'Downloading…' : 'Download'}
                            </button>
                          )}
                          <Link
                            to={`/student/certificates/${cert.id}`}
                            className="rounded text-sm font-medium text-kredent-accent transition-colors hover:text-orange-700"
                          >
                            Blockchain Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
