import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { adminLogin } from '../../api/adminApi';
import Toast from '../Common/Toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await adminLogin(formData);
        const accessToken = res.data.accessToken;
        if (accessToken) localStorage.setItem('token', accessToken);
        setToast({ message: 'Login successful', type: 'success' });
        setTimeout(() => navigate('/restaurant'), 600);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Login failed';
        setToast({ message: msg, type: 'error' });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Glow Effect Background */}
      <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Restaurant CMS Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Team Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="dev@restaurant.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500" />
              <span className="text-sm text-slate-400">Stay signed in</span>
            </label>
            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium text-orange-500 hover:text-orange-400"
            >
              Forget Password
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 transform transition active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-slate-400">
          New to our platform?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-orange-500 hover:text-orange-400 font-medium"
          >
            Create Account
          </button>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Authorized Team Access Only. All actions are logged.
        </p>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminLogin;