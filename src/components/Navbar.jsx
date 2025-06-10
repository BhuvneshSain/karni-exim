import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/logo.svg';

const linkClass = ({ isActive }) =>
  `block text-lg px-6 py-4 transition-all ${
    isActive
      ? "text-saffron font-bold border-b-2 border-saffron"
      : "text-white hover:text-saffron"
  }`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (sectionId) => {
    if (!isHome) {
      // If not on home page, navigate to home first
      window.location.href = '/#' + sectionId;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-charcoal shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">        <div className="flex items-center">
          <Link to="/" onClick={closeMenu} className="hover:opacity-80 transition-opacity duration-300">
            <img 
              src={logo} 
              alt="Karni Exim Logo" 
              className="h-16 mr-2 transform hover:scale-105 transition-transform duration-300" 
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-3xl text-saffron">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>      {/* Slide-In Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-charcoal-dark shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}>        <div className="flex flex-col pt-20">
          <div className="flex items-center justify-center mb-6 pb-4 border-b border-charcoal-light">
            <img src={logo} alt="Karni Exim Logo" className="h-16" />
          </div>
          <NavLink to="/" className="text-lg px-6 py-3 transition-all text-white hover:text-saffron hover:bg-charcoal-light" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" className="text-lg px-6 py-3 transition-all text-white hover:text-saffron hover:bg-charcoal-light" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/about" className="text-lg px-6 py-3 transition-all text-white hover:text-saffron hover:bg-charcoal-light" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" className="text-lg px-6 py-3 transition-all text-white hover:text-saffron hover:bg-charcoal-light" onClick={closeMenu}>Contact</NavLink>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
