import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { listPublicDepartments, loginStudent, registerStudent } from '../services/authService'
import { useAuth } from '../context/useAuth'
import { Alert, Button, Input, PasswordInput, Select } from '../components/ui'

export function LoginSignupPage() {
  const [activeTab, setActiveTab] = useState('register')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [departments, setDepartments] = useState([])
  const [departmentsError, setDepartmentsError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    mobile: '',
    department: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    let cancelled = false
    listPublicDepartments()
      .then((list) => {
        if (!cancelled) setDepartments(list)
      })
      .catch((err) => {
        if (!cancelled) setDepartmentsError(err.message || 'Could not load departments')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormError(null)
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (activeTab === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match.')
        return
      }
      setSubmitting(true)
      try {
        await registerStudent({
          fullName: formData.name.trim(),
          usn: formData.usn.trim(),
          email: formData.email.trim(),
          phone: formData.mobile.trim(),
          department: formData.department,
          password: formData.password,
        })
        setActiveTab('login')
        setFormError(null)
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }))
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Registration failed.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    setSubmitting(true)
    try {
      const authResponse = await loginStudent({
        email: formData.email.trim(),
        password: formData.password,
      })
      login(authResponse)
      navigate('/student/dashboard')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex items-center justify-center">
            <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="mr-4 h-16 w-16 object-contain sm:h-20 sm:w-20" />
            <div className="text-left">
              <h1 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">KREDENT</h1>
              <p className="text-xs tracking-wider text-gray-600 sm:text-sm">MVJCE STUDENT PORTAL</p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormError(null)
                setActiveTab('register')
              }}
              className={`flex-1 py-4 text-center font-semibold transition-colors duration-200 ${
                activeTab === 'register' ? 'bg-kredent-accent text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                setFormError(null)
                setActiveTab('login')
              }}
              className={`flex-1 py-4 text-center font-semibold transition-colors duration-200 ${
                activeTab === 'login' ? 'bg-kredent-accent text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
          </div>

          {/* Form Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' ? (
                <>
                  <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" />

                  <Input
                    label="USN"
                    name="usn"
                    value={formData.usn}
                    onChange={handleInputChange}
                    required
                    className="uppercase"
                    placeholder="e.g. 1MJ21CS001"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />

                  <Input
                    label="Mobile Number"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter mobile number"
                  />

                  <Select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    disabled={departments.length === 0 && !departmentsError}
                    hint={departmentsError ? 'Could not load departments — please refresh.' : undefined}
                  >
                    <option value="">{departments.length === 0 && !departmentsError ? 'Loading departments…' : 'Select Department'}</option>
                    {departments.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.code} — {dept.label}
                      </option>
                    ))}
                  </Select>

                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter password"
                  />

                  <PasswordInput
                    label="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Re-enter password"
                  />

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-kredent-accent focus:ring-kredent-accent"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      I agree to receive information from Kredent and I accept the Terms &amp; Conditions
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />

                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                </>
              )}

              {formError && <Alert variant="error">{formError}</Alert>}

              <Button type="submit" variant="accent" fullWidth loading={submitting} size="lg">
                {submitting ? 'Please wait…' : activeTab === 'register' ? 'Register' : 'Login'}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center rounded text-gray-600 transition hover:text-kredent-accent">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
