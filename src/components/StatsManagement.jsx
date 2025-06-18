import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { motion } from 'framer-motion';
import { FaChartLine, FaSave, FaUndo } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const StatsManagement = () => {
  const [stats, setStats] = useState({
    products: 3000,
    years: 43,
    clients: 600000,
    satisfaction: 100
  });
  const [initialStats, setInitialStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  useEffect(() => {
    // Check for changes to determine if the save button should be enabled
    if (Object.keys(initialStats).length > 0) {
      const changed = JSON.stringify(stats) !== JSON.stringify(initialStats);
      setHasChanges(changed);
    }
  }, [stats, initialStats]);
  
  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsDoc = await getDoc(doc(db, "settings", "stats"));
      
      if (statsDoc.exists()) {
        const statsData = statsDoc.data();
        setStats(statsData);
        setInitialStats(statsData);
      } else {
        // If no stats document exists, create one with default values
        await setDoc(doc(db, "settings", "stats"), stats);
        setInitialStats({...stats});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (field, value) => {
    // Ensure value is a number
    const numValue = parseInt(value, 10) || 0;
    setStats(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const saveStats = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "settings", "stats"), stats);
      setInitialStats({...stats});
      alert("Statistics updated successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating stats:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  const resetChanges = () => {
    setStats({...initialStats});
    setHasChanges(false);
  };
  if (loading) {
    return <LoadingSpinner text="Loading statistics..." />;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Statistics Management</h2>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={resetChanges}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center gap-2"
              title="Discard Changes"
            >
              <FaUndo /> Reset
            </button>
          )}
          <button
            onClick={saveStats}
            disabled={!hasChanges || saving}
            className={`${hasChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded flex items-center gap-2`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <p className="text-gray-600 mb-6">
          These statistics are displayed on the home page in the animated counter section.
          Update them to reflect your current business metrics.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Products</label>
            <div className="flex">
              <input
                type="number"
                value={stats.products}
                onChange={(e) => handleChange('products', e.target.value)}
                className="w-full border border-gray-300 rounded-l px-3 py-2"
                min="0"
              />
              <span className="bg-gray-100 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r flex items-center">
                <FaChartLine className="text-blue-500" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Displayed as "{stats.products.toLocaleString()}+" on the home page
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
            <div className="flex">
              <input
                type="number"
                value={stats.years}
                onChange={(e) => handleChange('years', e.target.value)}
                className="w-full border border-gray-300 rounded-l px-3 py-2"
                min="0"
              />
              <span className="bg-gray-100 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r flex items-center">
                <FaChartLine className="text-blue-500" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Displayed as "{stats.years}+" on the home page
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satisfied Clients</label>
            <div className="flex">
              <input
                type="number"
                value={stats.clients}
                onChange={(e) => handleChange('clients', e.target.value)}
                className="w-full border border-gray-300 rounded-l px-3 py-2"
                min="0"
              />
              <span className="bg-gray-100 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r flex items-center">
                <FaChartLine className="text-blue-500" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Displayed as "{stats.clients.toLocaleString()}+" on the home page
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satisfaction Rate (%)</label>
            <div className="flex">
              <input
                type="number"
                value={stats.satisfaction}
                onChange={(e) => handleChange('satisfaction', e.target.value)}
                className="w-full border border-gray-300 rounded-l px-3 py-2"
                min="0"
                max="100"
              />
              <span className="bg-gray-100 px-3 py-2 border-t border-r border-b border-gray-300 rounded-r flex items-center">
                <FaChartLine className="text-blue-500" />
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Displayed as "{stats.satisfaction}%" on the home page
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-blue-800 font-semibold mb-2">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.products.toLocaleString()}+</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.years}+</p>
              <p className="text-sm text-gray-600">Years</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.clients.toLocaleString()}+</p>
              <p className="text-sm text-gray-600">Clients</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-700">{stats.satisfaction}%</p>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsManagement;
