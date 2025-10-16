import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';
import ReviewManagement from '../components/ReviewManagement';
import StatsManagement from '../components/StatsManagement';
import HeroManagement from '../components/HeroManagement';
import ConfirmationModal from '../components/ConfirmationModal';
import { FaBoxOpen, FaStar, FaChartBar, FaSignOutAlt, FaUser, FaImage, FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.svg';

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

  const tabs = [
    { 
      id: 'products', 
      label: 'Product Management', 
      icon: FaBoxOpen, 
      description: 'Add, edit, and manage your product catalog',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'heroes', 
      label: 'Hero Banners', 
      icon: FaImage, 
      description: 'Upload and manage homepage hero banners',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'reviews', 
      label: 'Customer Reviews', 
      icon: FaStar, 
      description: 'Moderate and manage customer reviews',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      id: 'stats', 
      label: 'Business Statistics', 
      icon: FaChartBar, 
      description: 'Update and manage business statistics',
      color: 'from-green-500 to-green-600'
    },
  ];

  if (!user) return <AdminLogin onLogin={() => {}} />;

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-beige">
      {/* Top Navigation Bar - Matching Company Theme */}
      <nav className="sticky top-0 z-50 bg-charcoal shadow-lg border-b-4 border-saffron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section - Matching Main Site */}
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Karni Exim Logo" 
                className="h-14 transform hover:scale-105 transition-transform duration-300" 
              />
              <div className="hidden sm:block border-l-2 border-saffron/30 pl-3">
                <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-saffron text-xs font-medium">Management Panel</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* User Badge */}
              <div className="hidden lg:flex items-center space-x-2 bg-charcoal-dark px-3 py-2 rounded-lg border border-saffron/20">
                <div className="bg-saffron p-1.5 rounded-full">
                  <FaUser className="text-charcoal text-xs" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Admin</p>
                  <p className="text-white text-xs font-semibold truncate max-w-[150px]">{user?.email?.split('@')[0]}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-md"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-saffron p-2 rounded-lg">
              <FaShieldAlt className="text-charcoal text-xl" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">Welcome Back!</h2>
              <p className="text-gray-600 text-sm">Manage your store from one centralized dashboard</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Company Style */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-4 py-4 sm:py-5 transition-all duration-200
                    flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-3
                    ${isActive 
                      ? 'bg-charcoal text-white shadow-inner' 
                      : 'text-charcoal hover:bg-saffron/10 hover:text-charcoal'
                    }
                  `}
                >
                  {/* Active Border Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-saffron"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    ${isActive ? 'text-saffron' : 'text-gray-400'}
                    transition-colors duration-200
                  `}>
                    <Icon className="text-xl sm:text-2xl" />
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    text-xs sm:text-sm font-semibold text-center sm:text-left
                    ${isActive ? 'text-white' : 'text-charcoal'}
                  `}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-charcoal to-charcoal-dark px-4 sm:px-6 py-4 border-b-2 border-saffron">
            <div className="flex items-center space-x-3">
              <div className="bg-saffron p-2 sm:p-2.5 rounded-lg">
                {currentTab && <currentTab.icon className="text-charcoal text-lg sm:text-xl" />}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {currentTab?.label}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                  {currentTab?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-4 sm:p-6 bg-cornsilk/30">
            {activeTab === 'products' && <ProductForm />}
            {activeTab === 'heroes' && <HeroManagement />}
            {activeTab === 'reviews' && <ReviewManagement />}
            {activeTab === 'stats' && <StatsManagement />}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center pb-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            <span className="font-semibold text-charcoal">Karni Exim</span> Admin Panel • 
            <span className="text-saffron font-medium"> Secure & Encrypted</span>
          </p>
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
