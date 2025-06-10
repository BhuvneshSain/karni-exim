/**
 * optimizeImages.js
 * 
 * This script provides functions to optimize images on the website
 * It's designed to be run in the browser and automatically optimize images
 */

/**
 * Auto-optimize all images on the page
 * This function can be run in the browser console to immediately improve performance
 */
export function optimizeAllImages() {
  console.log('🖼️ Starting image optimization...');
  
  // Get all images on the page
  const images = document.querySelectorAll('img:not([data-optimized="true"])');
  console.log(`Found ${images.length} unoptimized images.`);
  
  let optimizedCount = 0;
  
  // Process each image
  images.forEach((img) => {
    // Skip images that are already optimized
    if (img.getAttribute('data-optimized') === 'true') return;
    
    // Add loading="lazy" to images not in viewport
    if (!isInViewport(img)) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding="async" to all images
    img.setAttribute('decoding', 'async');
    
    // Add appropriate sizes attribute if missing
    if (!img.hasAttribute('sizes')) {
      img.setAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    }
    
    // Set appropriate width and height if possible
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      // Natural dimensions are available after image loads
      if (img.naturalWidth && img.naturalHeight) {
        img.setAttribute('width', img.naturalWidth);
        img.setAttribute('height', img.naturalHeight);
      }
    }
    
    // Mark as optimized
    img.setAttribute('data-optimized', 'true');
    optimizedCount++;
  });
  
  console.log(`✅ Optimized ${optimizedCount} images.`);
  
  // Helper function to check if element is in viewport
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

/**
 * Auto-optimize images as they enter the viewport using Intersection Observer
 * This is more efficient than optimizing all images at once
 */
export function setupLazyImageOptimization() {
  // If Intersection Observer isn't supported, fall back to optimizing all
  if (!('IntersectionObserver' in window)) {
    optimizeAllImages();
    return;
  }
  
  const images = document.querySelectorAll('img:not([data-optimized="true"])');
  console.log(`Setting up lazy optimization for ${images.length} images.`);
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Add decoding="async"
        img.setAttribute('decoding', 'async');
        
        // If this is a product image and we have a higher resolution version
        if (img.src.includes('product') && img.src.includes('_thumb')) {
          // Replace thumbnail with high-quality image
          img.src = img.src.replace('_thumb', '');
        }
        
        // Mark as optimized
        img.setAttribute('data-optimized', 'true');
        
        // Stop observing this image
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px' // Start loading 200px before the image enters the viewport
  });
  
  // Observe all images
  images.forEach(img => {
    imageObserver.observe(img);
  });
  
  console.log('✅ Lazy image optimization set up successfully.');
}

/**
 * Add this to window object when in dev mode
 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.KarniImageOptimizer = {
    optimizeAllImages,
    setupLazyImageOptimization
  };
  
  console.log('🖼️ Karni Image Optimizer is available in development mode.');
  console.log('Try running: window.KarniImageOptimizer.setupLazyImageOptimization()');
}

// Auto-run lazy image optimization when this module is imported
if (typeof window !== 'undefined') {
  // Wait until the page is fully loaded
  window.addEventListener('load', () => {
    // Wait a bit to not block other onload handlers
    setTimeout(() => {
      setupLazyImageOptimization();
    }, 500);
  });
}
