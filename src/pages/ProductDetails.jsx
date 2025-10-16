import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore/lite';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductSEO from '../components/ProductSEO';
import { generateProductSchema, setCanonicalUrl, generateWhatsAppShareLink } from '../utils/seoOptimizer';
import { FaWhatsapp, FaFacebookF, FaEnvelope } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    // Set canonical URL for SEO
    setCanonicalUrl(`/product/${id}`);
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const productData = { id: snap.id, ...snap.data() };
          setProduct(productData);
          
          // Set up product schema for SEO
          const productSchema = generateProductSchema(productData);
          
          // Add product schema to the page
          const script = document.createElement('script');
          script.setAttribute('type', 'application/ld+json');
          script.textContent = JSON.stringify(productSchema);
          document.head.appendChild(script);
          
          // Set page title and meta description for SEO
          document.title = `${productData.name} | Karni Exim Premium Products`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', productData.description.substring(0, 160));
          }
          
          // Update OG tags for social sharing
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const ogDescription = document.querySelector('meta[property="og:description"]');
          const ogImage = document.querySelector('meta[property="og:image"]');
          
          if (ogTitle) ogTitle.setAttribute('content', productData.name);
          if (ogDescription) ogDescription.setAttribute('content', productData.description.substring(0, 160));
          if (ogImage && productData.mainImage) ogImage.setAttribute('content', productData.mainImage);
            // Fetch related products without requiring a custom index
          const q = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            limit(10)
          );
          const querySnapshot = await getDocs(q);
          
          // Filter out the current product and limit to 4 items in JavaScript
          const related = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(product => product.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id]);  if (loading) return <LoadingSpinner text="Loading product details..." />;
    if (!product) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-charcoal-dark">Product not found</h2>
      <p className="mt-4 text-gray">The product you're looking for doesn't exist or has been removed.</p>
      <button
        onClick={() => navigate('/products')}
        className="mt-6 bg-charcoal hover:bg-charcoal-dark text-white px-6 py-2 rounded-md inline-flex items-center"
      >
        View All Products
      </button>
    </div>
  );

  const images = [product.mainImage, ...(product.otherImages || product.images?.slice(1) || [])].filter(Boolean);

  const whatsappLink = `https://wa.me/918209987858?text=${encodeURIComponent(
  `Hello Karni Exim Team,

I'm interested in the following product:

*Product:* ${product.name}
*Category:* ${product.category}
*Product Link:* https://karniexim.com/product/${product.id}

Please provide a quote or more details.

