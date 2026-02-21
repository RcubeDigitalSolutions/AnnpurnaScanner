import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, UtensilsCrossed, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (validateEmail()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Password reset link sent to:", email);
        setSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {/* Glow Effect Background */}
        <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Success Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Check Your Email</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">We've sent a password reset link to:</p>
            <p className="text-orange-500 font-medium mt-2">{email}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
            <p className="text-slate-300 text-sm">
              Please check your email inbox and click the reset link to create a new password. The link will expire in 24 hours.
            </p>
          </div>

          {/* Back to Login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>

          {/* Resend Option */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Didn't receive an email?{' '}
            <button 
              onClick={() => setSuccess(false)}
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Try Again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Glow Effect Background */}
      <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Team Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800 border ${
                  error ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                placeholder="dev@restaurant.com"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <p className="text-xs text-slate-400 text-center">
            We'll send you a secure link to reset your password.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 transform transition active:scale-[0.98]"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full flex items-center justify-center gap-2 text-orange-500 hover:text-orange-400 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
