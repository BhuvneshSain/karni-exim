import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';
import ReviewManagement from '../components/ReviewManagement';
import StatsManagement from '../components/StatsManagement';
import { FaBoxOpen, FaStar, FaChartBar } from 'react-icons/fa';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <AdminLogin onLogin={() => {}} />;
  return (
    <div className="bg-beige min-h-screen">
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-gradient-to-r from-charcoal to-charcoal-dark rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-beige/80 mt-2">Manage your products, reviews, and statistics</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-cornsilk rounded-lg shadow-md">
          <div className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-medium rounded-tl-lg flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaBoxOpen /> Product Management
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaStar /> Review Management
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-medium rounded-tr-lg flex items-center gap-2 ${
                activeTab === 'stats'
                  ? 'bg-charcoal text-white'
                  : 'text-charcoal hover:bg-saffron/10'
              }`}
            >
              <FaChartBar /> Stats Management
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
    </div>
  );
};

export default Admin;
