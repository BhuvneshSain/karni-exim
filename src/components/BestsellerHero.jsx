import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../firebase';

// This is a utility component to help migrate bestseller products to also be hero products
// You can remove this component after you've converted your bestsellers to hero products
const BestsellerHero = () => {
  const navigate = useNavigate();

  const convertBestsellersToHero = async () => {
    try {
      // This is a migration utility only, not for regular use
      console.log('This is a migration utility. Please use the ProductForm to manage hero products.');
    } catch (error) {
      console.error("Error converting bestsellers:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Bestseller to Hero Migration</h2>
      <p className="mb-4">
        The website has been updated with a new Hero Section that replaces the Bestseller Carousel.
        To add products to the Hero Section, please use the Product Form and check the 
        "Show in Hero Banner" checkbox, along with uploading a hero image.
      </p>
      <div className="flex flex-wrap gap-4 mt-6">
        <button
          onClick={() => navigate('/admin')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
};

export default BestsellerHero;