import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const topNavItems = [
  { label: 'HOME', to: '/' },
  { label: 'ABOUT KREDENT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
  { label: 'VERIFY DEGREE', to: '/verify' },
  { label: 'VIEW CERTIFICATE', to: '/certificate' },
]

const sideMenuItems = [
  {
    label: 'Home',
    to: '/',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7m-9-9v9m0 0h6m-6 0H5a2 2 0 01-2-2v-5m14 7a2 2 0 002-2v-5" />
      </svg>
    ),
  },
  {
    label: 'About Kredent',
    to: '/about',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Verify Degree',
    to: '/verify',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'View Certificate',
    to: '/certificate',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Admin Login',
    to: '/admin/login',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

const settingsItems = [
  {
    label: 'Settings',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Notifications',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    label: 'Help & Support',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 17h.008v.008H12V17z" />
      </svg>
    ),
  },
]

export function Navbar() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSideMenu = () => setIsSideMenuOpen((v) => !v)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSideMenuOpen(false)
    }
  }

  const handleLoginSignup = () => {
    navigate('/login')
    setIsSideMenuOpen(false)
  }

  return (
    <header className="relative z-50">
      {/* Desktop / tablet header — curved brand shape, unchanged design, just no longer overflowing below lg */}
      <div className="relative hidden lg:block">
        <div className="absolute left-0 top-0 z-10 bg-white px-5 py-4 lg:px-10">
          <div className="flex items-center">
            <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="mr-4 h-16 w-16 object-contain" />
            <div>
              <p className="font-serif text-2xl font-bold text-gray-900">KREDENT</p>
              <p className="text-xs tracking-wider text-gray-600">MVJCE BLOCKCHAIN VERIFICATION</p>
            </div>
          </div>
        </div>

        <div className="relative bg-kredent-navy text-white" style={{ marginLeft: '320px' }}>
          <svg className="absolute left-0 top-0 -ml-[320px]" width="320" height="100%" viewBox="0 0 320 80" preserveAspectRatio="none">
            <path d="M 0 0 L 320 0 L 320 80 Q 240 80 160 80 Q 80 80 0 40 Z" fill="var(--color-kredent-navy)" />
          </svg>

          <div className="relative z-10 flex items-center justify-between px-5 py-4 lg:px-10">
            <nav className="ml-auto mr-8 flex items-center gap-8">
              {topNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded text-sm font-medium transition hover:text-kredent-accent ${isActive ? 'text-kredent-accent' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <NavLink
                to="/admin/login"
                className="inline-block rounded-full bg-kredent-accent px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-kredent-accent-dark hover:shadow-xl"
              >
                Admin Login
              </NavLink>

              <button
                aria-label="Search"
                className="rounded-full p-2 transition hover:bg-white/10 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={toggleSideMenu}
                aria-label="Open menu"
                aria-expanded={isSideMenuOpen}
                className="rounded-full p-2 transition hover:bg-white/10 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / small-tablet header — simplified single bar, same brand colors */}
      <div className="flex items-center justify-between bg-kredent-navy px-4 py-3 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="h-10 w-10 object-contain" />
          <div>
            <p className="font-serif text-lg font-bold leading-tight">KREDENT</p>
            <p className="text-[10px] tracking-wider text-white/70">BLOCKCHAIN VERIFICATION</p>
          </div>
        </div>
        <button
          onClick={toggleSideMenu}
          aria-label="Open menu"
          aria-expanded={isSideMenuOpen}
          className="rounded-full p-2 transition hover:bg-white/10 active:scale-95"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Thin divider row under the desktop header, kept for the original layout rhythm */}
      <div className="hidden border-b border-gray-200 bg-white shadow-sm lg:block">
        <div className="mx-auto max-w-[1200px] px-5 py-3 lg:px-10" />
      </div>

      {/* Side Menu */}
      <AnimatePresence>
        {isSideMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 h-full w-full max-w-xs overflow-y-auto bg-white shadow-2xl sm:w-80"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="bg-gradient-to-r from-kredent-navy to-kredent-navy-deep p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="h-10 w-10 object-contain" />
                    <div>
                      <h2 className="text-xl font-bold">KREDENT</h2>
                      <p className="text-sm text-white/80">Menu</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSideMenu}
                    aria-label="Close menu"
                    className="rounded-full p-2 transition hover:bg-white/20"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-1">
                  {sideMenuItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsSideMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 rounded-lg px-4 py-3 transition ${
                          isActive ? 'bg-kredent-navy text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="my-6 border-t border-gray-200" />

                <div className="space-y-1">
                  {settingsItems.map((item) => (
                    <button
                      key={item.label}
                      className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100"
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="my-6 border-t border-gray-200" />

                <div className="space-y-3">
                  <button
                    onClick={handleLoginSignup}
                    className="w-full rounded-lg bg-kredent-navy px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-kredent-navy-dark hover:shadow-lg"
                  >
                    Login / Sign Up
                  </button>
                </div>

                <div className="mt-8 rounded-lg bg-gray-50 p-4">
                  <p className="text-center text-xs text-gray-600">
                    © 2026 MVJCE Kredent
                    <br />
                    Blockchain Verification System
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
