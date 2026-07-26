import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { VerifyDegreePage } from './pages/VerifyDegreePage'
import { CertificatePage } from './pages/CertificatePage'
import { LoginSignupPage } from './pages/LoginSignupPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { IssueDegreePage } from './pages/IssueDegreePage'
import { IssuedCertificatesPage } from './pages/IssuedCertificatesPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<VerifyDegreePage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/issue-degree" replace />} />
        <Route path="issue-degree" element={<IssueDegreePage />} />
        <Route path="issued-certificates" element={<IssuedCertificatesPage />} />
      </Route>
    </Routes>
  )
}

export default App
