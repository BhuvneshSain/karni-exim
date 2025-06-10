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
      <div className="w-full h-96 bg-beige flex items-center justify-center mt-4">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (heroProducts.length === 0) {
    // Fallback hero section with just a plain image/gradient      
    return (
      <section className="relative h-[70vh] md:h-[80vh] bg-gradient-to-br from-charcoal to-charcoal-light rounded-xl md:rounded-2xl overflow-hidden mx-4 mt-4">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Premium <span className="text-saffron">Textile</span> Products
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Quality exports from India to global markets
          </p>
        </div>      
        </section>
    );
  }
  
  return (    <section className="w-full relative px-4 mt-4">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
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
        speed={800}        className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] hero-swiper karni-hero rounded-hero"
        grabCursor={true}
      >
        {heroProducts.map((product) => (
          <SwiperSlide 
            key={product.id} 
            className="relative"
            onClick={() => handleNavigation(product.id)}
          >
            <div className="h-full w-full bg-beige relative">
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
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2 text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-xl">
                  {product.name}
                </h2>
                <p className="text-lg md:text-xl mb-6 drop-shadow-lg">
                  {product.description?.substring(0, 100)}
                  {product.description?.length > 100 ? '...' : ''}
                </p>
                <button className="bg-saffron text-charcoal px-6 py-2 rounded font-medium hover:bg-opacity-90 transition-all">
                  View Details
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default memo(HeroSection);
