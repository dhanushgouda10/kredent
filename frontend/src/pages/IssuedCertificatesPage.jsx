import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Pagination,
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
import { issueCredentialOnChain, revokeCredentialOnChain, onAccountsChanged } from '../services/blockchainService'
import { listDepartments, getDepartmentSummary } from '../services/departmentService'
import { BLOCK_EXPLORER_URL } from '../contracts/skillChainConfig'

const PAGE_SIZE = 20

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

// Reasonable graduation-year filter options — not stored data, just the range of years the year
// picker offers; actual filtering only ever matches real certificate.yearOfCompletion values.
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR + 1 - i)

export function IssuedCertificatesPage() {
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [deptSummary, setDeptSummary] = useState(null)
  const [deptSummaryError, setDeptSummaryError] = useState('')

  const [certificates, setCertificates] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [blockchainBusyId, setBlockchainBusyId] = useState(null)

  // Manual reconciliation modal — shown when a certificate is confirmed already-minted on-chain
  // (certificateIdToTokenId != 0) but the original transaction hash couldn't be auto-recovered.
  const [reconcileTarget, setReconcileTarget] = useState(null) // { cert, tokenId, contractAddress, message }
  const [reconcileHash, setReconcileHash] = useState('')
  const [reconcileError, setReconcileError] = useState('')
  const [reconcileSubmitting, setReconcileSubmitting] = useState(false)

  const navigate = useNavigate()

  // departments starts as [] so no synchronous setState is needed for the happy path — only the
  // async settle callbacks below.
  useEffect(() => {
    let cancelled = false
    listDepartments()
      .then((list) => {
        if (!cancelled) setDepartments(list)
      })
      .catch(() => {
        // Non-fatal — the department switcher just won't render; filtering by department still
        // works if a code is set some other way, and the rest of the registry is unaffected.
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Real, DB-computed counts for the selected department (Total Students, Certificates, Pending,
  // Minted, Revoked) — the "department dashboard" strip. Only fetched when a department is
  // actually selected; cleared otherwise.
  useEffect(() => {
    let cancelled = false
    // Always resolve asynchronously (even the "no department selected" case) so every setState
    // call happens inside a .then callback rather than synchronously in the effect body.
    Promise.resolve()
      .then(() => (selectedDepartment ? getDepartmentSummary(selectedDepartment) : null))
      .then((summary) => {
        if (cancelled) return
        setDeptSummary(summary)
        setDeptSummaryError('')
      })
      .catch((err) => {
        if (!cancelled) setDeptSummaryError(err.message || 'Could not load department summary')
      })
    return () => {
      cancelled = true
    }
  }, [selectedDepartment])

  const loadCertificates = (page = 0) => {
    setLoading(true)
    listCertificates({
      department: selectedDepartment,
      year: yearFilter,
      status: statusFilter,
      search: appliedSearch,
      page,
      size: PAGE_SIZE,
    })
      .then((res) => {
        setCertificates(res.content ?? [])
        setPageInfo({ page: res.page, totalPages: res.totalPages, totalElements: res.totalElements })
        setLoadError('')
      })
      .catch((err) => setLoadError(err.message || 'Could not load certificates'))
      .finally(() => setLoading(false))
  }

  // Re-fetches page 0 whenever a filter changes. Deliberately avoids any synchronous setState
  // call in the effect body (see AdminStudentsPage for the same pattern) — every update happens
  // inside a .then/.catch/.finally callback, so the table swaps in the new filtered data once it
  // arrives rather than flashing a skeleton state on every filter change.
  useEffect(() => {
    let cancelled = false
    listCertificates({
      department: selectedDepartment,
      year: yearFilter,
      status: statusFilter,
      search: appliedSearch,
      page: 0,
      size: PAGE_SIZE,
    })
      .then((res) => {
        if (cancelled) return
        setCertificates(res.content ?? [])
        setPageInfo({ page: res.page, totalPages: res.totalPages, totalElements: res.totalElements })
        setLoadError('')
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load certificates')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedDepartment, yearFilter, statusFilter, appliedSearch])

  // If the admin switches MetaMask accounts mid-session, clear any stale "wrong wallet" error
  // so the next click re-checks fresh instead of showing an outdated message.
  useEffect(() => {
    const unsubscribe = onAccountsChanged(() => setActionError(''))
    return unsubscribe
  }, [])

  const onSearchSubmit = (e) => {
    e.preventDefault()
    setAppliedSearch(searchInput.trim())
  }

  const selectDepartment = (code) => {
    setSelectedDepartment(code)
  }

  const applyUpdatedCertificate = (updated) => {
    setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setSelectedCertificate((prev) => (prev && prev.id === updated.id ? updated : prev))
    // The certificate's status just changed — the department dashboard counts (Pending/Minted/
    // Revoked) are now stale, so refresh them from the real DB values rather than guessing.
    if (selectedDepartment) {
      getDepartmentSummary(selectedDepartment).then(setDeptSummary).catch(() => {})
    }
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
      let transactionHash
      let tokenId
      let contractAddress
      try {
        // Step 1: admin's MetaMask signs and submits the mint transaction directly (or, if this
        // certificate turns out to already be minted on-chain, this recovers the existing record
        // instead of minting again).
        const result = await issueCredentialOnChain({
          certificateId: cert.id,
          certificateHash: cert.fileHash,
          studentWalletAddress: cert.studentWalletAddress,
        })
        transactionHash = result.transactionHash
        tokenId = result.tokenId
        contractAddress = result.contractAddress
      } catch (chainError) {
        console.info('[reconcile] caught error code from issueCredentialOnChain', {
          certificateId: cert.id,
          code: chainError.code,
        })
        // Confirmed already minted (tokenId is known), but the transaction hash couldn't be
        // found automatically — open the reconciliation modal so the admin can supply a hash
        // they already have (e.g. from the block explorer) instead of the certificate being stuck.
        if (chainError.code !== 'ALREADY_MINTED_NEEDS_TX_HASH') {
          throw chainError
        }
        setReconcileTarget({
          cert,
          tokenId: chainError.tokenId,
          contractAddress: chainError.contractAddress,
          message: chainError.message,
        })
        setReconcileHash('')
        setReconcileError('')
        return
      }

      // Step 2: backend independently re-verifies that transaction (status, contract, admin
      // wallet) against its own RPC before recording it.
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

  const closeReconcileModal = () => {
    setReconcileTarget(null)
    setReconcileHash('')
    setReconcileError('')
  }

  // Submits a manually-supplied transaction hash for a certificate already confirmed minted
  // on-chain (via certificateIdToTokenId) whose hash couldn't be auto-recovered from event logs.
  // Reuses the exact same backend endpoint as a fresh mint — the backend independently verifies
  // the receipt (status/contract/admin wallet) before recording anything, whether the hash came
  // from a live mint or this manual path.
  const handleSubmitReconciliation = async () => {
    if (!reconcileTarget) return
    const trimmed = reconcileHash.trim()
    if (!/^0x[0-9a-fA-F]{64}$/.test(trimmed)) {
      setReconcileError('Enter a valid transaction hash (0x followed by 64 hex characters).')
      return
    }

    const { cert, tokenId, contractAddress } = reconcileTarget
    console.info('[reconcile] submitting manual reconciliation', {
      certificateId: cert.id,
      tokenId,
      contractAddress,
      transactionHash: trimmed,
    })

    setReconcileSubmitting(true)
    setReconcileError('')
    try {
      const updated = await issueCertificateBlockchain(cert.id, {
        studentWalletAddress: cert.studentWalletAddress,
        certificateHash: cert.fileHash,
        tokenId,
        contractAddress,
        transactionHash: trimmed,
      })
      console.info('[reconcile] backend response', updated)
      applyUpdatedCertificate(updated)
      closeReconcileModal()
    } catch (err) {
      console.error('[reconcile] backend rejected reconciliation', {
        certificateId: cert.id,
        error: err.message,
      })
      setReconcileError(err.message || 'Reconciliation failed')
    } finally {
      setReconcileSubmitting(false)
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

  const departmentLabel = (code) => departments.find((d) => d.code === code)?.label ?? code

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Certificate Registry" subtitle="Manage and monitor issued degree certificates by department" />

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

        {/* Department switcher */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectDepartment('')}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedDepartment === ''
                ? 'border-kredent-navy bg-kredent-navy text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-kredent-navy/50'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept.code}
              type="button"
              onClick={() => selectDepartment(dept.code)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedDepartment === dept.code
                  ? 'border-kredent-accent bg-kredent-accent text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-kredent-accent/50'
              }`}
            >
              {dept.code}
            </button>
          ))}
        </div>

        {/* Department dashboard — real, DB-computed counts only */}
        {selectedDepartment && (
          <div className="mb-8">
            {deptSummaryError && (
              <Alert variant="error" title="Could not load department summary" className="mb-4">
                {deptSummaryError}
              </Alert>
            )}
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="font-serif text-xl font-bold text-kredent-navy">{departmentLabel(selectedDepartment)}</h2>
              <span className="text-sm text-gray-500">({selectedDepartment})</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {!deptSummary ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Students" value={deptSummary.totalStudents} iconBgClassName="bg-blue-100 text-blue-600" icon={<UsersIcon />} />
                  <StatCard label="Certificates Issued" value={deptSummary.totalCertificates} iconBgClassName="bg-indigo-100 text-indigo-600" icon={<DocIcon />} delay={0.05} />
                  <StatCard label="Pending" value={deptSummary.pendingMint} valueClassName="text-amber-600" iconBgClassName="bg-amber-100 text-amber-600" icon={<ClockIcon />} delay={0.1} />
                  <StatCard label="Minted" value={deptSummary.minted} valueClassName="text-green-600" iconBgClassName="bg-green-100 text-green-600" icon={<CheckIcon />} delay={0.15} />
                  <StatCard label="Revoked" value={deptSummary.revoked} valueClassName="text-red-600" iconBgClassName="bg-red-100 text-red-600" icon={<XIcon />} delay={0.2} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Table Card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card>
            <CardHeader
              title="Certificate Records"
              subtitle={loading ? 'Loading…' : `${pageInfo.totalElements} certificate${pageInfo.totalElements === 1 ? '' : 's'}`}
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
              <form onSubmit={onSearchSubmit} className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name, USN, or certificate number..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="py-2.5"
                  />
                </div>
                <Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="py-2.5 lg:w-40">
                  <option value="">All Years</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2.5 lg:w-48">
                  <option value="">All Status</option>
                  <option value="PENDING_MINT">Pending Mint</option>
                  <option value="MINTED">Minted</option>
                  <option value="MINT_FAILED">Mint Failed</option>
                  <option value="REVOKED">Revoked</option>
                </Select>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>
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
                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
                  ) : certificates.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          title="No certificates found"
                          description="Try a different search term, department, year, or status filter."
                          icon={
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          }
                        />
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert, idx) => (
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
                        <td className="px-6 py-4">
                          <Badge variant="info">{cert.department}</Badge>
                        </td>
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

            {!loading && (
              <Pagination
                page={pageInfo.page}
                totalPages={pageInfo.totalPages}
                totalElements={pageInfo.totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={loadCertificates}
              />
            )}
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

        {/* Blockchain Reconciliation Modal — shown when a certificate is confirmed already
            minted on-chain but its transaction hash couldn't be recovered automatically. */}
        <Modal open={Boolean(reconcileTarget)} onClose={closeReconcileModal} title="Complete blockchain reconciliation" size="md">
          {reconcileTarget && (
            <div className="space-y-4 p-6">
              <p className="text-sm text-gray-700">{reconcileTarget.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Token ID</p>
                  <p className="font-mono font-semibold text-gray-900">{reconcileTarget.tokenId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contract</p>
                  <p className="break-all font-mono text-xs text-gray-900">{reconcileTarget.contractAddress}</p>
                </div>
              </div>
              <Input
                label="Transaction hash"
                required
                placeholder="0x..."
                value={reconcileHash}
                onChange={(e) => setReconcileHash(e.target.value)}
                error={reconcileError}
                hint="Find this on the block explorer for the mint transaction."
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={closeReconcileModal} disabled={reconcileSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReconciliation} loading={reconcileSubmitting}>
                  Submit
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
