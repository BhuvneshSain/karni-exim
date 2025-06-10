import { useState, useEffect } from "react";
import { db, storage } from '../firebase';
import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useProducts from '../hooks/useProducts';
import { motion } from 'framer-motion';
import { validateImageDimensions } from '../utils/imageOptimizer';
import Tooltip from './Tooltip';
import { getImageSizeRecommendation, formatImageRecommendation } from '../utils/imageSizeRecommendations';

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [previewHeroImage, setPreviewHeroImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [previewOtherImages, setPreviewOtherImages] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const { products, loading } = useProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Effect to handle image previews
  useEffect(() => {
    if (mainImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewMainImage(reader.result);
      };
      reader.readAsDataURL(mainImage);
    } else {
      setPreviewMainImage(null);
    }

    if (heroImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewHeroImage(reader.result);
      };
      reader.readAsDataURL(heroImage);
    } else {
      setPreviewHeroImage(null);
    }

    // Preview for multiple other images
    if (otherImages.length > 0) {
      const previewUrls = [];
      Array.from(otherImages).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result);
          if (previewUrls.length === otherImages.length) {
            setPreviewOtherImages(previewUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviewOtherImages([]);
    }
  }, [mainImage, heroImage, otherImages]);

  useEffect(() => {
    // When editing product, fetch existing image URLs
    const fetchExistingProduct = async () => {
      if (editProductId) {
        try {
          const productDoc = await getDoc(doc(db, "products", editProductId));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            if (productData.mainImage) {
              setPreviewMainImage(productData.mainImage);
            }
            if (productData.heroImage) {
              setPreviewHeroImage(productData.heroImage);
            }
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    if (editProductId) {
      fetchExistingProduct();
    }
  }, [editProductId]);

  const validateForm = async () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = "Product name is required";
    }
    
    if (!category) {
      errors.category = "Category is required";
    } else if (category === 'custom' && !customCategory.trim()) {
      errors.customCategory = "Custom category name is required";
    }
    
    if (!mainImage && !editProductId && !previewMainImage) {
      errors.mainImage = "Main image is required";
    }
    
    if (isHero && !heroImage && !editProductId && !previewHeroImage) {
      errors.heroImage = "Hero image is required when 'Show in Hero Banner' is selected";
    }
    
    // Check hero image dimensions if a new image is being uploaded
    if (isHero && heroImage) {
      try {
        const dimensions = await validateImageDimensions(heroImage, 1200, 800);
        if (!dimensions.isValid) {
          errors.heroImage = `Image too small. Hero images should be at least 1200x800 pixels. Your image is ${dimensions.width}x${dimensions.height}.`;
        }
        if (dimensions.aspectRatio < 1.3) {
          errors.heroImage = "Image should have a landscape orientation for best display in the hero banner.";
        }
      } catch (error) {
        console.error("Error validating image dimensions:", error);
        errors.heroImage = "Failed to validate image dimensions. Please try a different image.";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!(await validateForm())) {
      return;
    }
    
    setSubmitting(true);

    try {
      let mainImageUrl = previewMainImage;
      if (mainImage) {
        const mainRef = ref(storage, `products/${Date.now()}_${mainImage.name}`);
        await uploadBytes(mainRef, mainImage);
        mainImageUrl = await getDownloadURL(mainRef);
      }

      let heroImageUrl = previewHeroImage;
      if (heroImage && isHero) {
        const heroRef = ref(storage, `products/hero_${Date.now()}_${heroImage.name}`);
        await uploadBytes(heroRef, heroImage);
        heroImageUrl = await getDownloadURL(heroRef);
        console.log("Hero image uploaded:", heroImageUrl); // Debug log
      }

      const otherImageUrls = [];
      for (let file of otherImages) {
        const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        otherImageUrls.push(url);
      }

      const productData = {
        name,
        category: category === 'custom' ? customCategory : category,
        description,
        isBestSeller,
        isHero, // Explicitly set isHero flag
        badges: [],
        updatedAt: Timestamp.now(),
      };
      
      // Only set createdAt on new products
      if (!editProductId) {
        productData.createdAt = Timestamp.now();
      }

      if (mainImageUrl) productData.mainImage = mainImageUrl;
      if (heroImageUrl && isHero) productData.heroImage = heroImageUrl;
      if (otherImageUrls.length > 0) {
        // Merge with existing other images if we're editing
        if (editProductId) {
          const productDoc = await getDoc(doc(db, "products", editProductId));
          if (productDoc.exists() && productDoc.data().otherImages) {
            const existingImages = productDoc.data().otherImages;
            productData.otherImages = [...existingImages, ...otherImageUrls];
          } else {
            productData.otherImages = otherImageUrls;
          }
        } else {
          productData.otherImages = otherImageUrls;
        }
      }

      if (editProductId) {
        const productRef = doc(db, "products", editProductId);
        await updateDoc(productRef, productData);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        alert("Product added successfully!");
      }

      // Reset form
      setName(""); 
      setCategory(""); 
      setCustomCategory(""); 
      setDescription("");
      setMainImage(null); 
      setHeroImage(null); 
      setOtherImages([]); 
      setPreviewMainImage(null);
      setPreviewHeroImage(null);
      setPreviewOtherImages([]);
      setIsBestSeller(false); 
      setIsHero(false); 
      setEditProductId(null);
      setValidationErrors({});
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload product. Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditProductId(product.id);
    setName(product.name);
    setCategory(product.category);
    setCustomCategory("");
    setDescription(product.description);
    setIsBestSeller(product.isBestSeller || false);
    setIsHero(product.isHero || false);
    // Reset file inputs but keep preview URLs
    setMainImage(null);
    setHeroImage(null);
    setOtherImages([]);
    setPreviewMainImage(product.mainImage);
    setPreviewHeroImage(product.heroImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        alert("Product deleted successfully!");
        window.location.reload(); // Refresh the page
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  const handleCancel = () => {
    setName(""); 
    setCategory(""); 
    setCustomCategory(""); 
    setDescription("");
    setMainImage(null); 
    setHeroImage(null); 
    setOtherImages([]); 
    setPreviewMainImage(null);
    setPreviewHeroImage(null);
    setPreviewOtherImages([]);
    setIsBestSeller(false); 
    setIsHero(false);
    setEditProductId(null);
    setValidationErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        {editProductId ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border rounded px-4 py-2 w-full ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`border rounded px-4 py-2 w-full ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">Other (type below)</option>
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>
            )}
          </div>
        </div>

        {category === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category</label>
            <input
              type="text"
              placeholder="New Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className={`border rounded px-4 py-2 w-full ${validationErrors.customCategory ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.customCategory && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.customCategory}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">          {/* Main Image Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700">Main Product Image:</label>
              <Tooltip text={getImageSizeRecommendation('main').description}>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-gray-700 text-xs font-bold cursor-help">?</span>
              </Tooltip>
            </div>
            <input
              type="file"
              onChange={(e) => setMainImage(e.target.files[0])}
              className={`w-full border px-3 py-2 rounded ${validationErrors.mainImage ? 'border-red-500' : 'border-gray-300'}`}
              accept="image/*"
            />
            <p className="text-xs text-blue-600 mt-1">
              Recommended size: {formatImageRecommendation('main')}
            </p>
            {validationErrors.mainImage && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.mainImage}</p>
            )}
            {previewMainImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={previewMainImage} alt="Product preview" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>          {/* Hero Image Upload */}
          <div className={`space-y-2 ${isHero ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-700">Hero Banner Image:</label>
                <Tooltip text={getImageSizeRecommendation('hero').description}>
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-gray-700 text-xs font-bold cursor-help">?</span>
                </Tooltip>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHero"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="isHero" className="text-sm font-medium text-gray-700">Show in Hero Banner</label>
              </div>
            </div>
            <input
              type="file"
              onChange={(e) => setHeroImage(e.target.files[0])}
              className={`w-full border px-3 py-2 rounded ${validationErrors.heroImage ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!isHero}
              accept="image/*"
            />
            {validationErrors.heroImage && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.heroImage}</p>
            )}            {isHero ? (
              <p className="text-xs text-blue-600 mt-1">
                Recommended size: {formatImageRecommendation('hero')}
              </p>
            ) : (
              <p className="text-xs text-amber-600 mt-1">
                Enable "Show in Hero Banner" to upload a hero image.
              </p>
            )}
            {previewHeroImage && isHero && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Hero Preview:</p>
                <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={previewHeroImage} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>        {/* Other Images */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">Additional Images:</label>
            <Tooltip text={getImageSizeRecommendation('additional').description}>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-gray-700 text-xs font-bold cursor-help">?</span>
            </Tooltip>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => setOtherImages([...e.target.files])}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            accept="image/*"
          />
          <p className="text-xs text-blue-600 mt-1">
            Recommended size: {formatImageRecommendation('additional')} (multiple images allowed)
          </p>
          {previewOtherImages.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Previews:</p>
              <div className="grid grid-cols-3 gap-2">
                {previewOtherImages.map((preview, idx) => (
                  <div key={idx} className="w-full h-24 bg-gray-100 rounded overflow-hidden">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Tags and Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="h-4 w-4"
              />
              Mark as Bestseller
            </label>
          </div>
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editProductId ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              editProductId ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </form>

      {/* Product List */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4 text-blue-700">Uploaded Products</h3>        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) :(
          <div className="space-y-4">
            {products.map((p) => (              <div key={p.id} className="p-4 border rounded shadow-sm bg-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg">{p.name}</h4>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {p.isBestSeller && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                        Bestseller
                      </span>
                    )}
                    {p.isHero && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Hero Banner
                      </span>
                    )}
                  </div>
                  
                  {/* Additional Images Preview */}
                  {p.otherImages && p.otherImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Additional Images:</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {p.otherImages.slice(0, 5).map((img, idx) => (
                          <div key={idx} className="w-12 h-12 flex-shrink-0">
                            <img src={img} alt={`${p.name} ${idx + 1}`} className="w-full h-full object-cover rounded border border-gray-200" />
                          </div>
                        ))}
                        {p.otherImages.length > 5 && (
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{p.otherImages.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-8">No products added yet.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductForm;
