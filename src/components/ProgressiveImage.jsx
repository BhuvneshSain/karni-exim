/**
 * ProgressiveImage Component (Optimized)
 * 
 * Lightweight image component that uses native HTML image loading
 * Much faster than the previous version with loading states
 * 
 * @param {string} src - Image URL
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
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  itemProp,
  onLoad,
  onError,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      itemProp={itemProp}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  );
};

export default ProgressiveImage;
