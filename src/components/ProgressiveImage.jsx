import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressiveImage Component
 * 
 * Shows a low-quality placeholder with blur effect while loading the full image
 * Provides smooth transition and better perceived performance
 * 
 * @param {string} src - Full quality image URL
 * @param {string} placeholder - Low quality placeholder URL (optional, uses blur if not provided)
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {string} loading - Native loading attribute (lazy/eager)
 * @param {string} fetchPriority - Fetch priority (high/low/auto)
 * @param {object} itemProp - Schema.org microdata property
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback on error
 */
const ProgressiveImage = ({
  src,
  placeholder,
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  itemProp,
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Create a new image to preload
    const img = new Image();
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (onError) onError();
    };
    
    // Start loading the full image
    img.src = src;
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  return (
    <div className="relative overflow-hidden w-full h-full bg-gray-100">
      {/* Loading skeleton with shimmer animation */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200"
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        >
          {/* Loading spinner overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <svg 
                className="animate-spin h-10 w-10 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-gray-500 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Blur placeholder (if provided) */}
      {isLoading && placeholder && (
        <motion.img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={`${className} absolute inset-0 opacity-50`}
          style={{
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
          initial={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Main image */}
      <motion.img
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        itemProp={itemProp}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <svg 
              className="w-12 h-12 mx-auto text-gray-400 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm text-gray-500">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
