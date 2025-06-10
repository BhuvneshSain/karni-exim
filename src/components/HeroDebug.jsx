import { useState, useEffect } from 'react';
// Import Firebase components individually to avoid resolution issues
import { collection } from 'firebase/firestore/lite';
import { query } from 'firebase/firestore/lite';
import { where } from 'firebase/firestore/lite';
import { getDocs } from 'firebase/firestore/lite';
import { doc } from 'firebase/firestore/lite';
import { updateDoc } from 'firebase/firestore/lite';
import { db } from '../firebase';

/**
 * This is a debugging component to help diagnose hero image issues.
 * It's not meant to be used in production but can be added temporarily for testing.
 * 
 * Usage:
 * 1. Add <HeroDebug /> component anywhere in your app
 * 2. Use it to see what products are marked as hero products
 * 3. Fix any issues with hero flags or images
 * 4. Remove this component when done
 */

const HeroDebug = () => {
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    fetchHeroProducts();
  }, []);
  
  const fetchHeroProducts = async () => {
    try {
      setLoading(true);
      
      // First, get products specifically marked as hero
      const heroQuery = query(
        collection(db, "products"),
        where("isHero", "==", true)
      );
      const heroSnapshot = await getDocs(heroQuery);
      
      const heroProds = heroSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setHeroProducts(heroProds);
      console.log("Hero products:", heroProds);
      
      if (heroProds.length === 0) {
        setMessage("No products are marked as hero products. Use the admin panel to set a product as hero.");
      } else {
        const missingHeroImages = heroProds.filter(p => !p.heroImage);
        if (missingHeroImages.length > 0) {
          setMessage(`${missingHeroImages.length} hero product(s) are missing a hero image.`);
        } else {
          setMessage(`${heroProds.length} hero product(s) found with proper images.`);
        }
      }
    } catch (error) {
      console.error("Error fetching hero products:", error);
      setMessage("Error fetching hero products: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fixHeroFlag = async (productId, setHero) => {
    try {
      await updateDoc(doc(db, "products", productId), {
        isHero: setHero
      });
      
      setMessage(`Product ${productId} updated successfully!`);
      fetchHeroProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Error updating product: " + error.message);
    }
  };
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-auto hero-debug-panel">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Hero Debug Panel</h3>
        <button 
          onClick={() => document.querySelector('.hero-debug-panel').remove()} 
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-3 pb-2 border-b">
        <p className="text-sm text-gray-600">{message}</p>
        <button 
          onClick={fetchHeroProducts} 
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-2">
          {heroProducts.map(product => (
            <div key={product.id} className="border rounded p-2">
              <div className="flex gap-2 items-center mb-1">
                <img 
                  src={product.mainImage} 
                  alt={product.name} 
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.id}</p>
                </div>
              </div>
              
              <div className="flex flex-col mt-1">
                <div className="flex gap-2 mt-1">
                  <p className="text-xs">Hero Image: </p>
                  {product.heroImage ? (
                    <span className="text-xs text-green-600">✓ Present</span>
                  ) : (
                    <span className="text-xs text-red-600">✗ Missing</span>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => fixHeroFlag(product.id, false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs"
                  >
                    Remove Hero Flag
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {heroProducts.length === 0 && (
            <p className="text-sm text-gray-600">No hero products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroDebug;
