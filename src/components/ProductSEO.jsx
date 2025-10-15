import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ProductSEO Component
 * Manages meta tags and structured data for product pages
 * Optimized for search engine crawlers and social media sharing
 */
const ProductSEO = ({ product, baseUrl = 'https://karni-exim-new.netlify.app' }) => {
  useEffect(() => {
    if (!product) return;

    const canonicalUrl = `${baseUrl}/product/${product.id}`;
    
    // Set page title
    document.title = `${product.name} | Karni Exim - Bulk Export from Bikaner, Rajasthan`;
    
    // Update or create meta tags
    const updateMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Basic meta tags
    const description = product.description 
      ? `${product.description.substring(0, 150)}... | Bulk export available. Manufactured in Bikaner, Rajasthan.`
      : `${product.name} - Available for bulk export from Karni Exim, Bikaner, Rajasthan.`;
    
    updateMetaTag('description', description);
    updateMetaTag('keywords', `${product.name}, ${product.category || 'textiles'}, bulk export, wholesale, Bikaner manufacturer, Karni Exim, import export`);
    
    // Open Graph tags for Facebook, WhatsApp, LinkedIn
    updateMetaTag('og:title', `${product.name} | Bulk Export from Bikaner`, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', product.mainImage || '', true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', 'product', true);
    updateMetaTag('og:site_name', 'Karni Exim', true);
    
    // Product-specific OG tags
    if (product.price) {
      updateMetaTag('og:price:amount', product.price, true);
      updateMetaTag('og:price:currency', 'INR', true);
    }
    
    if (product.category) {
      updateMetaTag('product:category', product.category, true);
    }
    
    updateMetaTag('product:availability', product.inStock !== false ? 'in stock' : 'out of stock', true);
    updateMetaTag('product:condition', 'new', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', `${product.name} | Karni Exim`, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', product.mainImage || '', true);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    // Product Schema.org structured data
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} available for bulk export`,
      "image": product.mainImage || '',
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "Karni Exim"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Karni Exim",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot No. 5, Suraj Colony, Near Udasar Army Gate",
          "addressLocality": "Bikaner",
          "addressRegion": "Rajasthan",
          "postalCode": "334001",
          "addressCountry": "IN"
        }
      },
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "INR",
        "price": product.price || "0",
        "availability": product.inStock !== false 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "name": "Karni Exim",
          "url": baseUrl
        }
      }
    };
    
    // Add category if available
    if (product.category) {
      productSchema.category = product.category;
    }
    
    // Add additional images if available
    if (product.images && product.images.length > 0) {
      productSchema.image = [product.mainImage, ...product.images];
    }
    
    // Add or update product schema script
    let schemaScript = document.querySelector('script[data-schema="product"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-schema', 'product');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(productSchema);
    
    // BreadcrumbList schema for navigation
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${baseUrl}/products`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.category || "Category",
          "item": `${baseUrl}/products?category=${encodeURIComponent(product.category || '')}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": product.name,
          "item": canonicalUrl
        }
      ]
    };
    
    let breadcrumbScript = document.querySelector('script[data-schema="breadcrumb"]');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('data-schema', 'breadcrumb');
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    
    // Cleanup function
    return () => {
      // Reset title
      document.title = 'Karni Exim | Bulk Textile Manufacturer & Exporter from Bikaner, Rajasthan';
      
      // Remove product-specific schemas
      const productSchemaEl = document.querySelector('script[data-schema="product"]');
      const breadcrumbSchemaEl = document.querySelector('script[data-schema="breadcrumb"]');
      
      if (productSchemaEl) productSchemaEl.remove();
      if (breadcrumbSchemaEl) breadcrumbSchemaEl.remove();
    };
  }, [product, baseUrl]);

  return null; // This component doesn't render anything
};

ProductSEO.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    mainImage: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    inStock: PropTypes.bool,
  }).isRequired,
  baseUrl: PropTypes.string,
};

export default ProductSEO;
