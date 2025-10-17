import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoogleMapEmbed from '../components/GoogleMapEmbed';

const Contact = () => {
  // Remove artificial loading delay - no need for loading state for static content

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8"
      >
        Contact Us - Bulk Orders & Import-Export Inquiries
      </motion.h2>      {/* Remove loading spinner for static content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-8"
      >
          <motion.div 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-cornsilk rounded-lg shadow-md p-6 border border-saffron/20"
          >
            <div className="mb-6 p-4 bg-saffron/10 rounded-lg border-l-4 border-saffron">
              <p className="text-charcoal font-semibold text-lg mb-2">
                📦 Bulk Orders & B2B Inquiries Welcome
              </p>
              <p className="text-charcoal/80">
                Bulk exporter of premium Indian agro commodities from Bikaner, Rajasthan. 
                Specialists in oilseeds, pulses, and spices for global B2B buyers.
              </p>
            </div>
            
            <div className="text-charcoal space-y-4 text-lg">
              <p className="flex items-start gap-2">
                <span className="text-saffron text-2xl">📍</span> 
                <span><strong className="text-charcoal-dark">Address:</strong> Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-saffron text-2xl">📧</span> 
                <span><strong className="text-charcoal-dark">Email:</strong> <a className="text-saffron hover:underline" href="mailto:info@karniExim.com">info@karniExim.com</a></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-saffron text-2xl">📞</span> 
                <span><strong className="text-charcoal-dark">Phone:</strong> <a className="text-saffron hover:underline" href="tel:+918209987858">+91 82099 87858</a></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-saffron text-2xl">🌍</span> 
                <span><strong className="text-charcoal-dark">Services:</strong> Agro Commodities Export, Bulk Sourcing, B2B Supply Solutions</span>
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <a
                href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20bulk%20orders%20and%20import-export%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-charcoal hover:bg-charcoal-dark text-white px-6 py-3 rounded-lg shadow-md transition text-lg"
              >
                💬 WhatsApp for Bulk Orders
              </a>
            </div>          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >            {/* Google Maps Component */}
            <GoogleMapEmbed 
              address="Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India"
              coordinates="28.028338445268272,73.37893326669348"
              zoom={16}
            />
          </motion.div>
        </motion.div>
    </div>
  );
};

export default Contact;
