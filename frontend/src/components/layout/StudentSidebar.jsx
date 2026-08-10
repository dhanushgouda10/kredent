import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const links = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7m-9-9v9m0 0h6m-6 0H5a2 2 0 01-2-2v-5m14 7a2 2 0 002-2v-5" />
      </svg>
    ),
  },
  {
    to: '/student/certificates',
    label: 'My Certificates',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/student/profile',
    label: 'Profile',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function StudentSidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="flex min-h-full flex-col bg-kredent-navy px-4 py-6 text-white md:w-64 md:flex-shrink-0">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="h-9 w-9 object-contain" />
        <div>
          <p className="heading-serif text-xl leading-tight">Kredent</p>
          <p className="text-[11px] tracking-wide text-white/60">Student Portal</p>
        </div>
      </div>
      <nav className="space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-kredent-accent text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-3 pt-6">
        {user?.fullName && <p className="truncate px-2 text-xs text-white/60">Signed in as {user.fullName}</p>}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
        <div className="text-[11px] text-white/40">Kredent · MVJCE Blockchain System</div>
      </div>
    </aside>
  )
}
