import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-60 object-cover"
          />
          {product.badges?.length > 0 && (
            <div className="absolute top-2 left-2 space-y-1">
              {product.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-300 text-sm text-gray-800 font-medium px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">
            {product.description.slice(0, 80)}...
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
