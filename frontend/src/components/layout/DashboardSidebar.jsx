import { NavLink } from 'react-router-dom'

const links = [
  {
    to: '/admin/students',
    label: 'Students',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/issue-degree',
    label: 'Issue Degree',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/admin/issued-certificates',
    label: 'Issued Certificates',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h3m-7 5h10a2 2 0 002-2V7a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H8a2 2 0 00-2 2v13a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export function DashboardSidebar() {
  return (
    <aside className="flex min-h-full flex-col bg-kredent-navy px-4 py-6 text-white md:w-64 md:flex-shrink-0">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src="/MVJCE_-_New_Logo.png" alt="Kredent logo" className="h-9 w-9 object-contain" />
        <div>
          <p className="heading-serif text-xl leading-tight">Kredent</p>
          <p className="text-[11px] tracking-wide text-white/60">Admin Portal</p>
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
      <div className="mt-auto pt-6 text-[11px] text-white/40">Kredent · MVJCE Blockchain System</div>
    </aside>
  )
}
