// Simple utility for image optimization handling
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return getImagePlaceholder(options.type || 'product');
  
  // Firebase Storage URLs can be modified for optimization
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    // Get image width based on options or device
    // Using a safe check for window to avoid SSR issues
    const isBrowser = typeof window !== 'undefined';
    const width = options.width || (isBrowser && window.innerWidth <= 768 ? 800 : 1920);
    
    // Check if URL has parameters already
    const hasParams = imageUrl.includes('?');
    const connector = hasParams ? '&' : '?';
    
    // Add width parameter for Firebase images (works if Firebase Storage is set up for image processing)
    // This is more of a future-proofing as standard Firebase Storage doesn't handle this
    return `${imageUrl}${connector}width=${width}`;
  }
  
  // For Cloudinary integration (if implemented in the future)
  if (imageUrl.includes('cloudinary.com')) {
    const width = options.width || 'auto';
    const quality = options.quality || 'auto';
    const format = options.format || 'auto';
    
    // Replace URL parts to add optimization parameters
    return imageUrl.replace('/upload/', `/upload/w_${width},q_${quality},f_${format}/`);
  }
  
  return imageUrl;
};

export const validateImageDimensions = async (file, minWidth = 1200, minHeight = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const validDimensions = img.width >= minWidth && img.height >= minHeight;
        resolve({
          width: img.width,
          height: img.height,
          isValid: validDimensions,
          aspectRatio: img.width / img.height,
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getImagePlaceholder = (type = 'hero') => {
  const placeholders = {
    hero: '/hero-pattern.svg',
    product: '/product-placeholder.png',
    thumbnail: '/thumbnail-placeholder.png',
  };
  
  return placeholders[type] || placeholders.product;
};

// New utility functions for image optimization

/**
 * Creates an optimized image component props for better loading performance
 * @param {string} src - Image source URL
 * @param {Object} options - Configuration options
 * @returns {Object} - Props for image element
 */
export const getOptimizedImageProps = (src, options = {}) => {
  const optimizedSrc = getOptimizedImageUrl(src, options);
  const placeholder = getImagePlaceholder(options.type || 'product');
  
  return {
    src: optimizedSrc,
    loading: "lazy", // Native lazy loading
    decoding: "async", // Async decoding
    onError: (e) => { e.target.src = placeholder; },
    alt: options.alt || "Product image",
    width: options.displayWidth,
    height: options.displayHeight,
    className: options.className || "w-full h-auto object-cover"
  };
};

/**
 * Calculate the correct image size based on viewport and container
 * @param {string} breakpoint - Breakpoint identifier (sm, md, lg, xl)
 * @returns {number} - Recommended image width
 */
export const getResponsiveImageSize = (breakpoint = 'md') => {
  const sizes = {
    xs: 350,   // Extra small screens
    sm: 640,   // Small screens
    md: 768,   // Medium screens
    lg: 1024,  // Large screens
    xl: 1280   // Extra large screens
  };
  
  return sizes[breakpoint] || sizes.md;
};

/**
 * Creates a srcset string for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Array} widths - Array of widths to include
 * @returns {string} - Formatted srcset attribute value
 */
export const createSrcSet = (baseUrl, widths = [640, 768, 1024, 1280]) => {
  if (!baseUrl) return "";
  
  // For Firebase Storage or Cloudinary, we can append width parameters
  if (baseUrl.includes('firebasestorage.googleapis.com') || baseUrl.includes('cloudinary.com')) {
    const hasParams = baseUrl.includes('?');
    const connector = hasParams ? '&' : '?';
    
    return widths.map(width => 
      `${baseUrl}${connector}width=${width} ${width}w`
    ).join(', ');
  }
  
  // For regular URLs, we cannot modify the image dynamically
  return baseUrl;
};
