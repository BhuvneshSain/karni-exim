import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-charcoal mb-8"
      >
        About Karni Exim
      </motion.h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-cornsilk rounded-lg shadow-md p-6 md:p-8 border-t-4 border-saffron"
        >
          <p className="text-charcoal text-lg leading-relaxed mb-6">
            Karni Exim is a trusted name in Indian export, delivering quality products to global markets with a strong commitment to excellence and reliability. Located in Bikaner, Rajasthan, our mission is to bridge Indian craftsmanship with the world through ethical trade and sustainable practices.
          </p>

          <p className="text-charcoal text-lg leading-relaxed mb-6">
            We specialize in a wide range of products — from apparel and handicrafts to industrial and eco-friendly solutions — and take pride in meeting the demands of clients across various continents. Every shipment reflects our passion for quality and dedication to customer satisfaction.
          </p>

          <p className="text-saffron text-xl font-medium italic">
            "Empowering local production. Exporting global value." 🌍
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default About;
