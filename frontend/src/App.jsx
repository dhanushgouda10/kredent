import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { StudentLayout } from './components/layout/StudentLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { VerifyDegreePage } from './pages/VerifyDegreePage'
import { VerifyResultPage } from './pages/VerifyResultPage'
import { LoginSignupPage } from './pages/LoginSignupPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminStudentsPage } from './pages/AdminStudentsPage'
import { IssueDegreePage } from './pages/IssueDegreePage'
import { IssuedCertificatesPage } from './pages/IssuedCertificatesPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { StudentDashboardPage } from './pages/student/StudentDashboardPage'
import { MyCertificatesPage } from './pages/student/MyCertificatesPage'
import { StudentCertificateDetailPage } from './pages/student/StudentCertificateDetailPage'
import { StudentProfilePage } from './pages/student/StudentProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<VerifyDegreePage />} />
        <Route path="/verify/:certificateNumber" element={<VerifyResultPage />} />
        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
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
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="issue-degree" element={<IssueDegreePage />} />
        <Route path="issued-certificates" element={<IssuedCertificatesPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
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
