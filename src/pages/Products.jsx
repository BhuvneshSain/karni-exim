// src/pages/Products.js
import { useState } from 'react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products
    : products.filter(p => p.category === selectedCategory);
  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  return (
    <div className="w-full bg-beige py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal-dark mb-6 md:mb-8">Our Products</h2>
      
      <div className="mb-6 md:mb-8 flex gap-2 md:gap-3 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-base md:text-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-charcoal text-white'
                : 'bg-cornsilk hover:bg-saffron/20'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default Products;
