import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I%20have%20a%20question%20about%20your%20Privacy%20Policy.');
  };

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6 md:mb-8 text-center">
        Privacy Policy
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Introduction</h2>
          <p className="text-gray-700">
            This Privacy Policy describes how Karni Exim ("we," "us," or "our") collects, uses, and discloses your information 
            when you use our website located at karniexim.com (the "Site"). Please read this Privacy Policy carefully. 
            By using our Site, you agree to the terms of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Information We Collect</h2>
          <p className="text-gray-700 mb-3">
            We may collect personal information that you provide directly to us, such as when you contact us,
            request a quote, or otherwise interact with our Site. This information may include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Contact information, such as name, email address, phone number, and address</li>
            <li>Business information, such as company name and title</li>
            <li>Information about your requests and interactions with our products</li>
            <li>Any other information you choose to provide</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-charcoal-dark mb-3">How We Use Information</h2>
          <p className="text-gray mb-3">
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Provide, maintain, and improve our products and services</li>
            <li>Process and fulfill your requests, orders, and transactions</li>
            <li>Communicate with you about products, services, promotions, and events</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our products</li>
            <li>Detect, investigate, and prevent security incidents and other malicious activities</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Sharing of Information</h2>
          <p className="text-gray-700">
            We do not sell your personal information. However, we may share information as follows:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>With vendors, service providers, and consultants who need access to such information to perform services for us</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, applicable law</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect our rights or property</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
            <li>With your consent or at your direction</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Data Security</h2>
          <p className="text-gray-700">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized 
            access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot 
            guarantee the security of our systems.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Your Rights</h2>
          <p className="text-gray-700">
            Depending on your location, you may have certain rights regarding your personal information. Please contact us 
            if you would like to exercise any of these rights, including accessing, correcting, or deleting your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Changes to this Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you as required by applicable law.
            Your continued use of our Site after any changes indicates your acceptance of the revised Privacy Policy.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="text-gray-700 mt-2 not-italic">
            <p>Karni Exim</p>
            <p>Plot No. 5, Suraj Colony, Near Udasar Army Gate</p> 
            <p>Bikaner-334001, Rajasthan, India</p>
            <p>Email: <a href="mailto:info@karniexim.com" className="text-blue-600 hover:underline">info@karniexim.com</a></p>
            <p>Phone: <a href="tel:+918209987858" className="text-blue-600 hover:underline">+91 82099 87858</a></p>
          </address>
          
          <button 
            onClick={handleWhatsAppContact}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 18.129A9.937 9.937 0 0112 22a9.937 9.937 0 01-6-2.3 10.029 10.029 0 01-4-11.82A9.978 9.978 0 017.5 2.6 9.936 9.936 0 0112 2a9.937 9.937 0 016 2.3 10.029 10.029 0 014 11.829z"></path>
            </svg>
            Chat with Us on WhatsApp
          </button>
        </section>

        <div className="text-gray-500 text-sm text-center pt-4 border-t border-gray-200 mt-6">
          Last Updated: October 15, 2025
        </div>
        
        {/* Related Links */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-3 text-center">Related Information</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/terms-of-service')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Terms of Service
            </button>
            <button onClick={() => navigate('/products')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Browse Products
            </button>
            <button onClick={() => navigate('/contact')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Contact Us
            </button>
            <button onClick={() => navigate('/')} className="inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-300">
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
