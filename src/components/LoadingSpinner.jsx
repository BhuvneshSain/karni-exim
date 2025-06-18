import { memo } from 'react';
import { ANIMATION_CONFIG } from '../config/animations';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  text = null,
  fullScreen = false,
  priority = 'medium' // Add priority to control when to show
}) => {
  const sizeClass = ANIMATION_CONFIG.loading.sizes[size];
  const colorClass = ANIMATION_CONFIG.loading.colors[color];
  
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-6'; // Reduced padding
  
  // Don't show low priority loaders if reduced motion is preferred
  if (ANIMATION_CONFIG.reduceMotion.enabled && priority === 'low') {
    return null;
  }
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`${sizeClass} border-4 ${colorClass} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-3 text-charcoal font-medium text-sm"> {/* Reduced text size and margin */}
          {text}
        </p>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(LoadingSpinner);
