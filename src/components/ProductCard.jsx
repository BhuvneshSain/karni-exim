import { Link } from 'react-router-dom';
import { getOptimizedImageProps, createSrcSet } from '../utils/imageOptimizer';
import { memo } from 'react';

const ProductCard = ({ product }) => {
  // Handle missing fields gracefully
  const category = product.category || '';
  
  // Get optimized image props
  const imageProps = getOptimizedImageProps(product.mainImage, {
    type: 'product',
    alt: product.name,
    displayWidth: 640,
    className: "w-full h-48 sm:h-52 md:h-60 object-cover"
  });
  return (
    <div className="bg-cornsilk rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] hover:translate-y-[-5px] transition-all duration-300 h-full flex flex-col group">
      <div className="relative">
        <img
          {...imageProps}
          srcSet={createSrcSet(product.mainImage, [400, 640, 768])}
          sizes="(max-width: 640px) 400px, (max-width: 768px) 640px, 768px"
          className={`${imageProps.className} group-hover:opacity-95 transition-opacity`}
        />
        <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
          {product.isBestSeller && (
            <span className="bg-saffron text-xs sm:text-sm text-charcoal-dark font-medium px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {product.showInHero && (
            <span className="bg-charcoal text-xs sm:text-sm text-white font-medium px-2 py-1 rounded-full ml-auto">
              Hero
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-charcoal-dark line-clamp-2">{product.name}</h3>
        
        <div className="flex-grow">
          {category && (
            <span className="inline-block px-3 py-1 bg-saffron/10 rounded-full text-xs text-charcoal-dark">
              {category}
            </span>
          )}        </div>        {product.outOfStock ? (
          <span className="text-xs font-bold uppercase text-red-600 block mb-2">Out of Stock</span>
        ) : (          <Link 
            to={`/product/${product.id}`} 
            className="block w-full text-center bg-charcoal hover:bg-saffron hover:text-charcoal-dark font-medium text-white text-sm px-4 py-3 rounded-md transition-all duration-300 mt-2 touch-manipulation active:scale-95 transform group-hover:translate-y-[-2px]"
            aria-label={`View details about ${product.name}`}
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard);
