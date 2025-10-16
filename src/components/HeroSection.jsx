import { useState, useEffect, useCallback, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './HeroSection.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../firebase';
import LoadingSpinner from './LoadingSpinner';
import { getOptimizedImageUrl, getImagePlaceholder } from '../utils/imageOptimizer';
import ProgressiveImage from './ProgressiveImage';

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false - show fallback immediately
  const navigate = useNavigate();
  
  // Memoize the navigation function to prevent unnecessary re-renders
  const handleNavigation = useCallback(() => {
    navigate('/products');
  }, [navigate]);
  
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        // Check sessionStorage cache first
        const cachedHeroImages = sessionStorage.getItem('heroImages');
        const cacheTimestamp = sessionStorage.getItem('heroImagesTimestamp');
        const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
        
        // Use cached data if available and fresh
        if (cachedHeroImages && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp);
          if (age < CACHE_DURATION) {
            console.log('✅ Using cached hero images');
            setHeroImages(JSON.parse(cachedHeroImages));
            return;
          }
        }
        
        // Fetch from Firebase if no cache or expired
        console.log('🔥 Fetching hero images from Firebase...');
        const querySnapshot = await getDocs(collection(db, "heroes"));
        
        const heroes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('✅ Hero banners fetched:', heroes.length);
        setHeroImages(heroes);
        
        // Cache the results
        sessionStorage.setItem('heroImages', JSON.stringify(heroes));
        sessionStorage.setItem('heroImagesTimestamp', Date.now().toString());
        
      } catch (error) {
        console.error("Error fetching hero images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);
  
  // Always show fallback hero immediately (no loading spinner)
  // Hero images will load in background and update when ready
  
  if (heroImages.length === 0) {
    // Fallback hero section - shows immediately while hero images load      
    return (
      <section className="relative h-[70vh] md:h-[80vh] bg-gradient-to-br from-charcoal to-charcoal-light rounded-xl md:rounded-2xl overflow-hidden mx-4 mt-4 cursor-pointer" onClick={handleNavigation}>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            <span className="text-saffron">Bulk Export</span> & Manufacturing
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-2">
            Leading Textile Manufacturer & Exporter from Bikaner, Rajasthan
          </p>
          <p className="text-lg md:text-xl text-center max-w-2xl text-white/90">
            Own Production Facility | Import-Export Solutions | B2B Bulk Orders
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
        loop={heroImages.length > 1}
        speed={800}        className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] hero-swiper karni-hero rounded-hero"
        grabCursor={true}
      >
        {heroImages.map((hero) => (
          hero.image && (
            <SwiperSlide 
              key={hero.id} 
              className="relative cursor-pointer"
              onClick={handleNavigation}
            >
              <div className="h-full w-full bg-beige relative">
                {/* Progressive image with high priority for LCP */}
                <ProgressiveImage
                  src={getOptimizedImageUrl(hero.image, { type: 'hero' })}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  alt="Hero Banner"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImagePlaceholder('hero');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2 text-white">
                  <button className="bg-saffron text-charcoal px-6 py-2 rounded font-medium hover:bg-opacity-90 transition-all">
                    View All Products
                  </button>
                </div>
              </div>
            </SwiperSlide>
          )
        ))}
      </Swiper>
    </section>
  );
};

export default memo(HeroSection);
