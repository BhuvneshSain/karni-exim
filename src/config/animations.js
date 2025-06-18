// Global animation and loading configuration
export const ANIMATION_CONFIG = {
  // Loading spinner settings
  loading: {
    defaultDuration: 0.8, // Reduced from longer delays
    sizes: {
      sm: 'w-6 h-6',
      md: 'w-10 h-10', // Reduced from w-12 h-12
      lg: 'w-12 h-12', // Reduced from w-16 h-16
      xl: 'w-16 h-16'
    },
    colors: {
      primary: 'border-saffron',
      secondary: 'border-charcoal',
      accent: 'border-blue-500'
    }
  },
  
  // Page transition settings
  transitions: {
    fast: { duration: 0.2 },
    normal: { duration: 0.3 },
    slow: { duration: 0.5 }
  },
  
  // Reduced animation delays for better performance
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15
  },
  
  // Disable animations on slow devices
  reduceMotion: {
    enabled: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
};

// Helper function to get optimized animation props
export const getAnimationProps = (type = 'normal') => {
  if (ANIMATION_CONFIG.reduceMotion.enabled) {
    return { transition: { duration: 0 } };
  }
  
  return {
    transition: ANIMATION_CONFIG.transitions[type] || ANIMATION_CONFIG.transitions.normal
  };
};

// Loading state optimization
export const LOADING_PRIORITIES = {
  critical: 1,    // Must show (user navigation, form submission)
  high: 2,        // Important (main content loading)
  medium: 3,      // Secondary (stats, reviews)
  low: 4          // Optional (background updates)
};
