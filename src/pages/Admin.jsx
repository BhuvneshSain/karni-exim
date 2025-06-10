import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';

const Admin = () => {  const [user, setUser] = useState(null);  const [showAdminGuide, setShowAdminGuide] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <AdminLogin onLogin={() => {}} />;

  return (
    <div className="bg-gray-50 min-h-screen">

      {showAdminGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-blue-800">Karni Exim Admin Guide</h3>
              <button 
                onClick={() => setShowAdminGuide(false)} 
                className="text-gray-600 hover:text-gray-800 text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="mb-4">
                <p className="text-gray-700">
                  Welcome to the Karni Exim admin guide! This comprehensive document will help you manage your e-commerce website effectively.
                </p>
              </div>
                <div className="mb-6">
                <h4 className="text-lg font-bold mb-2">Quick Links:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a href="/admin-guide.md" target="_blank" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
                    📝 View Full Admin Guide
                  </a>
                  <a href="mailto:support@karniexim.com" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
                    🆘 Contact Support
                  </a>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-2">Key Features:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Product Management (add, edit, delete products)</li>
                  <li>Hero Section Management</li>
                  <li>Best Seller Designation</li>
                  <li>Image Optimization Tools</li>
                  <li>Debugging Tools</li>
                </ul>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a 
                  href="/admin-guide.md" 
                  target="_blank"
                  className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                >
                  Open Full Admin Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100 mt-2">Manage your products and website content</p>            <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => setShowAdminGuide(true)}
              className="bg-white hover:bg-blue-50 text-blue-800 px-4 py-2 rounded-md font-medium transition flex items-center gap-2"
            >
              <span>📚</span> Admin Guide
            </button>
          </div>
        </div>
        
        <ProductForm />
      </div>
    </div>
  );
};

export default Admin;
