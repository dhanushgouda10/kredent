import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, CardHeader, Input, PageHeader, Select } from '../components/ui'

export function IssueDegreePage() {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: '',
    year: '',
    walletAddress: '',
    degree: '',
  })
  const [isIssuing, setIsIssuing] = useState(false)
  const [issued, setIssued] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsIssuing(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      const mockHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setTransactionHash(mockHash)
      setIsIssuing(false)
      setIssued(true)

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          usn: '',
          department: '',
          year: '',
          walletAddress: '',
          degree: '',
        })
        setIssued(false)
      }, 3000)
    }, 2000)
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Issue Degree" subtitle="Create and issue new degree certificates on the MVJCE blockchain" />

        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Card>
              <CardHeader
                title="Issue Degree Credential"
                subtitle="Enter student and degree information"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      label="Student Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter student name"
                      required
                    />

                    <Input
                      label="USN"
                      name="usn"
                      value={formData.usn}
                      onChange={handleInputChange}
                      placeholder="e.g., 1MJ21CS001"
                      required
                    />

                    <Select label="Department" name="department" value={formData.department} onChange={handleInputChange} required>
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics & Communication">Electronics &amp; Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                    </Select>

                    <Input
                      label="Year of Completion"
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2025"
                      min="2020"
                      max="2030"
                      required
                    />

                    <Input
                      label="Wallet Address"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
                      className="font-mono text-sm"
                      required
                    />

                    <Select label="Degree Program" name="degree" value={formData.degree} onChange={handleInputChange} required>
                      <option value="">Select Degree</option>
                      <option value="B.E. Computer Science and Engineering">B.E. Computer Science and Engineering</option>
                      <option value="B.E. Electronics and Communication Engineering">
                        B.E. Electronics and Communication Engineering
                      </option>
                      <option value="B.E. Mechanical Engineering">B.E. Mechanical Engineering</option>
                      <option value="B.E. Civil Engineering">B.E. Civil Engineering</option>
                      <option value="B.E. Electrical and Electronics Engineering">
                        B.E. Electrical and Electronics Engineering
                      </option>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row">
                    <Button type="submit" variant="primary" size="lg" loading={isIssuing} className="flex-1">
                      {isIssuing ? (
                        'Issuing on Blockchain…'
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Issue on Blockchain
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin/issued-certificates')}>
                      View Certificates
                    </Button>
                  </div>
                </form>

                {/* Success Message */}
                {issued && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                    <Alert variant="success" title="Certificate Issued Successfully!">
                      <div className="mt-2 space-y-2 text-sm">
                        <p className="text-green-700">
                          <span className="font-medium">Student:</span> {formData.name}
                        </p>
                        <p className="text-green-700">
                          <span className="font-medium">USN:</span> {formData.usn}
                        </p>
                        <p className="text-green-700">
                          <span className="font-medium">Transaction Hash:</span>
                        </p>
                        <div className="rounded border border-green-300 bg-white p-2">
                          <code className="break-all text-xs text-green-800">{transactionHash}</code>
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
