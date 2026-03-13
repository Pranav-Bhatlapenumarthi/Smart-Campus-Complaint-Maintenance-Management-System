import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import TechnicianDashboard from './pages/TechnicianDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintDetail from './pages/ComplaintDetail'

// Components
import PrivateRoute from './components/PrivateRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardRouter />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/complaint/new"
        element={
          <PrivateRoute roles={['student', 'faculty']}>
            <ComplaintForm />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/complaint/:id"
        element={
          <PrivateRoute>
            <ComplaintDetail />
          </PrivateRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

// Dashboard router based on user role
const DashboardRouter = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  switch (user.role) {
    case 'student':
    case 'faculty':
      return <StudentDashboard />
    case 'technician':
      return <TechnicianDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <Navigate to="/login" replace />
  }
}

export default App
