import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Alert, Button, Card, PageHeader, SkeletonLines } from '../components/ui'
import { verifyCertificate, verifyCertificatePdf } from '../services/verificationService'
import { BLOCK_EXPLORER_URL } from '../contracts/skillChainConfig'

const PDF_RESULT_META = {
  AUTHENTIC: {
    label: 'AUTHENTIC',
    badge: '🟢',
    wrap: 'border-green-200 bg-green-50',
    textColor: 'text-green-800',
  },
  TAMPERED: {
    label: 'TAMPERED',
    badge: '🔴',
    wrap: 'border-red-200 bg-red-50',
    textColor: 'text-red-800',
  },
  REVOKED: {
    label: 'REVOKED',
    badge: '⚠️',
    wrap: 'border-amber-200 bg-amber-50',
    textColor: 'text-amber-800',
  },
}

const RESULT_META = {
  VERIFIED: {
    label: 'VERIFIED',
    badge: '✓',
    wrap: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
    badgeWrap: 'bg-green-500',
    textColor: 'text-green-800',
  },
  REVOKED: {
    label: 'REVOKED',
    badge: '⚠',
    wrap: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50',
    badgeWrap: 'bg-amber-500',
    textColor: 'text-amber-800',
  },
  INVALID: {
    label: 'INVALID',
    badge: '✕',
    wrap: 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50',
    badgeWrap: 'bg-red-500',
    textColor: 'text-red-800',
  },
  UNAVAILABLE: {
    label: 'VERIFICATION UNAVAILABLE',
    badge: '⚠',
    wrap: 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100',
    badgeWrap: 'bg-gray-500',
    textColor: 'text-gray-800',
  },
}

function resultMeta(result) {
  return RESULT_META[result] ?? RESULT_META.UNAVAILABLE
}

export function VerifyResultPage() {
  const { certificateNumber } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [pdfFile, setPdfFile] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfResult, setPdfResult] = useState(null)
  const [pdfError, setPdfError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    verifyCertificate(certificateNumber)
      .then((result) => {
        setData(result)
        setError('')
      })
      .catch((err) => setError(err.message || 'Could not reach the verification service'))
      .finally(() => setLoading(false))
  }, [certificateNumber])

  const onPdfChange = (e) => {
    setPdfFile(e.target.files?.[0] ?? null)
    setPdfResult(null)
    setPdfError('')
  }

  const onPdfSubmit = async (e) => {
    e.preventDefault()
    if (!pdfFile) {
      setPdfError('Choose a PDF file to verify.')
      return
    }
    setPdfLoading(true)
    setPdfError('')
    setPdfResult(null)
    try {
      const result = await verifyCertificatePdf(certificateNumber, pdfFile)
      setPdfResult(result)
    } catch (err) {
      setPdfError(err.message || 'Could not verify this PDF right now.')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-2xl px-5 lg:px-10">
        <PageHeader title="Kredent Certificate Verification" subtitle={`Certificate Number: ${certificateNumber}`} />

        {loading ? (
          <Card className="p-8">
            <SkeletonLines lines={6} />
          </Card>
        ) : error ? (
          <Alert variant="error" title="Could not verify this certificate">
            {error}
          </Alert>
        ) : data ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border p-6 ${resultMeta(data.result).wrap}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white ${resultMeta(data.result).badgeWrap}`}
                >
                  {resultMeta(data.result).badge}
                </div>
                <div>
                  <p className={`text-xl font-bold ${resultMeta(data.result).textColor}`}>{resultMeta(data.result).label}</p>
                  <p className={`text-sm ${resultMeta(data.result).textColor}`}>{data.message}</p>
                </div>
              </div>
            </motion.div>

            {data.studentName && (
              <Card>
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-kredent-navy">Certificate Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Certificate Number</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{data.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-semibold text-gray-900">{data.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Degree</p>
                    <p className="font-semibold text-gray-900">{data.degreeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-900">{data.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Institution</p>
                    <p className="font-semibold text-gray-900">{data.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issue Date</p>
                    <p className="font-semibold text-gray-900">{data.issuedAt?.slice(0, 10) ?? '—'}</p>
                  </div>
                </div>
              </Card>
            )}

            {data.tokenId != null && (
              <Card>
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-kredent-navy">Permanent Record</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        This certificate is recorded on a tamper-proof ledger. The record cannot be altered or deleted
                        by anyone, including the college.
                      </p>
                    </div>
                  </div>
                </div>

                <details className="group p-6">
                  <summary className="cursor-pointer list-none text-sm font-medium text-kredent-accent hover:text-orange-700">
                    View technical verification details
                  </summary>
                  <div className="mt-4 divide-y divide-gray-100">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Network</span>
                      <span className="text-sm font-semibold text-gray-900">{data.network}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Contract Address</span>
                      <span className="break-all text-right font-mono text-xs text-gray-900">{data.contractAddress}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Token ID</span>
                      <span className="text-sm font-semibold text-gray-900">{data.tokenId}</span>
                    </div>
                    {data.certificateHash && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Certificate Hash</span>
                        <span className="break-all text-right font-mono text-xs text-gray-900">{data.certificateHash}</span>
                      </div>
                    )}
                    {data.transactionHash && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Transaction Hash</span>
                        <span className="break-all text-right font-mono text-xs text-gray-900">{data.transactionHash}</span>
                      </div>
                    )}
                  </div>
                  {data.transactionHash && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <a
                        href={`${BLOCK_EXPLORER_URL}/tx/${data.transactionHash}`}
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
                </details>
              </Card>
            )}

            {data.studentName && (
              <Card>
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-kredent-navy">Verify PDF Authenticity</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Upload a copy of this certificate's PDF to confirm it hasn't been altered since it was issued.
                  </p>
                </div>
                <div className="p-6">
                  <form onSubmit={onPdfSubmit} className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={onPdfChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-kredent-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-kredent-navy-dark"
                    />
                    {pdfError && <Alert variant="error">{pdfError}</Alert>}
                    <Button type="submit" variant="primary" loading={pdfLoading} disabled={pdfLoading}>
                      Upload PDF to Verify
                    </Button>
                  </form>

                  {pdfResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`mt-5 flex items-center gap-3 rounded-xl border p-4 ${
                        (PDF_RESULT_META[pdfResult.result] ?? PDF_RESULT_META.TAMPERED).wrap
                      }`}
                    >
                      <span className="text-2xl">{(PDF_RESULT_META[pdfResult.result] ?? PDF_RESULT_META.TAMPERED).badge}</span>
                      <div>
                        <p className={`font-bold ${(PDF_RESULT_META[pdfResult.result] ?? PDF_RESULT_META.TAMPERED).textColor}`}>
                          {(PDF_RESULT_META[pdfResult.result] ?? PDF_RESULT_META.TAMPERED).label}
                        </p>
                        <p className={`text-sm ${(PDF_RESULT_META[pdfResult.result] ?? PDF_RESULT_META.TAMPERED).textColor}`}>
                          {pdfResult.message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            )}

            <div className="text-center">
              <Button to="/verify" variant="outline">
                Verify Another Certificate
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
