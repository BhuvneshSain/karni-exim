import { Link } from 'react-router-dom';
import { getOptimizedImageProps, createSrcSet } from '../utils/imageOptimizer';
import { memo } from 'react';
import ProgressiveImage from './ProgressiveImage';

const ProductCard = ({ product }) => {
  // Handle missing fields gracefully
  const category = product.category || '';
  
  return (
    <Link 
      to={`/product/${product.id}`}
      className="bg-cornsilk rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] hover:translate-y-[-5px] transition-all duration-300 h-full flex flex-col group block"
      aria-label={`View details about ${product.name}`}
    >
      <div className="relative bg-white overflow-hidden aspect-square">
        <ProgressiveImage
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          fetchPriority="auto"
        />
        <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
          {product.isBestSeller && (
            <span className="bg-saffron text-xs sm:text-sm text-charcoal-dark font-medium px-2 py-1 rounded-full shadow-md">
              Best Seller
            </span>
          )}
          {product.showInHero && (
            <span className="bg-charcoal text-xs sm:text-sm text-white font-medium px-2 py-1 rounded-full ml-auto shadow-md">
              Hero
            </span>
          )}
        </div>
        
        {product.outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-bold uppercase bg-red-600 px-4 py-2 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-3 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-charcoal-dark line-clamp-2">{product.name}</h3>
        
        <div className="flex-grow">
          {category && (
            <span className="inline-block px-3 py-1 bg-saffron/10 rounded-full text-xs text-charcoal-dark">
              {category}
            </span>
          )}
        </div>
        
        {/* View Details Button */}
        <div className="mt-auto pt-2">
          <div className="bg-charcoal group-hover:bg-saffron text-white group-hover:text-charcoal-dark font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-lg">
            <span className="text-sm">View Details</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard);
