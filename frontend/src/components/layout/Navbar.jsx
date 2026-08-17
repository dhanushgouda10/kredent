import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const topNavItems = [
  { label: 'HOME', to: '/' },
  { label: 'VERIFY DEGREE', to: '/verify' },
  { label: 'STUDENT LOGIN', to: '/login' },
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
    label: 'Verify Degree',
    to: '/verify',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Student Login',
    to: '/login',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0121 15.5c0 2.5-4 4.5-9 4.5s-9-2-9-4.5a12.083 12.083 0 012.84-4.922L12 14z" />
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
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative py-1 text-sm font-medium tracking-wide transition-colors hover:text-kredent-accent ${
                      isActive ? 'text-kredent-accent' : 'text-white/90'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-kredent-accent"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <NavLink
                to="/admin/login"
                className="bg-gradient-accent inline-block rounded-full px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Admin Login
              </NavLink>

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
