import { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaClock, FaShieldAlt } from 'react-icons/fa';

const AdminHeader = ({ user, onLogout, isLoggingOut }) => {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-gradient-to-r from-charcoal to-charcoal-dark rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-beige/80 mt-2">
            {getTimeBasedGreeting()}, manage your products, reviews, and statistics
          </p>
        </div>
        
        {/* Admin User Info Panel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 lg:mt-0">
          {/* Session Info */}
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <FaClock className="text-saffron" />
              <span>Session: {formatSessionTime(sessionTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>Authenticated</span>
            </div>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-2 rounded-lg">
              <FaUser className="text-saffron" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-white/60">Administrator</span>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
              title="Logout from admin panel"
            >
              <FaSignOutAlt className={isLoggingOut ? 'animate-spin' : ''} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
