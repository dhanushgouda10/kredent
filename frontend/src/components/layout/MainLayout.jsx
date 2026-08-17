import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTopButton } from '../ui/ScrollToTopButton'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
