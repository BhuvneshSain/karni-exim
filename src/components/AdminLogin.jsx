import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaShieldAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/logo.svg';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // Tell parent that user is logged in
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 bg-charcoal shadow-lg border-b-4 border-saffron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Karni Exim Logo" 
                className="h-14 transform hover:scale-105 transition-transform duration-300" 
              />
              <div className="hidden sm:block border-l-2 border-saffron/30 pl-3">
                <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
                <p className="text-saffron text-xs font-medium">Secure Login</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center space-x-2 bg-charcoal-dark px-3 py-2 rounded-lg border border-saffron/20">
              <div className="bg-saffron p-1.5 rounded-full">
                <FaShieldAlt className="text-charcoal text-sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Secure</p>
                <p className="text-white text-xs font-semibold">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-charcoal to-charcoal-dark px-6 py-8 text-center">
              <div className="inline-block bg-saffron p-4 rounded-full mb-4">
                <FaLock className="text-charcoal text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
              <p className="text-gray-300 text-sm">Enter your credentials to access the admin panel</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@karniexim.com"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-charcoal to-charcoal-dark hover:from-charcoal-dark hover:to-charcoal text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    <span>Login to Admin Panel</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-charcoal">Karni Exim</span> Admin Portal • 
              <span className="text-saffron font-medium"> Secure & Encrypted</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
