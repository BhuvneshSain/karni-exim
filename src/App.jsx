// App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import BestsellerHero from './components/BestsellerHero';
import HeroDebug from './components/HeroDebug';
import BackToTop from './components/BackToTop';
import 'flowbite';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const App = () => {
  const [showHeroDebug, setShowHeroDebug] = useState(false);
  const location = useLocation();
  
  // Check URL parameters for debug flag
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const debugParam = queryParams.get('debug');
    setShowHeroDebug(debugParam === 'hero');
  }, [location.search]);
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />

      <main className="flex-grow w-full">
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
      </main>      <Footer />
      <BackToTop />
      {showHeroDebug && <HeroDebug />}
    </div>
  );
};

export default App;
