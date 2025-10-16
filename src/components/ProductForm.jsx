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
} from 'firebase/firestore/lite';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useProducts from '../hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImageDimensions, compressImage, needsCompression } from '../utils/imageOptimizer';
import LoadingSpinner from './LoadingSpinner';
import Tooltip from './Tooltip';
import { 
  FaImage, FaInfoCircle, FaCog, FaTrash,
  FaCopy, FaCheckCircle, FaTimesCircle, FaPlus, FaBoxOpen 
} from 'react-icons/fa';
import DOMPurify from 'dompurify';

const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUIRED_IMAGES = 5;
const REQUIRED_IMAGE_WIDTH = 800;
const REQUIRED_IMAGE_HEIGHT = 800;

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState(Array(REQUIRED_IMAGES).fill(null));
  const [previewImages, setPreviewImages] = useState(Array(REQUIRED_IMAGES).fill(null));
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const { products, loading } = useProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Generate image previews
  useEffect(() => {
    const newPreviews = [...previewImages];
    let completed = 0;

    productImages.forEach((file, index) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews[index] = reader.result;
          completed++;
          if (completed === productImages.filter(f => f instanceof File).length) {
            setPreviewImages(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      } else if (typeof file === 'string') {
        // Existing URL from editing
        newPreviews[index] = file;
      } else {
        newPreviews[index] = null;
      }
    });

    if (productImages.every(f => !f || typeof f === 'string')) {
      setPreviewImages(newPreviews);
    }
  }, [productImages]);

  // Validate image file
  const validateImageFile = (file) => {
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      return `Invalid file format. Only JPG, PNG, and WebP are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }
    return null;
  };

  // Validate image dimensions
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width === REQUIRED_IMAGE_WIDTH && img.height === REQUIRED_IMAGE_HEIGHT) {
            resolve(true);
          } else {
            reject(
              `Image dimensions must be exactly ${REQUIRED_IMAGE_WIDTH}x${REQUIRED_IMAGE_HEIGHT} pixels. ` +
              `Your image is ${img.width}x${img.height} pixels.`
            );
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload for specific slot
  const handleImageUpload = (index, file) => {
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setValidationErrors(prev => ({ ...prev, [`image_${index}`]: error }));
      return;
    }

    // Validate dimensions
    validateImageDimensions(file)
      .then(() => {
        const newImages = [...productImages];
        newImages[index] = file;
        setProductImages(newImages);
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`image_${index}`];
          return newErrors;
        });
      })
      .catch(error => {
        setValidationErrors(prev => ({ ...prev, [`image_${index}`]: error }));
      });
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    const newImages = [...productImages];
    newImages[index] = null;
    setProductImages(newImages);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`image_${index}`];
      return newErrors;
    });
  };

  // Validate form
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

    if (!description.trim()) {
      errors.description = "Description is required";
    }
    
    // Check if all 5 images are uploaded
    const uploadedImages = productImages.filter(img => img !== null);
    if (uploadedImages.length !== REQUIRED_IMAGES && !editProductId) {
      errors.images = `All ${REQUIRED_IMAGES} product images are required`;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Upload image with retry mechanism
  const uploadImageWithRetry = async (file, path, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const processedFile = needsCompression(file) 
          ? await compressImage(file) 
          : file;
        
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, processedFile);
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        console.log(`Upload attempt ${attempt + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Form validation
    const isValid = await validateForm();
    if (!isValid) {
      setErrorMessage("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // Sanitize inputs
      const sanitizedName = sanitizeInput(name);
      const sanitizedDescription = sanitizeInput(description);
      const finalCategory = category === 'custom' ? sanitizeInput(customCategory) : category;

      // Upload images
      const imageUrls = [];
      const totalImages = productImages.filter(img => img instanceof File).length;
      let uploadedCount = 0;

      for (let i = 0; i < productImages.length; i++) {
        const img = productImages[i];
        
        if (img instanceof File) {
          const timestamp = Date.now();
          const imagePath = `products/${sanitizedName.replace(/\s+/g, '_')}_${timestamp}_${i}.${img.type.split('/')[1]}`;
          const url = await uploadImageWithRetry(img, imagePath);
          imageUrls.push(url);
          
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalImages) * 100));
        } else if (typeof img === 'string') {
          // Existing URL from editing
          imageUrls.push(img);
        }
      }

      const productData = {
        name: sanitizedName,
        category: finalCategory,
        description: sanitizedDescription,
        images: imageUrls,
        mainImage: imageUrls[0] || '', 
        otherImages: imageUrls.slice(1) || [],
        isBestSeller,
        badges: [],
        updatedAt: Timestamp.now(),
      };
      
      if (!editProductId) {
        productData.createdAt = Timestamp.now();
      }

      if (editProductId) {
        const productRef = doc(db, "products", editProductId);
        await updateDoc(productRef, productData);
        alert("✅ Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        alert("✅ Product added successfully!");
        // Reload page after successful creation
        window.location.reload();
      }

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(`Failed to ${editProductId ? 'update' : 'upload'} product: ${err.message}`);
      setRetryCount(prev => prev + 1);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setName(""); 
    setCategory(""); 
    setCustomCategory(""); 
    setDescription("");
    setProductImages(Array(REQUIRED_IMAGES).fill(null));
    setPreviewImages(Array(REQUIRED_IMAGES).fill(null));
    setIsBestSeller(false);
    setEditProductId(null);
    setValidationErrors({});
    setErrorMessage("");
    setRetryCount(0);
  };

  // Handle edit
  const handleEdit = async (product) => {
    setEditProductId(product.id);
    setName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setIsBestSeller(product.isBestSeller || false);
    
    // Load existing images
    const existingImages = product.images || [];
    const imageArray = Array(REQUIRED_IMAGES).fill(null);
    existingImages.forEach((url, index) => {
      if (index < REQUIRED_IMAGES) {
        imageArray[index] = url;
      }
    });
    setProductImages(imageArray);
    setPreviewImages(imageArray);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle duplicate
  const handleDuplicate = (product) => {
    setName(product.name + " (Copy)");
    setCategory(product.category);
    setDescription(product.description);
    setIsBestSeller(false);
    setEditProductId(null);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete with better error handling
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "products", id));
      alert("✅ Product deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ Failed to delete product: ${err.message}`);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          {editProductId ? '✏️ Edit Product' : '➕ Add New Product'}
        </h2>
        <p className="text-white mt-2 opacity-90">
          {editProductId ? 'Update your product information' : 'Fill in the details to create a new product'}
        </p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded"
          >
            <div className="flex items-center gap-2">
              <FaTimesCircle className="text-red-500" />
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
            {retryCount > 0 && (
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} })}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Retry Upload
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="">
        {/* SECTION 1: Basic Information */}
        <div className="">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaInfoCircle className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1 font-medium">
                  <FaTimesCircle /> {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product-category" className="block text-sm font-semibold text-gray-900 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  validationErrors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">+ Add Custom Category</option>
              </select>
              {validationErrors.category && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1 font-medium">
                  <FaTimesCircle /> {validationErrors.category}
                </p>
              )}
            </div>

            {category === 'custom' && (
              <div className="md:col-span-2">
                <label htmlFor="custom-category" className="block text-sm font-semibold text-gray-900 mb-2">
                  Custom Category Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="custom-category"
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.customCategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.customCategory && (
                  <p className="text-red-600 text-sm mt-1 font-medium">{validationErrors.customCategory}</p>
                )}
              </div>
            )}

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className={`w-full px-4 py-3 border-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.description && (
                  <p className="text-red-600 text-sm font-medium">{validationErrors.description}</p>
                )}
                <p className="text-sm text-gray-600 ml-auto font-medium">{description.length} characters</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Product Images */}
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaImage className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Product Images</h3>
            </div>
            <span className="text-sm font-bold px-4 py-2 bg-blue-600 text-white rounded-full shadow-md">
              {productImages.filter(img => img !== null).length} / {REQUIRED_IMAGES} uploaded
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-blue-200 mb-4">
            <p className="text-sm text-gray-900 font-medium mb-2">
              📸 <strong>Upload exactly {REQUIRED_IMAGES} images</strong> for this product in order. Upload them from #1 to #5 sequentially.
            </p>
            <p className="text-sm text-gray-900 font-medium mb-2">
              ⭐ <strong>The first image (#1) will be used as the main product image.</strong>
            </p>
            <p className="text-sm text-gray-700">
              <strong>Accepted formats:</strong> JPG, PNG, WebP | <strong>Max size:</strong> 5MB per image
            </p>
          </div>

          {validationErrors.images && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <FaTimesCircle /> {validationErrors.images}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: REQUIRED_IMAGES }).map((_, index) => (
              <div key={index} className="relative">
                <div className={`border-4 rounded-xl p-3 transition-all duration-200 shadow-md ${
                  previewImages[index] 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-dashed border-gray-400 bg-white hover:border-blue-500 hover:shadow-lg'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm">
                      #{index + 1}
                      {index === 0 && <span className="text-blue-600 ml-1">(Main)</span>}
                    </span>
                    {previewImages[index] && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition shadow-sm"
                        title="Remove image"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>

                  {previewImages[index] ? (
                    <div className="w-full h-32 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src={previewImages[index]} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-all">
                        <FaPlus className="text-gray-500 text-3xl mb-2" />
                        <span className="text-sm text-gray-700 font-medium">Click to upload</span>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}

                  {validationErrors[`image_${index}`] && (
                    <p className="text-red-600 text-xs mt-2 font-medium">{validationErrors[`image_${index}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {submitting && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading images...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Settings */}
        <div className="">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCog className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <label className="flex items-center gap-4 p-5 border-3 border-yellow-300 bg-yellow-50 rounded-xl hover:border-yellow-500 hover:shadow-lg cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-6 h-6 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <div className="flex-1">
                <span className="font-bold text-gray-900 text-base">⭐ Mark as Bestseller</span>
                <p className="text-sm text-gray-700 mt-1">Product will show a yellow badge on the store</p>
              </div>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-lg flex flex-col sm:flex-row gap-4 justify-end border-t-2 border-gray-300">
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-gray-300"
          >
            ✕ Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editProductId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <FaCheckCircle />
                {editProductId ? 'Update Product' : 'Add Product'}
              </>
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBoxOpen className="text-blue-600" />
            Uploaded Products
            <span className="text-sm font-normal text-gray-500">({products.length})</span>
          </h3>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <FaBoxOpen className="text-6xl text-blue-300" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">No Products Yet</h4>
            <p className="text-gray-600 mb-6">
              Get started by adding your first product using the form above.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <FaPlus /> Add Your First Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <motion.div 
                key={p.id} 
                className="bg-white p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full lg:w-32 h-32 flex-shrink-0">
                    <img 
                      src={p.mainImage || p.images?.[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover rounded-lg border border-gray-200" 
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h4 className="font-bold text-xl text-gray-800">{p.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {p.isBestSeller && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full border border-yellow-300">
                            ⭐ Bestseller
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-300">
                          ✓ Published
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Category:</strong> {p.category}
                    </p>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {p.description}
                    </p>

                    {/* Images Preview */}
                    {p.images && p.images.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Product Images ({p.images.length}):</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {p.images.map((img, idx) => (
                            <div key={idx} className="w-16 h-16 flex-shrink-0 relative group">
                              <img 
                                src={img} 
                                alt={`${p.name} ${idx + 1}`} 
                                className="w-full h-full object-cover rounded border border-gray-200" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold">#{idx + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Created:</span>
                        <span>{formatDate(p.createdAt)}</span>
                      </div>
                      {p.updatedAt && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Updated:</span>
                          <span>{formatDate(p.updatedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                      >
                        <FaCopy /> Duplicate
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductForm;