Thanks & Regards,
`
)}`;

  // Social sharing links
  const whatsappShareLink = generateWhatsAppShareLink(product);
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://karni-exim-new.netlify.app/product/${product.id}`)}`;
  const emailShareLink = `mailto:?subject=${encodeURIComponent(`Check out ${product.name} from Karni Exim`)}&body=${encodeURIComponent(`I thought you might be interested in this product from Karni Exim:\n\n${product.name}\n\n${product.description}\n\nCheck it out here: https://karni-exim-new.netlify.app/product/${product.id}`)}`;

  return (
    <article className="max-w-6xl mx-auto px-4 py-6 sm:py-10" itemScope itemType="https://schema.org/Product">
      {/* SEO Component for search engines and social media */}
      <ProductSEO product={product} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav aria-label="Breadcrumb">
          <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-flex items-center group">
            <span className="mr-1 transform transition-transform group-hover:-translate-x-1">&larr;</span> Back to Products
          </Link>
        </nav>

        <section className="flex flex-col md:grid md:grid-cols-2 gap-8 mt-6">
          {/* Product Image Gallery - Mobile Carousel | Desktop Gallery */}
          <motion.div 
            className="w-full md:sticky md:top-20 md:self-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* MOBILE IMAGE - Single image (Hidden on Desktop) */}
            <div className="md:hidden w-full">
              {images.length > 0 ? (
                <figure className="aspect-square bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
                  <img
                    src={images[0]}
                    alt={`${product.name}`}
                    className="w-full h-full object-contain bg-gray-50"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    itemProp="image"
                  />
                </figure>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>

            {/* DESKTOP GALLERY WITH THUMBNAIL (Hidden on Mobile) */}
            <div className="hidden md:flex gap-4">
              {/* Thumbnail Gallery - Left Side */}
              {images.length > 1 && (
                <div className="flex flex-col gap-2 w-20">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`
                        relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                        ${selectedImageIndex === idx 
                          ? 'border-saffron shadow-md scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:scale-110'
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === idx && (
                        <div className="absolute inset-0 bg-saffron/10 pointer-events-none"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display */}
              <figure className="flex-1 aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                {images.length > 0 ? (
                  <div className="relative w-full h-full bg-gray-50">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`${product.name} - View ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      itemProp="image"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </figure>
            </div>

            {/* Image Counter - Desktop Only */}
            {images.length > 1 && (
              <div className="hidden md:block mt-2 text-center text-sm text-gray-500">
                Image {selectedImageIndex + 1} of {images.length}
              </div>
            )}

            {/* CTA Buttons Below Images */}
            <section className="flex flex-col sm:flex-row gap-3 mt-6" aria-label="Contact and inquiry options">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-charcoal hover:bg-charcoal-dark text-white font-semibold px-5 py-3 rounded shadow transition flex items-center justify-center gap-2 touch-manipulation"
                aria-label="Get quote on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Get Quote on WhatsApp
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:info@karniexim.com?subject=Inquiry about ${product.name}&body=Hello Karni Exim Team,%0D%0A%0D%0AI'm interested in the following product:%0D%0A%0D%0AProduct: ${product.name}%0D%0ACategory: ${product.category}%0D%0A%0D%0APlease provide a quote or more details.%0D%0A%0D%0AThanks & Regards`}
                className="w-full text-center border-2 border-saffron text-charcoal-dark hover:bg-saffron/10 font-semibold px-5 py-3 rounded shadow-sm transition flex items-center justify-center gap-2 touch-manipulation"
                aria-label="Send email inquiry"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Inquiry
              </motion.a>
            </section>
          </motion.div>

          {/* Product Information */}
          <motion.div 
            className="flex flex-col space-y-4 px-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {product.isBestSeller && (
              <span className="inline-block bg-saffron text-charcoal-dark text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit" aria-label="Bestseller product">
                Bestseller
              </span>
            )}
            
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-dark" itemProp="name">{product.name}</h1>
            <hr className="h-px bg-saffron/30 w-full my-2" aria-hidden="true" />
            
            <div itemProp="description">
              <p className="text-gray text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            
            <dl className="text-sm text-gray">
              <dt className="inline font-medium">Category:</dt>
              <dd className="inline ml-2 text-charcoal-dark" itemProp="category">{product.category}</dd>
            </dl>

            {product.badges?.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Product features">
                {product.badges.map((badge, idx) => (
                  <li
                    key={idx}
                    className="bg-saffron/20 text-xs sm:text-sm text-charcoal-dark font-medium px-2 py-1 rounded list-none"
                    itemProp="additionalProperty"
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            )}

            {product.outOfStock ? (
              <div className="text-red-600 font-bold text-sm uppercase" role="status" aria-live="polite">
                <meta itemProp="availability" content="https://schema.org/OutOfStock" />
                Out of Stock
              </div>
            ) : (
              <meta itemProp="availability" content="https://schema.org/InStock" />
            )}
            
            {/* Social Sharing Section */}
            <aside className="mt-6 pt-4 border-t border-saffron/20" aria-label="Share this product">
              <h2 className="text-gray-600 mb-3 text-sm font-medium">Share this product:</h2>
              <nav className="flex space-x-3" aria-label="Social media sharing">
                <a 
                  href={whatsappShareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-green-500 text-green-500 p-2 rounded-full hover:bg-green-100 transition-colors flex items-center justify-center"
                  aria-label="Share on WhatsApp"
                  data-action="share/whatsapp/share"
                >
                  <FaWhatsapp size={18} aria-hidden="true" />
                </a>
                
                <a 
                  href={facebookShareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-blue-600 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF size={16} aria-hidden="true" />
                </a>
                
                <a 
                  href={emailShareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-gray-600 text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                  aria-label="Share via Email"
                >
                  <FaEnvelope size={18} aria-hidden="true" />
                </a>
              </nav>
            </aside>
          </motion.div>
        </section>
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            aria-labelledby="related-products-heading"
          >
            <h2 id="related-products-heading" className="text-2xl font-bold text-charcoal-dark mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </article>
  );
};

export default ProductDetails;
