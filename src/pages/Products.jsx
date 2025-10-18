// src/pages/Products.js
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);
  
  // Read category from URL on mount and when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    uniqueCategories.sort((a, b) => a.localeCompare(b));
    return ['all', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const sortOptions = useMemo(() => ([
    { value: 'featured', label: 'Featured (default)' },
    { value: 'popular', label: 'Popularity' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest Arrivals' },
  ]), []);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'popular':
        return list.sort((a, b) => {
          const bestSellerScoreA = a.isBestSeller ? 0 : 1;
          const bestSellerScoreB = b.isBestSeller ? 0 : 1;
          if (bestSellerScoreA !== bestSellerScoreB) {
            return bestSellerScoreA - bestSellerScoreB;
          }
          const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER;
          const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        });
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return list.sort((a, b) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bTime - aTime;
        });
      case 'featured':
      default:
        return list.sort((a, b) => {
          const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER;
          const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER;
          if (orderA !== orderB) return orderA - orderB;
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return bTime - aTime;
        });
    }
  }, [filteredProducts, sortOption]);
  
  // Handle category change - update both state and URL
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({}); // Clear query params
    } else {
      setSearchParams({ category }); // Set category query param
    }
  };
  const handleSortChange = (value) => {
    setSortOption(value);
    setSortMenuOpen(false);
  };

  useEffect(() => {
    const handleClickAway = (event) => {
      if (!sortMenuOpen) return;
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [sortMenuOpen]);

  if (loading) return <LoadingSpinner text="Loading products..." />;
  
  return (
    <div className="w-full bg-beige py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-dark">Our Products</h2>
          <div className="hidden md:flex items-center gap-3 relative" ref={sortMenuRef}>
            <button
              type="button"
              onClick={() => setSortMenuOpen(prev => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-charcoal/15 rounded-md text-sm font-medium text-charcoal-dark bg-white shadow-sm hover:border-saffron hover:text-saffron transition-all"
            >
              <span className="uppercase text-[11px] tracking-wide text-gray-500">Sort</span>
              <span>{sortOptions.find(option => option.value === sortOption)?.label || 'Featured (default)'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {sortMenuOpen && (
              <div className="absolute top-full mt-2 right-4 w-56 rounded-md border border-charcoal/10 bg-white shadow-lg py-1 z-20">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortOption === option.value
                        ? 'bg-saffron text-white font-semibold'
                        : 'text-charcoal-dark hover:bg-cornsilk'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      
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

          <div className="md:hidden mt-4">
            <label htmlFor="sort-select-mobile" className="block text-sm font-medium text-charcoal-dark mb-2">
              Sort by
            </label>
            <select
              id="sort-select-mobile"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-charcoal/20 bg-white text-charcoal-dark text-sm font-medium focus:border-saffron focus:outline-none transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Categories */}
          <div className="hidden md:flex flex-wrap gap-x-1.5 gap-y-1.5 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold leading-snug transition-all duration-200 ${
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
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
