import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { StudentLayout } from './components/layout/StudentLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { VerifyDegreePage } from './pages/VerifyDegreePage'
import { CertificatePage } from './pages/CertificatePage'
import { LoginSignupPage } from './pages/LoginSignupPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { IssueDegreePage } from './pages/IssueDegreePage'
import { IssuedCertificatesPage } from './pages/IssuedCertificatesPage'
import { StudentDashboardPage } from './pages/student/StudentDashboardPage'
import { MyCertificatesPage } from './pages/student/MyCertificatesPage'
import { StudentCertificateDetailPage } from './pages/student/StudentCertificateDetailPage'
import { StudentProfilePage } from './pages/student/StudentProfilePage'

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
      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="certificates" element={<MyCertificatesPage />} />
        <Route path="certificates/:id" element={<StudentCertificateDetailPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
