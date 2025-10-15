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

/**
 * Compress image file before upload to reduce file size
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    type = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create new file from blob
            const compressedFile = new File(
              [blob], 
              file.name.replace(/\.[^/.]+$/, '.jpg'), // Change extension to jpg
              { 
                type,
                lastModified: Date.now() 
              }
            );
            
            // Log compression results
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
            const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
            
            console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB (${savings}% reduction)`);
            
            resolve(compressedFile);
          },
          type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Generate a low-quality placeholder from an image file
 * @param {File} file - Original image file
 * @returns {Promise<string>} - Data URL of placeholder
 */
export const generatePlaceholder = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Very small dimensions for placeholder
        const width = 20;
        const height = Math.round((img.height / img.width) * width);
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get data URL with low quality
        const placeholder = canvas.toDataURL('image/jpeg', 0.1);
        resolve(placeholder);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for placeholder'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Batch compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed files
 */
export const compressImages = async (files, options = {}) => {
  const compressionPromises = files.map(file => compressImage(file, options));
  return Promise.all(compressionPromises);
};

/**
 * Check if image needs compression
 * @param {File} file - Image file
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean}
 */
export const needsCompression = (file, maxSizeMB = 2) => {
  const sizeMB = file.size / 1024 / 1024;
  return sizeMB > maxSizeMB;
};
