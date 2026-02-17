import React, { useState } from 'react'
import Login from './Components/Pages/Login'
import Dashboard from './Components/Pages/Dashboard'
import Sidebar from './Components/Common/Sidebar'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
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

  return (
    <div className="h-screen w-screen">
      {isLoggedIn ? (
        <AuthenticatedLayout>
          <Dashboard onLogout={handleLogout} sidebarOpen={sidebarOpen} />
        </AuthenticatedLayout>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
