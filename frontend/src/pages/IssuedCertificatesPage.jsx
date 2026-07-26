import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
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

const mockCertificates = [
  {
    id: '1',
    name: 'Aarav Rao',
    usn: '1MJ21CS001',
    department: 'Computer Science and Engineering',
    year: '2025',
    status: 'Valid',
    degree: 'B.E. Computer Science and Engineering',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    transactionHash: '0x5cf9af434b0db73a76380383adca102f95a194d01',
    issuedDate: '2025-03-15',
  },
  {
    id: '2',
    name: 'Nisha Iyer',
    usn: '1MJ21EC014',
    department: 'Electronics and Communication Engineering',
    year: '2025',
    status: 'Valid',
    degree: 'B.E. Electronics and Communication Engineering',
    walletAddress: '0x8f3d2a1b9c7e6f5d4a3b2c1d0e9f8a7b6c5d4e3',
    transactionHash: '0x2a8f7c4e1b6d9a3f5e8c2b7d4a1f6e9c3b8d5a7',
    issuedDate: '2025-03-14',
  },
  {
    id: '3',
    name: 'Rahul S',
    usn: '1MJ20ME027',
    department: 'Mechanical Engineering',
    year: '2024',
    status: 'Revoked',
    degree: 'B.E. Mechanical Engineering',
    walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    transactionHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    issuedDate: '2024-06-20',
  },
  {
    id: '4',
    name: 'Priya Sharma',
    usn: '1MJ21CE045',
    department: 'Civil Engineering',
    year: '2025',
    status: 'Valid',
    degree: 'B.E. Civil Engineering',
    walletAddress: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    transactionHash: '0x7b6c5d4e3f2a1b9c8d7e6f5a4b3c2d1e0f9a8b7',
    issuedDate: '2025-03-16',
  },
]

export function IssuedCertificatesPage() {
  const [certificates, setCertificates] = useState(mockCertificates)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Brief cosmetic loading state so the dashboard has a real skeleton to show
  // on first paint. The data itself is still the same mock registry.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || cert.usn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || cert.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const recentActivity = [...certificates]
    .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
    .slice(0, 4)

  const handleRevoke = (certId) => {
    setCertificates((prev) => prev.map((cert) => (cert.id === certId ? { ...cert, status: 'Revoked' } : cert)))
  }

  const handleViewCertificate = (cert) => {
    setSelectedCertificate(cert)
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Issued Certificates" subtitle="Manage and monitor all blockchain-issued degree certificates" />

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
          ) : (
            <>
              <StatCard
                label="Total Certificates"
                value={certificates.length}
                iconBgClassName="bg-blue-100 text-blue-600"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <StatCard
                label="Valid Certificates"
                value={certificates.filter((c) => c.status === 'Valid').length}
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
                label="Revoked Certificates"
                value={certificates.filter((c) => c.status === 'Revoked').length}
                valueClassName="text-red-600"
                iconBgClassName="bg-red-100 text-red-600"
                delay={0.1}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="This Month"
                value={3}
                valueClassName="text-kredent-accent"
                iconBgClassName="bg-orange-100 text-kredent-accent"
                delay={0.15}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      cert.status === 'Valid' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {cert.status === 'Valid' ? 'Issued to' : 'Revoked for'} {cert.name}
                    </p>
                    <p className="text-xs text-gray-500">{cert.issuedDate}</p>
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
              subtitle="Blockchain-verified degree records"
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
                  <option value="Valid">Valid</option>
                  <option value="Revoked">Revoked</option>
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
                            <p className="font-semibold text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-500">{cert.degree}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700">{cert.usn}</code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cert.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cert.year}</td>
                        <td className="px-6 py-4">
                          <Badge status={cert.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewCertificate(cert)}
                              className="rounded text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                              View
                            </button>
                            {cert.status === 'Valid' && (
                              <button
                                onClick={() => handleRevoke(cert.id)}
                                className="rounded text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                              >
                                Revoke
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
                  <p className="font-semibold text-gray-900">{selectedCertificate.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">USN</p>
                  <p className="font-mono text-sm text-gray-900">{selectedCertificate.usn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Completion</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.year}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600">Status</p>
                  <Badge status={selectedCertificate.status} />
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm text-gray-600">Wallet Address</p>
                  <p className="break-all rounded bg-gray-100 p-2 font-mono text-sm text-gray-900">
                    {selectedCertificate.walletAddress}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm text-gray-600">Transaction Hash</p>
                  <p className="break-all rounded bg-gray-100 p-2 font-mono text-xs text-gray-900">
                    {selectedCertificate.transactionHash}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issued Date</p>
                  <p className="font-semibold text-gray-900">{selectedCertificate.issuedDate}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}
