import { useState, useEffect, useCallback, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSection.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getOptimizedImageUrl, getImagePlaceholder } from '../utils/imageOptimizer';

const HeroSection = () => {
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Memoize the navigation function to prevent unnecessary re-renders
  const handleNavigation = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("isHero", "==", true)
        );
        const querySnapshot = await getDocs(q);
        
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Hero products fetched:', products);
        setHeroProducts(products);
      } catch (error) {
        console.error("Error fetching hero products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (heroProducts.length === 0) {
    // Fallback hero section with just a plain image/gradient
    return (
      <section className="relative h-[70vh] md:h-[80vh] bg-gradient-to-br from-blue-900 to-blue-600">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
      </section>
    );
  }

  return (
    <section className="w-full relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={false}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        effect="fade"
        autoplay={{ 
          delay: 4000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        loop={heroProducts.length > 1}
        speed={800}
        className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] hero-swiper clean-hero"
        grabCursor={true}
      >
        {heroProducts.map((product) => (
          <SwiperSlide 
            key={product.id} 
            className="relative"
            onClick={() => handleNavigation(product.id)}
          >
            <div className="h-full w-full bg-gray-100 relative">
              {/* Image placeholder element that shows while loading */}
              <div className="image-placeholder"></div>
              {/* Clean image with native lazy loading */}
              <img
                src={getOptimizedImageUrl(product.heroImage || product.mainImage, { type: 'hero' })}
                className="w-full h-full object-cover"
                loading="lazy"
                alt={product.name || 'Product image'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getImagePlaceholder('hero');
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default memo(HeroSection);
