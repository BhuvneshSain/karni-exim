import { useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import HeroSection from '../components/HeroSection';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaMedal, FaShippingFast, FaHeadset } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';

// Lazy load components that are not needed immediately
const StatsCounter = lazy(() => import('../components/StatsCounter'));
const ReviewsTicker = lazy(() => import('../components/ReviewsTicker'));

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="flex justify-center py-8">
    <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.isBestSeller);
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-beige w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8 md:mb-12"
          >
            Featured Products
          </motion.h2>
            {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) :(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">              {bestsellers.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          {bestsellers.length > 0 && (
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-saffron hover:bg-opacity-90 text-charcoal px-6 py-3 rounded-lg shadow-md transition font-medium"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Stats Counter Section - Lazy loaded */}
      <Suspense fallback={<LoadingFallback />}>
        <StatsCounter />
      </Suspense>

      {/* Service Features Section */}
      <section className="py-16 bg-cornsilk w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8 md:mb-12"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Quality Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center"
            >
              <div className="bg-saffron/10 p-4 rounded-full mb-4">
                <FaMedal className="text-saffron text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-dark mb-2">Premium Quality</h3>
              <p className="text-gray">Our products meet the highest quality standards for international markets.</p>
            </motion.div>
            
            {/* Fast Shipping Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center"
            >
              <div className="bg-saffron/10 p-4 rounded-full mb-4">
                <FaShippingFast className="text-saffron text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-dark mb-2">Fast Shipping</h3>
              <p className="text-gray">We ensure prompt and secure shipping to destinations worldwide.</p>
            </motion.div>
            
            {/* Customer Support Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center"
            >
              <div className="bg-saffron/10 p-4 rounded-full mb-4">
                <FaHeadset className="text-saffron text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-dark mb-2">24/7 Support</h3>
              <p className="text-gray">Our dedicated team provides round-the-clock customer service.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Reviews Section - Lazy loaded */}
      <Suspense fallback={<LoadingFallback />}>
        <ReviewsTicker />
      </Suspense>
    </div>
  );
};

export default Home;
