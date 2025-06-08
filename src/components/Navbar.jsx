import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const linkClass = ({ isActive }) =>
  `block text-lg px-6 py-4 transition-all ${
    isActive
      ? "text-blue-600 font-bold bg-blue-50"
      : "text-gray-700 hover:text-blue-600"
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
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-900 tracking-wide">
          <NavLink to="/" onClick={closeMenu}>Karni Exim</NavLink>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-3xl text-blue-800">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Slide-In Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}>
        <div className="flex flex-col pt-24">
          <NavLink to="/" className={linkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" className={linkClass} onClick={closeMenu}>Products</NavLink>
          <NavLink to="/about" className={linkClass} onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={closeMenu}>Contact</NavLink>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
