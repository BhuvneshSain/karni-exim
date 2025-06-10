import { useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import { motion } from 'framer-motion';
import { FaMedal, FaShippingFast, FaHeadset } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.isBestSeller);
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8 md:mb-12"
          >
            Featured Products
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestsellers.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="h-60 overflow-hidden">
                      <img 
                        src={product.mainImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-blue-900">{product.name}</h3>
                      <p className="text-gray-600 line-clamp-2">{product.description}</p>
                      <button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {bestsellers.length > 0 && (
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Stats Counter Section */}
      <StatsCounter />

      {/* Service Features Section */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8 md:mb-12"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Premium Quality Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <FaMedal className="text-5xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the finest materials and employ rigorous quality control standards to ensure that each product meets the highest international quality benchmarks.
              </p>
            </motion.div>

            {/* On Time Delivery Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <FaShippingFast className="text-5xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">On Time Delivery</h3>
              <p className="text-gray-600">
                We understand the importance of timely delivery. Our efficient logistics and supply chain ensure that your orders are processed and delivered on schedule, every time.
              </p>
            </motion.div>

            {/* Best Support Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <FaHeadset className="text-5xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Best Support</h3>
              <p className="text-gray-600">
                Our dedicated customer service team is available to assist you with any inquiries or concerns. We're committed to providing exceptional support throughout your journey with us.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
