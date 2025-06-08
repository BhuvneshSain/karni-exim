import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhone } from 'react-icons/fa';
import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  // Get all product categories
  const { products } = useProducts();
  const navigate = useNavigate();
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  
  // Handle navigation with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          {/* Company Info */}
          <div className="text-center md:text-left space-y-2">
            <p className="text-xl font-semibold text-white mb-3">Karni Exim</p>
            <p className="text-sm text-gray-400">Leading exporters of quality products from India to global markets since 2015.</p>
            <p className="text-sm text-gray-400 mt-4">© 2025 Karni Exim. All rights reserved.</p>
          </div>          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigation('/')} className="hover:text-white transition text-left w-full">Home</button></li>
              <li><button onClick={() => handleNavigation('/products')} className="hover:text-white transition text-left w-full">Products</button></li>
              <li><button onClick={() => handleNavigation('/about')} className="hover:text-white transition text-left w-full">About</button></li>
              <li><button onClick={() => handleNavigation('/contact')} className="hover:text-white transition text-left w-full">Contact</button></li>
              <li><button onClick={() => handleNavigation('/privacy-policy')} className="hover:text-white transition text-left w-full">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigation('/terms-of-service')} className="hover:text-white transition text-left w-full">Terms of Service</button></li>
            </ul>
          </div>          {/* Product Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium text-white mb-3">Product Categories</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.slice(0, 6).map(category => (
                  <li key={category}>
                    <button 
                      onClick={() => handleNavigation(`/products?category=${encodeURIComponent(category)}`)}
                      className="hover:text-white transition capitalize text-left w-full"
                    >
                      {category}
                    </button>
                  </li>
                ))
              ) : (
                <li>Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-medium text-white mb-3">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-4 text-2xl mb-4">
              <a 
                href="https://www.facebook.com/0Karniexim/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="hover:scale-110 transition-transform"
              >
                <FaFacebookF className="hover:text-blue-500 transition" />
              </a>
              <a 
                href="https://www.instagram.com/karni_exim/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>
              <a 
                href="https://wa.me/918209987858"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:scale-110 transition-transform"
              >
                <FaWhatsapp className="hover:text-green-500 transition" />
              </a>
              <a 
                href="tel:+918209987858"
                aria-label="Call Us"
                className="hover:scale-110 transition-transform"
              >
                <FaPhone className="hover:text-blue-400 transition" />
              </a>
            </div>
            <p className="text-sm">
              <strong>Address:</strong> Plot No. 5, Suraj Colony,<br /> 
              Bikaner-334001, Rajasthan, India
            </p>
          </div>
        </div>
        
        {/* Contact Bar */}
        <div className="pt-6 border-t border-gray-800 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-base">Need assistance? Contact us:</span>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-base transition-colors"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp Us</span>
              </a>
              
              <a
                href="tel:+918209987858"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-base transition-colors"
              >
                <FaPhone size={16} />
                <span>Call: +91 82099 87858</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
