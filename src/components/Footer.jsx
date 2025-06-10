import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhone, FaGlobe, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

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
    <footer className="bg-charcoal text-gray-300 py-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">{/* Company Info */}
          <div className="text-center md:text-left space-y-4">            <div className="flex items-center md:justify-start justify-center">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img 
                  src={logo} 
                  alt="Karni Exim Logo" 
                  className="h-16 mr-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer" 
                />
              </Link>
            </div>
            <p className="text-sm text-gray-300">Leading exporters of quality textile products from India to global markets since 2015.</p>
            <p className="text-sm text-gray-400 mt-4">© 2025 Karni Exim. All rights reserved.</p>
          </div>{/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-saffron pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleNavigation('/')} className="hover:text-saffron transition text-left w-full">Home</button></li>
              <li><button onClick={() => handleNavigation('/products')} className="hover:text-saffron transition text-left w-full">Products</button></li>
              <li><button onClick={() => handleNavigation('/about')} className="hover:text-saffron transition text-left w-full">About</button></li>
              <li><button onClick={() => handleNavigation('/contact')} className="hover:text-saffron transition text-left w-full">Contact</button></li>
              <li><button onClick={() => handleNavigation('/privacy-policy')} className="hover:text-saffron transition text-left w-full">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigation('/terms-of-service')} className="hover:text-saffron transition text-left w-full">Terms of Service</button></li>
            </ul>
          </div>
          
          {/* Product Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-saffron pb-2 inline-block">Product Categories</h3>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.slice(0, 6).map(category => (
                  <li key={category}>
                    <button 
                      onClick={() => handleNavigation(`/products?category=${encodeURIComponent(category)}`)}
                      className="hover:text-saffron transition capitalize text-left w-full"
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
            <div className="flex justify-center md:justify-start gap-4 text-2xl mb-4">              <a 
                href="https://www.facebook.com/0Karniexim/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="hover:scale-110 transition-transform bg-transparent hover:bg-blue-800 rounded-full p-2"
              >
                <FaFacebookF className="text-gray-300 hover:text-white transition" />
              </a>              <a 
                href="https://www.instagram.com/karni_exim/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:scale-110 transition-transform hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 rounded-full p-2"
              >
                <FaInstagram className="text-gray-300 hover:text-white transition" />
              </a>              <a 
                href="https://wa.me/918209987858?text=Hi%20Karni%20Exim,%20I'm%20interested%20in%20your%20products."
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:scale-110 transition-transform hover:bg-green-700 rounded-full p-2"
                data-action="share/whatsapp/share"
              >
                <FaWhatsapp className="text-gray-300 hover:text-white transition" />
              </a>              <a 
                href="tel:+918209987858"
                aria-label="Call Us"
                className="hover:scale-110 transition-transform hover:bg-blue-700 rounded-full p-2"
              >
                <FaPhone className="text-gray-300 hover:text-white transition" />
              </a>
            </div>
            <p className="text-sm">
              <strong>Address:</strong> Plot No. 5, Suraj Colony,<br /> 
              Bikaner-334001, Rajasthan, India
            </p>
          </div>        </div>
      </div>
    </footer>
  );
};

export default Footer;
