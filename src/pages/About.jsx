import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  // Remove artificial loading delay - no need for loading state for static content

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-charcoal mb-8"
      >
        About Karni Exim - Manufacturer & Bulk Exporter
      </motion.h2>      {/* Remove loading spinner for static content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-cornsilk rounded-lg shadow-md p-6 md:p-8 border-t-4 border-saffron"
      >
          <p className="text-charcoal text-lg leading-relaxed mb-6">
            <strong className="text-saffron">Karni Exim</strong> is a leading <strong>manufacturer and bulk exporter</strong> based in <strong>Bikaner, Rajasthan</strong>, specializing in <strong>import-export of premium textile products</strong> to global markets. With our <strong>own production facility</strong>, we deliver quality products worldwide with a strong commitment to excellence and reliability.
          </p>

          <p className="text-charcoal text-lg leading-relaxed mb-6">
            Our <strong>manufacturing capabilities</strong> allow us to handle <strong>bulk orders</strong> and provide customized solutions for international clients. We specialize in a wide range of products — from apparel and handicrafts to industrial and eco-friendly solutions. Every shipment reflects our passion for quality and dedication to customer satisfaction.
          </p>

          <p className="text-charcoal text-lg leading-relaxed mb-6">
            Located in the heart of Rajasthan's textile hub, <strong>Karni Exim</strong> bridges Indian craftsmanship with global markets through ethical trade and sustainable manufacturing practices. We serve clients across various continents with <strong>B2B import-export solutions</strong>, offering competitive pricing and reliable delivery.
          </p>

          <div className="bg-white/50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-charcoal mb-4">Why Choose Karni Exim?</h3>
            <ul className="text-charcoal text-lg space-y-2 list-disc list-inside">
              <li><strong>Own Production Facility</strong> in Bikaner, Rajasthan</li>
              <li><strong>Bulk Export Capabilities</strong> for worldwide markets</li>
              <li><strong>Import-Export Expertise</strong> with global compliance</li>
              <li><strong>Quality Manufacturing</strong> with international standards</li>
              <li><strong>B2B Solutions</strong> for wholesale and bulk orders</li>
              <li><strong>Competitive Pricing</strong> with reliable delivery</li>
            </ul>
          </div>

          <p className="text-saffron text-xl font-medium italic">
            "Empowering local production. Exporting global value." 🌍
          </p>
        </motion.div>
    </div>
  );
};

export default About;
