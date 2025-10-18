// App.jsx
import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import { generateSeoTitle, setCanonicalUrl } from './utils/seoOptimizer';
import 'flowbite';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Eagerly load the Home component for immediate rendering
import Home from './pages/Home';

// Lazy load all other routes for better performance
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const BestsellerHero = lazy(() => import('./components/BestsellerHero'));

// Loading component for suspense fallback
const PageLoading = () => <LoadingSpinner text="Loading page..." fullScreen />;

const App = () => {
  const location = useLocation();
    // Update metadata and SEO for each page
  useEffect(() => {
    // Set canonical URL for SEO
    setCanonicalUrl(location.pathname);
    
    // Set page title based on current route
    let pageTitle = "Home";
    if (location.pathname.includes('/products') && !location.pathname.includes('/product/')) {
      pageTitle = "Products";
    } else if (location.pathname.includes('/about')) {
      pageTitle = "About Us";
    } else if (location.pathname.includes('/contact')) {
      pageTitle = "Contact Us";
    } else if (location.pathname.includes('/privacy-policy')) {
      pageTitle = "Privacy Policy";
    } else if (location.pathname.includes('/terms-of-service')) {
      pageTitle = "Terms of Service";
    }
    
    // Skip title update for product detail pages (they handle their own titles)
    if (!location.pathname.includes('/product/')) {
      document.title = generateSeoTitle(pageTitle);
    }
    
  }, [location.pathname]);
  
  // Initialize root element styling
  useEffect(() => {
    // Ensure the content is at least viewport height
    document.documentElement.style.height = '100%';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.getElementById('root').style.minHeight = '100vh';
    document.getElementById('root').style.display = 'flex';
    document.getElementById('root').style.flexDirection = 'column';
  }, []);
  // Check if current route is admin panel
  const isAdminRoute = location.pathname.startsWith('/karni-admin');

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Only show Navbar and Footer on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow w-full pt-16 md:pt-20">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/karni-admin" element={<Admin />} />
            <Route path="/bestseller-hero" element={<BestsellerHero />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTop />}
    </div>
  );
};

export default App;
