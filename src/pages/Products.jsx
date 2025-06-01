import React, { useState } from 'react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = category === 'All'
    ? products
    : products.filter(p => p.category === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Our Products</h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full border font-medium transition ${
              cat === category
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
