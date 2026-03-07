import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './Components/Dashboard/Pages/Login'
import Dashboard from './Components/Dashboard/Pages/Dashboard'
import MenuItems from './Components/Dashboard/Pages/MenuItems'
import Orders from './Components/Dashboard/Pages/Orders'
import Feedback from './Components/Dashboard/Pages/Feedback'
import Settings from './Components/Dashboard/Pages/Settings'
import Sidebar from './Components/Common/Sidebar'
import Menu from './Components/UserMenu/Pages/Menu'
import FloorPlanPage from './Components/Dashboard/Pages/FloorPlan'
import { restaurantLogout, refreshToken } from './api/restaurantApi'
import ToastContainer from './Components/Common/ToastContainer'
import PlanExpiredModal from './Components/Common/PlanExpiredModal'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  return (
    <Router>
      <ToastContainer />
      <PlanExpiredModal />
      <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} authChecked={authChecked} setAuthChecked={setAuthChecked} />
    </Router>
  )
}

const AppRoutes = ({ isLoggedIn, setIsLoggedIn, authChecked, setAuthChecked }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    setIsLoggedIn(true)
    navigate('/admin/dashboard')
  }

  // attempt to refresh access token on app load if no local token
  React.useEffect(() => {
    let mounted = true;
    const init = async () => {
      // Customer menu routes must stay public and should never force login.
      if (location.pathname.startsWith('/menu/')) {
        if (mounted) {
          setIsLoggedIn(false);
          setAuthChecked(true);
        }
        return;
      }

      const token = localStorage.getItem('token');
      if (token) {
        if (mounted) {
          setIsLoggedIn(true);
          setAuthChecked(true);
        }
        return;
      }
      try {
        const res = await refreshToken();
        const at = res.data && res.data.accessToken;
        if (at) {
          localStorage.setItem('token', at);
          if (mounted) setIsLoggedIn(true);
        } else {
          if (mounted) setIsLoggedIn(false);
        }
      } catch (e) {
        if (mounted) setIsLoggedIn(false);
      } finally {
        if (mounted) setAuthChecked(true);
      }
    };
    init();
    return () => { mounted = false };
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await restaurantLogout();
    } catch (err) {
      // ignore errors, still clear client state
    }
    localStorage.removeItem('token');
    setIsLoggedIn(false)
    navigate('/login')
  }

  // Layout wrapper for authenticated pages with sidebar
  const AuthenticatedLayout = ({ children }) => (
    <div className="h-screen w-screen overflow-hidden relative bg-[#ece8e7]">
      <Sidebar onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-60' : 'ml-20'
        }`}
        style={{ width: sidebarOpen ? 'calc(100% - 15rem)' : 'calc(100% - 5rem)' }}
      >
        {children}
      </main>
    </div>
  )

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!authChecked) {
      return <></>
    }
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

      {/* Orders Route */}
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Orders />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />

      {/* Feedback Route */}
      <Route 
        path="/admin/feedback" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Feedback />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/floorplan" 
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <FloorPlanPage />
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

      {/* Public menu route (restaurant guest) */}
      <Route path="/menu/:restaurantId/:tableNumber" element={<Menu />} />

      {/* Default Route - send user to login (not the menu) */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Catch all - redirect to home (wait until auth check completes) */}
      <Route 
        path="*" 
        element={authChecked ? <Navigate to={isLoggedIn ? "/admin/dashboard" : "/login"} replace /> : <></>} 
      />
    </Routes>
  )
}

export default App
