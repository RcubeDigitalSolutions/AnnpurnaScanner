import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import AdminLogin from './Components/Pages/Login'
import AdminRegister from './Components/Pages/Register'
import ForgotPassword from './Components/Pages/ForgotPassword'
import Restaurant from './Components/Pages/Restaurant'
import PaymentHistory from './Components/Pages/PaymentHistory'
import Sidebar from './Components/Common/Sidebar'
import PrivateRoute from './Components/Common/PrivateRoute'

// Layout component with Sidebar
const SidebarLayout = () => {
  const [activeTab, setActiveTab] = React.useState('members');

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet context={{ activeTab, setActiveTab }} />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes with Sidebar (wrapped by PrivateRoute) */}
        <Route element={<PrivateRoute><SidebarLayout /></PrivateRoute>}>
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
