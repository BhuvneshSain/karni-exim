import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
          <p className="text-lg font-semibold text-white">Karni Exim</p>
          <p className="text-sm text-gray-400">© 2025 Karni Exim. All rights reserved.</p>
        </div>

        <div className="flex gap-4 text-xl">
          <a href="https://www.facebook.com/0Karniexim/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="hover:text-blue-500 transition" />
          </a>
          <a href="https://www.instagram.com/karni_exim/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-pink-500 transition" />
          </a>
        </div>

        <div className="flex gap-4 text-sm">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/products" className="hover:text-white">Products</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
