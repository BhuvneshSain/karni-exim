import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8"
      >
        Get in Touch
      </motion.h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
            </div>
            
            <div className="mt-8 flex justify-center">
              <a
                href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-charcoal hover:bg-charcoal-dark text-white px-6 py-3 rounded-lg shadow-md transition text-lg"
              >
                💬 Chat with Us on WhatsApp
              </a>
            </div>
          </motion.div>
            <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Fallback map image in case the iframe is blocked */}
            <div className="w-full h-full min-h-[300px] rounded-lg shadow-md border-2 border-saffron/20 bg-cornsilk overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-cornsilk">
                <p className="text-charcoal mb-2">
                  <strong>Karni Exim</strong><br />
                  Plot No. 5, Suraj Colony<br />
                  Near Udasar Army Gate<br />
                  Bikaner-334001, Rajasthan, India
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  (Map view may be blocked by privacy settings)
                </p>                <a
                  href="https://www.openstreetmap.org/?mlat=28.0229&mlon=73.3119#map=15/28.0229/73.3119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-saffron hover:bg-saffron/80 text-charcoal px-4 py-2 rounded shadow-sm text-sm"
                >
                  View on Map
                </a>
              </div>              <iframe
                title="Karni Exim Location"
                className="w-full h-full min-h-[300px] absolute inset-0 z-10"
                src="https://www.openstreetmap.org/export/embed.html?bbox=73.3050%2C28.0190%2C73.3180%2C28.0270&amp;layer=mapnik&amp;marker=28.0229%2C73.3113"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Contact;
