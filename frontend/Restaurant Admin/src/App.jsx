import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './Components/Pages/Login'
import Dashboard from './Components/Pages/Dashboard'
import Sidebar from './Components/Common/Sidebar'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Router>
      <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  )
}

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    setIsLoggedIn(true)
    navigate('/admin/dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/login')
  }

  // Layout wrapper for authenticated pages with sidebar
  const AuthenticatedLayout = ({ children }) => (
    <div className="relative h-screen w-screen overflow-hidden">
      <Sidebar onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`absolute inset-0 overflow-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'left-64' : 'left-20'}`}>
        {children}
      </main>
    </div>
  )

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Routes>
      {/* Login Route - Always shows login page */}
      <Route 
        path="/login" 
        element={<Login onLogin={handleLogin} />} 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard onLogout={handleLogout} sidebarOpen={sidebarOpen} />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* Admin Dashboard Route - Direct dashboard page with sidebar */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Dashboard onLogout={handleLogout} sidebarOpen={sidebarOpen} />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* Default Route - Redirect to login or admin based on auth status */}
      <Route 
        path="/" 
        element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/login"} replace />} 
      />

      {/* Catch all - redirect to home */}
      <Route 
        path="*" 
        element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/login"} replace />} 
      />
    </Routes>
  )
}

export default App
