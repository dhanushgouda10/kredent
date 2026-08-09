import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, CardHeader, Input, PageHeader, Select } from '../components/ui'
import { createCertificate, searchStudents, uploadCertificateFile } from '../services/certificateService'

export function IssueDegreePage() {
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState('')

  const [formData, setFormData] = useState({
    studentId: '',
    degreeName: '',
    department: '',
    yearOfCompletion: '',
  })
  const [file, setFile] = useState(null)

  const [isIssuing, setIsIssuing] = useState(false)
  const [error, setError] = useState('')
  const [issuedCertificate, setIssuedCertificate] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // studentsLoading already starts as true, so no synchronous setState here — this
    // effect only needs to flip it off (or set an error) once the fetch settles.
    let cancelled = false
    searchStudents('')
      .then((page) => {
        if (!cancelled) setStudents(page.content ?? [])
      })
      .catch((err) => {
        if (!cancelled) setStudentsError(err.message || 'Could not load students')
      })
      .finally(() => {
        if (!cancelled) setStudentsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIssuedCertificate(null)

    if (!file) {
      setError('Please select the certificate PDF to upload.')
      return
    }

    setIsIssuing(true)
    try {
      // Step 1: create the certificate metadata row.
      const certificate = await createCertificate({
        studentId: Number(formData.studentId),
        degreeName: formData.degreeName,
        department: formData.department,
        yearOfCompletion: Number(formData.yearOfCompletion),
      })

      // Step 2: attach the PDF — the backend hashes it (SHA-256) and stores it in Supabase Storage.
      const withFile = await uploadCertificateFile(certificate.id, file)

      setIssuedCertificate(withFile)
      setFormData({ studentId: '', degreeName: '', department: '', yearOfCompletion: '' })
      setFile(null)
      e.target.reset()
    } catch (err) {
      setError(err.message || 'Failed to issue certificate')
    } finally {
      setIsIssuing(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Issue Degree" subtitle="Create a certificate record and attach the signed PDF" />

        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Card>
              <CardHeader
                title="Issue Degree Credential"
                subtitle="Select the student, enter degree details, and upload the certificate PDF"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />

              <div className="p-6 sm:p-8">
                {studentsError && (
                  <Alert variant="error" title="Could not load students" className="mb-6">
                    {studentsError}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Select
                      label="Student"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      containerClassName="md:col-span-2"
                      disabled={studentsLoading}
                    >
                      <option value="">{studentsLoading ? 'Loading students…' : 'Select Student'}</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.fullName} — {student.usn} ({student.department})
                        </option>
                      ))}
                    </Select>

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
                      name="yearOfCompletion"
                      value={formData.yearOfCompletion}
                      onChange={handleInputChange}
                      placeholder="e.g., 2025"
                      min="2000"
                      max="2100"
                      required
                    />

                    <Select label="Degree Program" name="degreeName" value={formData.degreeName} onChange={handleInputChange} required containerClassName="md:col-span-2">
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

                    <Input
                      label="Certificate PDF"
                      type="file"
                      name="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      hint="Only PDF files are accepted (max 5MB)."
                      containerClassName="md:col-span-2"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="error" title="Could not issue certificate">
                      {error}
                    </Alert>
                  )}

                  <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row">
                    <Button type="submit" variant="primary" size="lg" loading={isIssuing} className="flex-1">
                      {isIssuing ? (
                        'Issuing…'
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Issue Certificate
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin/issued-certificates')}>
                      View Certificates
                    </Button>
                  </div>
                </form>

                {/* Success Message */}
                {issuedCertificate && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                    <Alert variant="success" title="Certificate Issued Successfully!">
                      <div className="mt-2 space-y-2 text-sm">
                        <p className="text-green-700">
                          <span className="font-medium">Certificate Number:</span> {issuedCertificate.certificateNumber}
                        </p>
                        <p className="text-green-700">
                          <span className="font-medium">Student:</span> {issuedCertificate.studentName} ({issuedCertificate.studentUsn})
                        </p>
                        <p className="text-green-700">
                          <span className="font-medium">SHA-256 File Hash:</span>
                        </p>
                        <div className="rounded border border-green-300 bg-white p-2">
                          <code className="break-all text-xs text-green-800">{issuedCertificate.fileHash}</code>
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
