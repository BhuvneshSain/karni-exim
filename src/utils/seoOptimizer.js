/**
 * SEO optimization utilities for Karni Exim website
 */

/**
 * Generate SEO-friendly title based on page name and content
 * @param {string} pageName - The name of the current page
 * @param {string} suffix - Optional suffix to add to the title
 * @returns {string} - Formatted SEO title
 */
export const generateSeoTitle = (pageName, suffix = '') => {
  const baseName = 'Karni Exim';
  const titleSuffix = suffix ? ` | ${suffix}` : '';
  
  if (pageName === 'Home') {
    return `${baseName} | Premium Textile Exports from India${titleSuffix}`;
  }
  
  return `${pageName} | ${baseName}${titleSuffix}`;
};

/**
 * Generate structured data for product pages to improve search visibility
 * @param {Object} product - Product object with details
 * @returns {Object} - JSON-LD object for product
 */
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.mainImage,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Karni Exim'
    },
    offers: {
      '@type': 'Offer',
      availability: product.isAvailable ? 
        'https://schema.org/InStock' : 
        'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };
};

/**
 * Generate WhatsApp sharing link with product details
 * @param {Object} product - Product to share
 * @returns {string} - WhatsApp sharing link
 */
export const generateWhatsAppShareLink = (product) => {
  const text = encodeURIComponent(
    `Check out ${product.name} from Karni Exim!\n\n` +
    `${product.description.substring(0, 100)}...\n\n` +
    `View it here: https://karni-exim-new.netlify.app/product/${product.id}`
  );
  
  return `https://wa.me/?text=${text}`;
};

/**
 * Helper function to add canonical URLs for SEO
 * @param {string} path - Page path
 */
export const setCanonicalUrl = (path) => {
  // Remove any existing canonical links
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }
  
  // Create a new canonical link
  const canonical = document.createElement('link');
  canonical.setAttribute('rel', 'canonical');
  canonical.setAttribute('href', `https://karni-exim-new.netlify.app${path}`);
  document.head.appendChild(canonical);
};
