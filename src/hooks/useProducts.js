import { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';

// Cache for storing products data
const productsCache = {
  allProducts: null,
  categories: {},
  bestSellers: null,
  timestamp: null
};

// Cache validity duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

const useProducts = (options = {}) => {
  const { 
    category = null,
    isBestSeller = false,
    limit: queryLimit = null,
    filterOutOfStock = false,
    revalidate = false 
  } = options;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Determine if we should use cache
  const shouldUseCache = () => {
    if (revalidate) return false;
    if (!productsCache.timestamp) return false;
    
    const now = new Date().getTime();
    return (now - productsCache.timestamp) < CACHE_DURATION;
  };

  // Load more products (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || !lastVisible) return;
    
    setLoading(true);
    
    try {
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible)
      );
      
      if (category) {
        q = query(q, where('category', '==', category));
      }
      
      if (isBestSeller) {
        q = query(q, where('isBestSeller', '==', true));
      }
      
      if (queryLimit) {
        q = query(q, limit(queryLimit));
      }
      
      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setProducts(prev => [...prev, ...newProducts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length > 0);
    } catch (err) {
      console.error("Error fetching additional products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, isBestSeller, queryLimit, lastVisible, hasMore]);

  // Initial data fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we can use cache
        const useCache = shouldUseCache();
        
        // If cache exists and is valid for the specific query
        if (useCache) {
          let cachedData;
          
          // Determine which data to use from cache
          if (category && productsCache.categories[category]) {
            cachedData = productsCache.categories[category];
          } else if (isBestSeller && productsCache.bestSellers) {
            cachedData = productsCache.bestSellers;
          } else if (!category && !isBestSeller && productsCache.allProducts) {
            cachedData = productsCache.allProducts;
          }
          
          // If we have cached data for this query
          if (cachedData) {
            // Apply filter if needed
            let filteredData = filterOutOfStock 
              ? cachedData.filter(p => !p.outOfStock) 
              : cachedData;
              
            // Apply limit if needed
            if (queryLimit && filteredData.length > queryLimit) {
              filteredData = filteredData.slice(0, queryLimit);
              setHasMore(true);
            } else {
              setHasMore(false);
            }
            
            setProducts(filteredData);
            setLoading(false);
            return;
          }
        }
        
        // If not using cache or cache doesn't have what we need, fetch from Firebase
        let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        
        if (category) {
          q = query(q, where('category', '==', category));
        }
        
        if (isBestSeller) {
          q = query(q, where('isBestSeller', '==', true));
        }
        
        if (queryLimit) {
          q = query(q, limit(queryLimit));
        }
        
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply out of stock filter if needed
        const filteredItems = filterOutOfStock ? items.filter(p => !p.outOfStock) : items;
        
        // Update cache
        const now = new Date().getTime();
        productsCache.timestamp = now;
        
        if (category) {
          productsCache.categories[category] = items;
        } else if (isBestSeller) {
          productsCache.bestSellers = items;
        } else {
          productsCache.allProducts = items;
        }
        
        setProducts(filteredItems);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(filteredItems.length >= (queryLimit || 0) && snapshot.docs.length > 0);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, isBestSeller, queryLimit, filterOutOfStock, revalidate]);

  return { products, loading, error, hasMore, loadMore };
};

export default useProducts;
