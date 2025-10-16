// src/pages/Products.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Read category from URL on mount and when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products
    : products.filter(p => p.category === selectedCategory);
  
  // Handle category change - update both state and URL
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({}); // Clear query params
    } else {
      setSearchParams({ category }); // Set category query param
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;
  
  return (
    <div className="w-full bg-beige py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal-dark mb-6 md:mb-8">Our Products</h2>
      
        {/* Filter Section */}
        <div className="mb-8">
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <label htmlFor="category-select" className="block text-sm font-medium text-charcoal-dark mb-2">
              Filter by Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-charcoal/20 bg-white text-charcoal-dark font-medium focus:border-saffron focus:outline-none transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex md:flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-charcoal text-white shadow-md scale-105'
                    : 'bg-cornsilk text-charcoal-dark hover:bg-saffron hover:text-white hover:shadow-md'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
