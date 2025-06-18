import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';
import ReviewManagement from '../components/ReviewManagement';
import StatsManagement from '../components/StatsManagement';
import ConfirmationModal from '../components/ConfirmationModal';
import { FaBoxOpen, FaStar, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      setShowLogoutModal(false);
      await signOut(auth);
      // User state will be automatically updated by onAuthStateChanged
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (!user) return <AdminLogin onLogin={() => {}} />;
  return (
    <div className="bg-beige min-h-screen">
      
      <div className="max-w-7xl mx-auto py-6 px-4">        <div className="bg-gradient-to-r from-charcoal to-charcoal-dark rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-beige/80 mt-2 text-sm sm:text-base">Manage your products, reviews, and statistics</p>
            </div>
            
            {/* User Info and Logout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <FaUser className="text-saffron flex-shrink-0" />
                <span className="text-sm truncate max-w-[200px] sm:max-w-none">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium min-w-0 flex-shrink-0"
                title="Logout"
              >
                <FaSignOutAlt className="flex-shrink-0" />
                <span className="whitespace-nowrap">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>        {/* Tab Navigation */}
        <div className="mb-6 bg-cornsilk rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 sm:px-6 py-3 font-medium sm:rounded-tl-lg flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base ${
                activeTab === 'products'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaBoxOpen className="flex-shrink-0" />
              <span className="hidden sm:inline">Product Management</span>
              <span className="sm:hidden">Products</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 sm:px-6 py-3 font-medium flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base ${
                activeTab === 'reviews'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaStar className="flex-shrink-0" />
              <span className="hidden sm:inline">Review Management</span>
              <span className="sm:hidden">Reviews</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 sm:px-6 py-3 font-medium sm:rounded-tr-lg flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base ${
                activeTab === 'stats'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaChartBar className="flex-shrink-0" />
              <span className="hidden sm:inline">Stats Management</span>
              <span className="sm:hidden">Stats</span>
            </button>
          </div>
        </div>
          {/* Tab Content */}
        <div className="bg-cornsilk rounded-lg shadow-md p-1">
          {activeTab === 'products' && <ProductForm />}
          {activeTab === 'reviews' && <ReviewManagement />}
          {activeTab === 'stats' && <StatsManagement />}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to enter your credentials again to access the admin panel."
        confirmText="Logout"
        cancelText="Stay Logged In"
        type="warning"
      />
    </div>
  );
};

export default Admin;
