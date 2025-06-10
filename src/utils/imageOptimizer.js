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
