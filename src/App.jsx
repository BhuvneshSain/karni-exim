// App.jsx
import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
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
const HeroDebug = lazy(() => import('./components/HeroDebug'));

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex justify-center items-center h-[50vh]">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-charcoal font-medium">Loading page...</p>
    </div>
  </div>
);

const App = () => {
  const [showHeroDebug, setShowHeroDebug] = useState(false);
  const location = useLocation();
  
  // Check URL parameters for debug flag
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const debugParam = queryParams.get('debug');
    setShowHeroDebug(debugParam === 'hero');
    
    // Ensure the content is at least viewport height
    document.documentElement.style.height = '100%';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.getElementById('root').style.minHeight = '100vh';
    document.getElementById('root').style.display = 'flex';
    document.getElementById('root').style.flexDirection = 'column';
  }, [location.search]);
    return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />

      <main className="flex-grow w-full">
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
      <Footer />
      <BackToTop />
      {showHeroDebug && <Suspense fallback={null}><HeroDebug /></Suspense>}
    </div>
  );
};

export default App;
