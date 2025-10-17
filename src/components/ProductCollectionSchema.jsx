import { useEffect } from "react";
import PropTypes from "prop-types";
import { serializeJsonLd } from "../utils/seoOptimizer";

const DEFAULT_BASE_URL = "https://karniexim.com";

// Helper to normalise text for JSON-LD (remove excessive whitespace and control chars)
const sanitizeText = (value = "") =>
  value
    .toString()
    .replace(/[\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ProductCollectionSchema = ({ products, baseUrl = DEFAULT_BASE_URL }) => {
  useEffect(() => {
    if (!products || products.length === 0) return;

    const structuredProducts = products
      .filter((product) => product && (product.mainImage || (product.images && product.images.length)))
      .map((product, index) => {
        const imageSet = Array.from(
          new Set([product.mainImage, ...(product.images || [])].filter(Boolean))
        );

        const item = {
          "@type": "Product",
          name: sanitizeText(product.name),
          description: sanitizeText(
            product.description || `${product.name} available for bulk export from Karni Exim.`
          ),
          category: sanitizeText(product.category || "Agro Commodities"),
          brand: {
            "@type": "Brand",
            name: "Karni Exim",
          },
          url: `${baseUrl}/product/${product.id}`,
        };

        if (imageSet.length > 0) {
          item.image = imageSet;
        }

        return {
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/product/${product.id}`,
          item,
        };
      });

    if (structuredProducts.length === 0) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Featured Agro Commodities",
      description:
        "Bulk export catalogue of oilseeds, pulses, spices, and other Indian agro commodities from Karni Exim.",
      numberOfItems: structuredProducts.length,
      itemListElement: structuredProducts,
    };

    let script = document.querySelector('script[data-schema="product-collection"]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-schema", "product-collection");
      document.head.appendChild(script);
    }

    try {
      script.textContent = serializeJsonLd(schema);
    } catch (error) {
      console.error("Failed to inject product collection schema", error);
      script.remove();
    }

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
