import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './Components/Dashboard/Pages/Login'
import Dashboard from './Components/Dashboard/Pages/Dashboard'
import MenuItems from './Components/Dashboard/Pages/MenuItems'
import Settings from './Components/Dashboard/Pages/Settings'
import Sidebar from './Components/Common/Sidebar'
import Menu from './Components/UserMenu/Pages/Menu'

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
    <div className="h-screen w-screen overflow-hidden relative bg-slate-50">
      <Sidebar onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`h-full overflow-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
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

      {/* Menu Items Route */}
      <Route 
        path="/admin/menu" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MenuItems />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* Settings Route */}
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Settings />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* Default Route - Redirect to login or admin based on auth status */}
      <Route 
        path="/" 
        element={
       
          
              <Menu />
           
        }
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
