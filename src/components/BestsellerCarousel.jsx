import React from 'react';
import Slider from 'react-slick';
import useProducts from '../hooks/useProducts';
import ProductCard from './ProductCard';

const BestsellerCarousel = () => {
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.bestseller);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ]
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">🔥 Bestsellers</h2>
      {loading ? <p>Loading...</p> : (
        <Slider {...settings}>
          {bestsellers.map(p => (
            <div key={p.id} className="px-2">
              <ProductCard product={p} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default BestsellerCarousel;
