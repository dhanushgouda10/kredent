import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  ChartPlaceholder,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Select,
  SkeletonRow,
  SkeletonStatCard,
  StatCard,
} from '../components/ui'
import {
  downloadCertificateFile,
  issueCertificateBlockchain,
  listCertificates,
  revokeCertificateBlockchain,
  updateCertificateStatus,
} from '../services/certificateService'
import { issueCredentialOnChain, revokeCredentialOnChain } from '../services/blockchainService'
import { BLOCK_EXPLORER_URL } from '../contracts/skillChainConfig'

// Certificate.status (backend enum) -> how it should read/color in this admin UI.
const STATUS_META = {
  PENDING_MINT: { label: 'Pending Mint', variant: 'warning' },
  MINTED: { label: 'Minted', variant: 'success' },
  MINT_FAILED: { label: 'Mint Failed', variant: 'danger' },
  REVOKED: { label: 'Revoked', variant: 'danger' },
}

function statusMeta(status) {
  return STATUS_META[status] ?? { label: status, variant: 'neutral' }
}

export function IssuedCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [blockchainBusyId, setBlockchainBusyId] = useState(null)
  const navigate = useNavigate()

  // loading already starts as true (see useState above), so calling this on mount
  // doesn't need a synchronous setState — only the async settle callbacks below do.
  const loadCertificates = () => {
    listCertificates({ size: 100 })
      .then((page) => {
        setCertificates(page.content ?? [])
        setLoadError('')
      })
      .catch((err) => setLoadError(err.message || 'Could not load certificates'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  const filteredCertificates = certificates.filter((cert) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      !term || cert.studentName?.toLowerCase().includes(term) || cert.studentUsn?.toLowerCase().includes(term)
    const matchesStatus = statusFilter === 'All' || cert.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const recentActivity = [...certificates]
    .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
    .slice(0, 4)

  const applyUpdatedCertificate = (updated) => {
    setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setSelectedCertificate((prev) => (prev && prev.id === updated.id ? updated : prev))
  }

  const handleRevoke = async (cert) => {
    const reason = window.prompt(`Reason for revoking ${cert.certificateNumber}?`)
    if (!reason) return // required by the backend; cancel/blank aborts the action

    setActionError('')
    setBlockchainBusyId(cert.id)
    try {
      let updated
      if (cert.status === 'MINTED') {
        // Minted certificates must be revoked on-chain first, so the smart contract and the
        // database stay in sync (see CertificateService.updateStatus's guard on the backend).
        const { transactionHash } = await revokeCredentialOnChain({ tokenId: cert.tokenId, reason })
        updated = await revokeCertificateBlockchain(cert.id, { tokenId: cert.tokenId, transactionHash, reason })
      } else {
        // Never minted (still PENDING_MINT / MINT_FAILED) — same plain Phase 2 revoke as before.
        updated = await updateCertificateStatus(cert.id, 'REVOKED', reason)
      }
      applyUpdatedCertificate(updated)
    } catch (err) {
      setActionError(err.message || 'Failed to revoke certificate')
    } finally {
      setBlockchainBusyId(null)
    }
  }

  const handleIssueOnBlockchain = async (cert) => {
    setActionError('')

    if (!cert.studentWalletAddress) {
      setActionError('This student does not have a system-managed wallet on file yet.')
      return
    }
    if (!cert.fileHash) {
      setActionError('Upload the certificate PDF first — the blockchain credential needs its SHA-256 hash.')
      return
    }

    setBlockchainBusyId(cert.id)
    try {
      // Step 1: admin's MetaMask signs and submits the mint transaction directly.
      const { transactionHash, tokenId, contractAddress } = await issueCredentialOnChain({
        certificateId: cert.id,
        certificateHash: cert.fileHash,
        studentWalletAddress: cert.studentWalletAddress,
      })
      // Step 2: backend independently re-verifies that transaction, then records it.
      const updated = await issueCertificateBlockchain(cert.id, {
        studentWalletAddress: cert.studentWalletAddress,
        certificateHash: cert.fileHash,
        tokenId,
        contractAddress,
        transactionHash,
      })
      applyUpdatedCertificate(updated)
    } catch (err) {
      setActionError(err.message || 'Blockchain issuance failed')
    } finally {
      setBlockchainBusyId(null)
    }
  }

  const handleDownload = async (cert) => {
    setActionError('')
    try {
      await downloadCertificateFile(cert.id, `${cert.certificateNumber}.pdf`)
    } catch (err) {
      setActionError(err.message || 'Failed to download certificate')
    }
  }

  const handleViewCertificate = (cert) => {
    setSelectedCertificate(cert)
  }

  const totalCount = certificates.length
  const revokedCount = certificates.filter((c) => c.status === 'REVOKED').length
  const pendingMintCount = certificates.filter((c) => c.status === 'PENDING_MINT').length
  const mintedCount = certificates.filter((c) => c.status === 'MINTED').length

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Issued Certificates" subtitle="Manage and monitor all issued degree certificates" />

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

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
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
                label="Pending Mint"
                value={pendingMintCount}
                valueClassName="text-amber-600"
                iconBgClassName="bg-amber-100 text-amber-600"
                delay={0.1}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Revoked"
                value={revokedCount}
                valueClassName="text-red-600"
                iconBgClassName="bg-red-100 text-red-600"
                delay={0.15}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Dashboard preview row: chart placeholder + recent activity */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Certificates Issued Over Time</h3>
            <ChartPlaceholder label="Analytics will appear here once charting is wired up" />
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Recent Activity</h3>
            <ul className="space-y-4">
              {recentActivity.map((cert) => (
                <li key={cert.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                      cert.status === 'REVOKED' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {cert.status === 'REVOKED' ? 'Revoked for' : 'Issued to'} {cert.studentName}
                    </p>
                    <p className="text-xs text-gray-500">{cert.issuedAt?.slice(0, 10)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Main Table Card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card>
            <CardHeader
              title="Certificate Registry"
              subtitle="All issued degree records"
              icon={
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8m5-4h4" />
                </svg>
              }
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/admin/issue-degree')}
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Issue New
                </Button>
              }
            />

            {/* Search and Filter */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name or USN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2.5"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2.5 lg:w-48"
                >
                  <option value="All">All Status</option>
                  <option value="PENDING_MINT">Pending Mint</option>
                  <option value="MINTED">Minted</option>
                  <option value="REVOKED">Revoked</option>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">USN</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Year</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
                  ) : filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          title="No certificates found"
                          description="Try a different search term or status filter."
                          icon={
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((cert, idx) => (
                      <motion.tr
                        key={cert.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{cert.studentName}</p>
                            <p className="text-sm text-gray-500">{cert.degreeName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{cert.studentUsn}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cert.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cert.yearOfCompletion}</td>
                        <td className="px-6 py-4">
                          <Badge variant={statusMeta(cert.status).variant}>{statusMeta(cert.status).label}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewCertificate(cert)}
                              className="rounded text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                              View
                            </button>
                            {cert.fileAvailable && (
                              <button
                                onClick={() => handleDownload(cert)}
                                className="rounded text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                              >
                                Download
                              </button>
                            )}
                            {cert.status === 'PENDING_MINT' && cert.fileAvailable && (
                              <button
                                onClick={() => handleIssueOnBlockchain(cert)}
                                disabled={blockchainBusyId === cert.id}
                                className="rounded text-sm font-medium text-kredent-accent transition-colors hover:text-orange-700 disabled:opacity-50"
                              >
                                {blockchainBusyId === cert.id ? 'Issuing…' : 'Issue on Blockchain'}
                              </button>
                            )}
                            {cert.status !== 'REVOKED' && (
                              <button
                                onClick={() => handleRevoke(cert)}
                                disabled={blockchainBusyId === cert.id}
                                className="rounded text-sm font-medium text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                              >
                                {blockchainBusyId === cert.id ? 'Revoking…' : 'Revoke'}
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Certificate Detail Modal */}
        <Modal open={Boolean(selectedCertificate)} onClose={() => setSelectedCertificate(null)} title="Certificate Details">
          {selectedCertificate && (
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">USN</p>
                  <p className="font-mono text-sm text-gray-900">{selectedCertificate.studentUsn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Certificate Number</p>
                  <p className="font-mono text-sm text-gray-900">{selectedCertificate.certificateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.degreeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Completion</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.yearOfCompletion}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Status</p>
                  <Badge variant={statusMeta(selectedCertificate.status).variant}>
                    {statusMeta(selectedCertificate.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issued Date</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.issuedAt?.slice(0, 10)}</p>
                </div>
                {selectedCertificate.revokedReason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Revoked Reason</p>
                    <p className="font-semibold text-gray-900">{selectedCertificate.revokedReason}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm text-gray-600">SHA-256 File Hash</p>
                  {selectedCertificate.fileHash ? (
                    <p className="break-all rounded bg-gray-100 p-2 font-mono text-xs text-gray-900">
                      {selectedCertificate.fileHash}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No file uploaded yet</p>
                  )}
                </div>
                {selectedCertificate.fileAvailable && (
                  <div className="md:col-span-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(selectedCertificate)}>
                      Download PDF
                    </Button>
                  </div>
                )}

                {/* Blockchain section (Phase 3) */}
                <div className="border-t border-gray-200 pt-4 md:col-span-2">
                  <p className="mb-2 text-sm font-semibold text-gray-700">Blockchain</p>

                  {selectedCertificate.status === 'MINTED' || selectedCertificate.status === 'REVOKED' ? (
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Blockchain Status:</span>
                        <span
                          className={`font-semibold ${
                            selectedCertificate.status === 'REVOKED' ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {selectedCertificate.status === 'REVOKED' ? 'REVOKED' : '✅ ISSUED'}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-600">Transaction Hash:</span>
                        <a
                          href={`${BLOCK_EXPLORER_URL}/tx/${selectedCertificate.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block break-all font-mono text-xs text-blue-600 hover:underline"
                        >
                          {selectedCertificate.txHash}
                        </a>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-600">Token / Credential ID:</span>
                        <span className="font-mono text-xs text-gray-900">{selectedCertificate.tokenId}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-600">Student Wallet:</span>
                        <span className="block break-all font-mono text-xs text-gray-900">{selectedCertificate.walletAddress}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-600">Contract:</span>
                        <a
                          href={`${BLOCK_EXPLORER_URL}/address/${selectedCertificate.contractAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block break-all font-mono text-xs text-blue-600 hover:underline"
                        >
                          {selectedCertificate.contractAddress}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4 text-sm">
                      <p className="mb-3 text-gray-600">
                        Not yet issued on-chain. Student's system-managed wallet:{' '}
                        <span className="font-mono text-xs text-gray-900">
                          {selectedCertificate.studentWalletAddress || 'none on file'}
                        </span>
                      </p>
                      {selectedCertificate.fileAvailable ? (
                        <Button
                          variant="accent"
                          size="sm"
                          loading={blockchainBusyId === selectedCertificate.id}
                          onClick={() => handleIssueOnBlockchain(selectedCertificate)}
                        >
                          Issue on Blockchain
                        </Button>
                      ) : (
                        <p className="text-xs italic text-gray-500">Upload the certificate PDF before issuing on the blockchain.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}
