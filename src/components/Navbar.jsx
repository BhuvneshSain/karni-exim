import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (sectionId) => {
    if (!isHome) {
      window.location.href = '/#' + sectionId;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Memoize scroll handler to prevent recreation on every render
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    setIsScrolled(scrolled);
  }, []);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]); // Only depend on memoized handler

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
    isScrolled
      ? 'bg-charcoal/95 backdrop-blur-md shadow-lg border-b border-white/10'
      : 'bg-charcoal shadow-md'
  }`;

  const logoSizeClasses = isScrolled ? 'h-12 md:h-14' : 'h-14 md:h-16';

  return (
    <>
      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={logo}
                  alt="Karni Exim Logo"
                  className={`w-auto transition-all duration-300 ${logoSizeClasses}`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron border-b-2 border-saffron'
                      : 'text-white hover:text-saffron'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron border-b-2 border-saffron'
                      : 'text-white hover:text-saffron'
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron border-b-2 border-saffron'
                      : 'text-white hover:text-saffron'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron border-b-2 border-saffron'
                      : 'text-white hover:text-saffron'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-saffron bg-charcoal-dark/50 hover:bg-charcoal-dark/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-saffron transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Mobile menu panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-1/2 bg-charcoal-dark shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Link to="/" onClick={closeMenu} className="flex items-center">
                <img
                  src={logo}
                  alt="Karni Exim Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-saffron transition-colors duration-200"
              >
                <span className="sr-only">Close menu</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron bg-charcoal-light border-l-4 border-saffron'
                      : 'text-white hover:text-saffron hover:bg-charcoal-light'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron bg-charcoal-light border-l-4 border-saffron'
                      : 'text-white hover:text-saffron hover:bg-charcoal-light'
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron bg-charcoal-light border-l-4 border-saffron'
                      : 'text-white hover:text-saffron hover:bg-charcoal-light'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-saffron bg-charcoal-light border-l-4 border-saffron'
                      : 'text-white hover:text-saffron hover:bg-charcoal-light'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
