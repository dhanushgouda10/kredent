import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
} from '../components/ui'
import { listAuditLogs } from '../services/auditLogService'
import { listDepartments } from '../services/departmentService'

const PAGE_SIZE = 25

// AuditLog.action (backend, a free-form string written by whichever service call recorded the
// event — see AuditLogService.record's call sites) -> how it should read/color in this admin UI.
// Also doubles as the fixed set of options in the Action filter dropdown, since these are the
// only actions the backend actually writes today.
const ACTION_META = {
  CERTIFICATE_METADATA_ISSUED: { label: 'Certificate Issued', variant: 'info' },
  CERTIFICATE_FILE_UPLOADED: { label: 'PDF Uploaded', variant: 'neutral' },
  CERTIFICATE_METADATA_DELETED: { label: 'Certificate Deleted', variant: 'danger' },
  CERTIFICATE_STATUS_UPDATED: { label: 'Status Updated', variant: 'warning' },
  CERTIFICATE_BLOCKCHAIN_ISSUED: { label: 'Blockchain Issued', variant: 'success' },
  CERTIFICATE_BLOCKCHAIN_REVOKED: { label: 'Blockchain Revoked', variant: 'danger' },
  STUDENT_CREATED: { label: 'Student Created', variant: 'info' },
  STUDENT_UPDATED: { label: 'Student Updated', variant: 'neutral' },
}

function actionMeta(action) {
  return ACTION_META[action] ?? { label: action, variant: 'neutral' }
}

function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function truncateHash(hash) {
  if (!hash) return null
  return hash.length > 14 ? `${hash.slice(0, 8)}…${hash.slice(-6)}` : hash
}

export function AuditLogsPage() {
  const [departments, setDepartments] = useState([])

  const [logs, setLogs] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    let cancelled = false
    listDepartments()
      .then((list) => {
        if (!cancelled) setDepartments(list)
      })
      .catch(() => {
        // Non-fatal — the department filter just won't render its options.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loadLogs = (page = 0) => {
    setLoading(true)
    listAuditLogs({
      search: appliedSearch,
      action: actionFilter,
      department: departmentFilter,
      page,
      size: PAGE_SIZE,
    })
      .then((res) => {
        setLogs(res.content ?? [])
        setPageInfo({ page: res.page, totalPages: res.totalPages, totalElements: res.totalElements })
        setLoadError('')
      })
      .catch((err) => setLoadError(err.message || 'Could not load audit logs'))
      .finally(() => setLoading(false))
  }

  // Re-fetches page 0 whenever a filter changes. Every setState call happens inside a
  // .then/.catch/.finally callback (never synchronously in the effect body) to satisfy
  // react-hooks/set-state-in-effect — same pattern used on the Students and Certificate Registry
  // pages.
  useEffect(() => {
    let cancelled = false
    listAuditLogs({
      search: appliedSearch,
      action: actionFilter,
      department: departmentFilter,
      page: 0,
      size: PAGE_SIZE,
    })
      .then((res) => {
        if (cancelled) return
        setLogs(res.content ?? [])
        setPageInfo({ page: res.page, totalPages: res.totalPages, totalElements: res.totalElements })
        setLoadError('')
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load audit logs')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [appliedSearch, actionFilter, departmentFilter])

  const onSearchSubmit = (e) => {
    e.preventDefault()
    setAppliedSearch(searchInput.trim())
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Audit Logs" subtitle="Read-only system activity log — certificate issuance, revocation, uploads, and blockchain events" />

        {loadError && (
          <Alert variant="error" title="Could not load audit logs" className="mb-6">
            {loadError}
          </Alert>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
          <CardHeader
            title="Activity Log"
            subtitle={loading ? 'Loading…' : `${pageInfo.totalElements} entr${pageInfo.totalElements === 1 ? 'y' : 'ies'}`}
            icon={
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h3m-7 5h10a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H8a2 2 0 00-2 2v13a2 2 0 002 2z" />
              </svg>
            }
          />

          {/* Search and Filter */}
          <div className="border-b border-gray-200 p-6">
            <form onSubmit={onSearchSubmit} className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search by certificate number, USN, or action..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="py-2.5"
                />
              </div>
              <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="py-2.5 lg:w-48">
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code}
                  </option>
                ))}
              </Select>
              <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="py-2.5 lg:w-64">
                <option value="">All Actions</option>
                {Object.entries(ACTION_META).map(([action, meta]) => (
                  <option key={action} value={action}>
                    {meta.label}
                  </option>
                ))}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date / Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Certificate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Performed By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Tx Hash</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} columns={8} />)
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title="No audit log entries found"
                        description="Try a different search term, action, or department filter."
                        icon={
                          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  logs.map((entry, idx) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDateTime(entry.createdAt)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={actionMeta(entry.action).variant}>{actionMeta(entry.action).label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {entry.certificateNumber ? (
                          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                            {entry.certificateNumber}
                          </code>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {entry.studentName || entry.studentUsn ? (
                          <div>
                            {entry.studentName && <p className="text-sm font-medium text-gray-900">{entry.studentName}</p>}
                            {entry.studentUsn && <p className="text-xs text-gray-500">{entry.studentUsn}</p>}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {entry.department ? (
                          <Badge variant="info">{entry.department}</Badge>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {entry.actorName || '—'}
                        {entry.actorType && <span className="ml-1.5 text-xs text-gray-400">({entry.actorType})</span>}
                      </td>
                      <td className="px-6 py-4">
                        {entry.transactionHash ? (
                          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700" title={entry.transactionHash}>
                            {truncateHash(entry.transactionHash)}
                          </code>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedLog(entry)}
                          className="rounded text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                        >
                          View
                        </button>
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
              onPageChange={loadLogs}
            />
          )}
        </Card>
      </motion.div>

      {/* Entry Detail Modal */}
      <Modal open={Boolean(selectedLog)} onClose={() => setSelectedLog(null)} title="Audit Log Entry">
        {selectedLog && (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Date / Time</p>
                <p className="font-semibold text-gray-900">{formatDateTime(selectedLog.createdAt)}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-600">Action</p>
                <Badge variant={actionMeta(selectedLog.action).variant}>{actionMeta(selectedLog.action).label}</Badge>
              </div>
              {selectedLog.certificateNumber && (
                <div>
                  <p className="text-sm text-gray-600">Certificate Number</p>
                  <p className="font-mono text-sm text-gray-900">{selectedLog.certificateNumber}</p>
                </div>
              )}
              {(selectedLog.studentName || selectedLog.studentUsn) && (
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-semibold text-gray-900">
                    {selectedLog.studentName} {selectedLog.studentUsn && `(${selectedLog.studentUsn})`}
                  </p>
                </div>
              )}
              {selectedLog.department && (
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{selectedLog.department}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Performed By</p>
                <p className="font-semibold text-gray-900">
                  {selectedLog.actorName || '—'} <span className="text-sm font-normal text-gray-500">({selectedLog.actorType})</span>
                </p>
              </div>
              {selectedLog.transactionHash && (
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm text-gray-600">Transaction Hash</p>
                  <p className="break-all rounded bg-gray-100 p-2 font-mono text-xs text-gray-900">{selectedLog.transactionHash}</p>
                </div>
              )}
            </div>

            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Details</p>
                <div className="space-y-1.5 rounded-lg bg-gray-50 p-4">
                  {Object.entries(selectedLog.details).map(([key, value]) => (
                    <div key={key} className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-gray-500">{key}</span>
                      <span className="break-all text-right font-mono text-xs text-gray-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </Modal>
      </div>
    </section>
  )
}
