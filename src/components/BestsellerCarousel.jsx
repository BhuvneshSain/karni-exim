import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { memo, useMemo } from 'react';

import ProductCard from './ProductCard';

const BestsellerCarousel = ({ products = [] }) => {
  // Memoize the products to prevent unnecessary re-renders
  const bestsellerProducts = useMemo(() => {
    return products?.length ? products : [];
  }, [products]);

  if (!bestsellerProducts.length) {
    return <p className="text-center py-8 text-gray-500">No bestsellers yet.</p>;
  }

  return (
    <section className="py-16 bg-cornsilk">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-charcoal-dark text-center mb-8" id="bestsellers-heading">🔥 Bestsellers</h2>

        <div className="w-full" aria-labelledby="bestsellers-heading">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            a11y={{
              prevSlideMessage: 'Previous bestseller product',
              nextSlideMessage: 'Next bestseller product',
              firstSlideMessage: 'This is the first bestseller',
              lastSlideMessage: 'This is the last bestseller',
              paginationBulletMessage: 'Go to bestseller {{index}}',
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {bestsellerProducts.map(product => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Memo the component to prevent unnecessary re-renders
export default memo(BestsellerCarousel);
