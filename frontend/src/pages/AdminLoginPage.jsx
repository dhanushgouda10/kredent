import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { loginAdminWithWallet } from '../services/authService'
import { useAuth } from '../context/useAuth'
import { Alert, Button, Card, CardHeader, PageHeader } from '../components/ui'

const perks = [
  'Issue new degree certificates',
  'Manage existing certificates',
  'View verification statistics',
  'Blockchain transaction monitoring',
]

export function AdminLoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [connectError, setConnectError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleConnectMetaMask = async () => {
    setConnectError(null)

    if (!window.ethereum) {
      setConnectError('MetaMask is not installed. Please install the MetaMask browser extension to continue.')
      return
    }

    setIsConnecting(true)
    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const authResponse = await loginAdminWithWallet(address)

      login(authResponse)
      setWalletAddress(address)
      setIsConnected(true)

      // Brief confirmation beat before redirecting to the dashboard.
      setTimeout(() => {
        navigate('/admin/issue-degree')
      }, 1500)
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : 'Could not connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <PageHeader title="Admin Portal" subtitle="Secure access to MVJCE blockchain degree management system" />

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Side - Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-kredent-navy to-kredent-navy-deep p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
              <div className="mb-6 flex items-center space-x-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16">
                  <svg className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold sm:text-3xl">Kredent Admin Portal</h2>
                  <p className="text-white/80">Institutional Access</p>
                </div>
              </div>

              <p className="mb-8 leading-relaxed text-white/90">
                Sign in with your institutional wallet to issue and manage blockchain degree credentials. Only authorized MVJCE
                administrators can access this portal.
              </p>

              <div className="space-y-4">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-start space-x-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-kredent-accent">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-white/85">{perk}</p>
                  </div>
                ))}
              </div>
            </div>

            <Alert variant="info" title="Security Notice">
              This portal is restricted to authorized MVJCE personnel only. All actions are recorded on the blockchain for audit
              purposes.
            </Alert>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="lg:sticky lg:top-24">
            <Card>
              <CardHeader
                title="MetaMask Authentication"
                subtitle="Connect your wallet"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!isConnected ? (
                    <motion.div
                      key="connect"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                          <svg className="h-12 w-12 text-kredent-accent" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>

                        <h3 className="mb-2 text-xl font-semibold text-gray-900">Connect MetaMask Wallet</h3>
                        <p className="mb-6 text-gray-600">Use your institutional MetaMask wallet to access the admin portal</p>

                        <Button
                          variant="accent"
                          size="lg"
                          fullWidth
                          loading={isConnecting}
                          onClick={handleConnectMetaMask}
                          icon={
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          }
                        >
                          {isConnecting ? 'Connecting…' : 'Connect MetaMask'}
                        </Button>

                        {connectError && (
                          <div className="mt-4 text-left">
                            <Alert variant="error">{connectError}</Alert>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <p className="text-center text-xs text-gray-500">
                          By connecting, you agree to the MVJCE Blockchain Terms of Service
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="connected"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                          <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>

                        <h3 className="mb-2 text-xl font-semibold text-gray-900">Wallet Connected!</h3>
                        <p className="mb-4 text-gray-600">Redirecting to admin dashboard…</p>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <p className="mb-1 text-xs text-gray-500">Connected Wallet</p>
                          <p className="break-all font-mono text-sm text-gray-800">{walletAddress}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
