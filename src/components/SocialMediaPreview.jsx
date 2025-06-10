/**
 * SocialMediaPreview.jsx - Component for managing social media preview metadata
 * This component is designed to be included on important pages to ensure 
 * WhatsApp and other platforms display rich previews when sharing links
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';

const SocialMediaPreview = ({ 
  title, 
  description, 
  imageUrl = 'https://karni-exim-new.netlify.app/og-image.jpg',
  url
}) => {
  // Safely get the current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  useEffect(() => {
    // Update Open Graph meta tags
    const metaTags = {
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'og:url': url,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
      'twitter:url': url,
    };
    
    // Update or create meta tags
    Object.entries(metaTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });
    
    return () => {
      // Cleanup is optional but good practice
      // We don't remove the tags as they should persist
    };
  }, [title, description, imageUrl, url]);

  // This component doesn't render anything visible
  return null;
};

SocialMediaPreview.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  url: PropTypes.string
};

export default SocialMediaPreview;
