import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const hoverImage = product.additionalImages?.[0];

  return (
    <div
      className="border p-4 rounded hover:shadow-lg transition relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered && hoverImage ? hoverImage : product.mainImage}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <div className="flex flex-wrap gap-1 text-xs mt-1">
        {product.badges?.new && <span className="bg-green-200 text-green-800 px-2 py-1 rounded">New</span>}
        {product.badges?.limitedStock && <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Limited</span>}
        {product.badges?.ecoFriendly && <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded">Eco</span>}
      </div>
      {product.outOfStock && <p className="text-red-600 mt-1 text-sm">Out of Stock</p>}
    </div>
  );
};

export default ProductCard;
