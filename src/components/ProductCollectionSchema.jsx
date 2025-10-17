import { useEffect } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_BASE_URL = 'https://karniexim.com';

/**
 * Injects ItemList schema with highlighted products so Google can showcase
 * a product carousel in search results.
 */
const ProductCollectionSchema = ({ products, baseUrl = DEFAULT_BASE_URL }) => {
  useEffect(() => {
    if (!products || products.length === 0) return;

    const structuredProducts = products
      .filter((product) => product && (product.mainImage || (product.images && product.images.length)))
      .map((product, index) => {
        const imageSet = Array.from(
          new Set([product.mainImage, ...(product.images || [])].filter(Boolean))
        );

        return {
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/product/${product.id}`,
          item: {
            '@type': 'Product',
            name: product.name,
            image: imageSet,
            description: product.description
              ? product.description.slice(0, 160)
              : `${product.name} available for bulk export from Karni Exim.`,
            category: product.category || 'Agro Commodities',
            brand: {
              '@type': 'Brand',
              name: 'Karni Exim',
            },
          },
        };
      });

    if (structuredProducts.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Featured Agro Commodities',
      description:
        'Bulk export catalogue of oilseeds, pulses, spices, and other Indian agro commodities from Karni Exim.',
      numberOfItems: structuredProducts.length,
      itemListElement: structuredProducts,
    };

    let script = document.querySelector('script[data-schema="product-collection"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'product-collection');
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, [products, baseUrl]);

  return null;
};

ProductCollectionSchema.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      mainImage: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      category: PropTypes.string,
    })
  ),
  baseUrl: PropTypes.string,
};

export default ProductCollectionSchema;
