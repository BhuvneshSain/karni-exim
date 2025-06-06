import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import useProducts from '../hooks/useProducts';
import ProductCard from './ProductCard';

const BestsellerCarousel = () => {
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.isBestSeller);

  if (loading) return <p className="text-center py-8 text-gray-600">Loading...</p>;
  if (bestsellers.length === 0) return <p className="text-center py-8 text-gray-500">No bestsellers yet.</p>;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">🔥 Bestsellers</h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {bestsellers.map(product => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BestsellerCarousel;
