import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from './DashboardSidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <main className="flex-1 bg-[#f4f6fb] p-4 sm:p-6 md:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
