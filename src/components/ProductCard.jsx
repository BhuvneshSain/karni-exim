import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Handle missing fields gracefully
  const description = product.description || '';
  const badges = product.badges || [];

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-48 sm:h-52 md:h-60 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 space-y-1">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-300 text-xs sm:text-sm text-gray-800 font-medium px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-2 flex-grow flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 flex-grow line-clamp-3">
            {description.length > 80 ? `${description.slice(0, 80)}...` : description}
          </p>

          {product.outOfStock && (
            <span className="text-xs text-red-600 font-bold uppercase">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
