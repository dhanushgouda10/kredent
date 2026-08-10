import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Badge, Button, Card, CardHeader, PageHeader, SkeletonLines } from '../../components/ui'
import { downloadCertificateFile, getCertificateById } from '../../services/certificateService'
import { BLOCK_EXPLORER_URL, NETWORK_NAME } from '../../contracts/skillChainConfig'

const STATUS_META = {
  PENDING_MINT: { label: 'Pending Mint', variant: 'warning' },
  MINTED: { label: 'Minted', variant: 'success' },
  MINT_FAILED: { label: 'Mint Failed', variant: 'danger' },
  REVOKED: { label: 'Revoked', variant: 'danger' },
}

function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, variant: 'neutral' }
}

/** Small copy-to-clipboard icon button used next to each blockchain field. */
function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null

  const handleCopy = () => {
    navigator.clipboard?.writeText(String(value))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className="ml-2 flex-shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
    >
      {copied ? (
        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  )
}

/** One label/value row in the blockchain info section, with a copy button when a value is present. */
function BlockchainRow({ label, value, mono = true, copyable = true }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="flex-shrink-0 text-sm text-gray-600">{label}</span>
      <span
        className={`flex items-center justify-end text-right text-gray-900 ${
          mono ? 'break-all font-mono text-xs' : 'text-sm font-semibold'
        }`}
      >
        {value ?? '—'}
        {copyable && <CopyButton value={value} label={label} />}
      </span>
    </div>
  )
}

export function StudentCertificateDetailPage() {
  const { id } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    getCertificateById(id)
      .then((data) => {
        setCert(data)
        setLoadError('')
      })
      .catch((err) => setLoadError(err.message || 'Could not load this certificate'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    if (!cert) return
    setDownloadError('')
    setDownloading(true)
    try {
      await downloadCertificateFile(cert.id, `${cert.certificateNumber}.pdf`)
    } catch (err) {
      setDownloadError(err.message || 'Failed to download certificate')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-4xl px-5 lg:px-10">
        <PageHeader title="Certificate Details" subtitle="Your certificate information and blockchain verification status" />

        {loadError && (
          <Alert variant="error" title="Could not load certificate" className="mb-6">
            {loadError}
          </Alert>
        )}

        {loading ? (
          <Card className="p-8">
            <SkeletonLines lines={6} />
          </Card>
        ) : cert ? (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Certificate Information" />
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Certificate Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">{cert.certificateNumber}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Status</p>
                  <Badge variant={statusMeta(cert.status).variant}>{statusMeta(cert.status).label}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-semibold text-gray-900">{cert.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">USN</p>
                  <p className="font-mono text-sm text-gray-900">{cert.studentUsn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="font-semibold text-gray-900">{cert.degreeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{cert.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Completion</p>
                  <p className="font-semibold text-gray-900">{cert.yearOfCompletion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold text-gray-900">{cert.issuedAt?.slice(0, 10) ?? '—'}</p>
                </div>
                {cert.originalFilename && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600">Original Filename</p>
                    <p className="text-sm text-gray-900">{cert.originalFilename}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Document" />
              <div className="p-6">
                {downloadError && (
                  <Alert variant="error" className="mb-4">
                    {downloadError}
                  </Alert>
                )}
                {cert.fileAvailable ? (
                  <Button variant="primary" onClick={handleDownload} loading={downloading}>
                    Download Certificate
                  </Button>
                ) : (
                  <p className="text-sm italic text-gray-500">The certificate PDF has not been uploaded yet.</p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Blockchain Information" />
              <div className="p-6">
                {cert.status === 'MINTED' && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Blockchain Status:</span>
                      <Badge variant="success">MINTED</Badge>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <BlockchainRow label="Network" value={NETWORK_NAME} mono={false} copyable={false} />
                      <BlockchainRow label="Contract Address" value={cert.contractAddress} />
                      <BlockchainRow label="Token ID" value={cert.tokenId} mono={false} />
                      <BlockchainRow label="Transaction Hash" value={cert.txHash} />
                      <BlockchainRow label="Certificate Hash" value={cert.fileHash} />
                      <BlockchainRow
                        label="Minted At"
                        value={cert.mintedAt?.slice(0, 19).replace('T', ' ') ?? '—'}
                        mono={false}
                        copyable={false}
                      />
                    </div>
                    {cert.txHash && (
                      <div className="mt-5">
                        <a
                          href={`${BLOCK_EXPLORER_URL}/tx/${cert.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border-2 border-kredent-navy px-4 py-2 text-sm font-semibold text-kredent-navy transition hover:bg-kredent-navy hover:text-white"
                        >
                          View Transaction
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {(cert.status === 'PENDING_MINT' || cert.status === 'MINT_FAILED') && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Blockchain Status:</span>
                      <Badge variant="warning">NOT MINTED</Badge>
                    </div>
                    <p className="text-sm text-gray-600">This certificate has not yet been issued on the blockchain.</p>
                  </div>
                )}

                {cert.status === 'REVOKED' && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Blockchain Status:</span>
                      <Badge variant="danger">REVOKED</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      This certificate has been revoked and is no longer valid
                      {cert.revokedReason ? `: ${cert.revokedReason}` : '.'}
                    </p>
                    {cert.fileHash && (
                      <div className="mt-3 divide-y divide-gray-100">
                        <BlockchainRow label="Certificate Hash" value={cert.fileHash} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            <Link to="/student/certificates" className="inline-block text-sm font-semibold text-kredent-accent hover:text-orange-700">
              ← Back to My Certificates
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
