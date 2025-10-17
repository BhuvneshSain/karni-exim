import { useState, useEffect } from "react";
import { db, storage } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore/lite';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage, needsCompression } from '../utils/imageOptimizer';
import LoadingSpinner from './LoadingSpinner';
import { 
  FaImage, FaTrash, FaPlus, FaCheckCircle, 
  FaTimesCircle, FaEdit, FaBan
} from 'react-icons/fa';
import DOMPurify from 'dompurify';

const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUIRED_WIDTH = 1920;
const REQUIRED_HEIGHT = 1080;

const HeroManagement = () => {
  const [heroImage, setHeroImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editHeroId, setEditHeroId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch heroes from Firestore
  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "heroes"));
      const heroData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHeroes(heroData);
    } catch (error) {
      console.error("Error fetching heroes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate image preview
  useEffect(() => {
    if (heroImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(heroImage);
    } else if (typeof heroImage === 'string') {
      setPreviewImage(heroImage);
    } else {
      setPreviewImage(null);
    }
  }, [heroImage]);

  // Sanitize HTML content
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  };

  // Validate image dimensions
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
          resolve(true);
        } else {
          reject(`Image must be exactly ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT} pixels. Your image is ${img.width}x${img.height} pixels.`);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject('Failed to load image');
      };
      
      img.src = objectUrl;
    });
  };

  // Validate image file
  const validateImageFile = async (file) => {
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      return `Invalid file format. Only JPG, PNG, and WebP are allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }
    
    // Validate dimensions
    try {
      await validateImageDimensions(file);
      return null;
    } catch (error) {
      return error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    const error = await validateImageFile(file);
    if (error) {
      setValidationErrors(prev => ({ ...prev, image: error }));
      return;
    }

    setHeroImage(file);
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  // Remove image
  const removeImage = () => {
    setHeroImage(null);
    setPreviewImage(null);
  };

  // Validate form
  const validateForm = async () => {
    const errors = {};
    
    if (!heroImage && !editHeroId) {
      errors.image = "Hero image is required";
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
    
    const isValid = await validateForm();
    if (!isValid) {
      setErrorMessage("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload image
      let imageUrl = null;

      if (heroImage instanceof File) {
        setUploadProgress(50);
        const timestamp = Date.now();
        const imagePath = `heroes/hero_${timestamp}.${heroImage.type.split('/')[1]}`;
        imageUrl = await uploadImageWithRetry(heroImage, imagePath);
        setUploadProgress(100);
      } else if (typeof heroImage === 'string') {
        imageUrl = heroImage;
      }

      const heroData = {
        image: imageUrl,
        link: "/products", // Always links to products page
        updatedAt: Timestamp.now(),
      };
      
      if (!editHeroId) {
        heroData.createdAt = Timestamp.now();
      }

      if (editHeroId) {
        const heroRef = doc(db, "heroes", editHeroId);
        await updateDoc(heroRef, heroData);
        alert("✅ Hero banner updated successfully!");
      } else {
        await addDoc(collection(db, "heroes"), heroData);
        alert("✅ Hero banner added successfully!");
      }

      resetForm();
      fetchHeroes();
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(`Failed to ${editHeroId ? 'update' : 'upload'} hero banner: ${err.message}`);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setHeroImage(null);
    setPreviewImage(null);
    setEditHeroId(null);
    setValidationErrors({});
    setErrorMessage("");
  };

  // Handle edit
  const handleEdit = (hero) => {
    setEditHeroId(hero.id);
    setHeroImage(hero.image || null);
    setPreviewImage(hero.image || null);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this hero banner? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "heroes", id));
      alert("✅ Hero banner deleted successfully!");
      fetchHeroes();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ Failed to delete hero banner: ${err.message}`);
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          {editHeroId ? '✏️ Edit Hero Banner' : '🎯 Add New Hero Banner'}
        </h2>
        <p className="text-white mt-2 opacity-90">
          {editHeroId ? 'Update your hero banner image' : 'Upload a 1920x1080 image for the homepage carousel'}
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
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="shadow-lg">
        {/* SECTION: Hero Image */}
        <div className="p-6 border-b-2 border-l border-r border-t-0 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaImage className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Hero Image</h3>
            </div>
            {heroImage && (
              <span className="text-sm font-bold px-4 py-2 bg-green-600 text-white rounded-full shadow-md">
                ✓ Image Uploaded
              </span>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-purple-200 mb-4">
            <p className="text-sm text-gray-900 font-medium mb-2">
              📸 <strong>Upload exactly 1 image</strong> for the hero banner.
            </p>
    <p className="text-sm text-gray-900 font-medium mb-2">
              📐 <strong>Required Size: {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels (1920x1080)</strong>
            </p>
            <p className="text-sm text-gray-900 font-medium mb-2">
              🔗 <strong>This image will link to the Products page (/products) when clicked.</strong>
            </p>
            <p className="text-sm text-gray-700">
              <strong>Accepted formats:</strong> JPG, PNG, WebP | <strong>Max size:</strong> 5MB
            </p>
          </div>

          {validationErrors.image && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <FaTimesCircle /> {validationErrors.image}
              </p>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <div className={`border-4 rounded-xl p-6 transition-all duration-200 shadow-md ${
              previewImage 
                ? 'border-green-500 bg-green-50' 
                : 'border-dashed border-gray-400 bg-white hover:border-purple-500 hover:shadow-lg'
            }`}>
              {previewImage ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-900 bg-white px-3 py-2 rounded shadow-sm">
                      Hero Banner Image
                    </span>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm flex items-center gap-2"
                      title="Remove image"
                    >
                      <FaTrash size={14} />
                      Remove
                    </button>
                  </div>
                  <div className="w-full aspect-video bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src={previewImage} 
                      alt="Hero Banner Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="w-full aspect-video border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center hover:border-purple-600 hover:bg-purple-50 transition-all">
                    <FaPlus className="text-gray-500 text-6xl mb-4" />
                    <span className="text-lg text-gray-700 font-medium mb-2">Click to upload hero image</span>
                    <span className="text-sm text-gray-500">1920x1080 pixels required</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {submitting && uploadProgress > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="">
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-gray-300"
          >
            <FaBan className="inline mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editHeroId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <FaCheckCircle />
                {editHeroId ? 'Update Hero Banner' : 'Add Hero Banner'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hero Banners List */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🎯 Active Hero Banners
            <span className="text-sm font-normal text-gray-500">({heroes.length})</span>
          </h3>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading hero banners..." />
        ) : heroes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-purple-50 rounded-full flex items-center justify-center">
              <FaImage className="text-6xl text-purple-300" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">No Hero Banners Yet</h4>
            <p className="text-gray-600 mb-6">
              Create your first hero banner to display on the homepage carousel.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              <FaPlus /> Add Your First Hero Banner
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {heroes.map((hero) => (
              <motion.div 
                key={hero.id} 
                className="bg-white p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Hero Image */}
                  {hero.image && (
                    <div className="w-full lg:w-64 aspect-video flex-shrink-0">
                      <img 
                        src={hero.image} 
                        alt={hero.title} 
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200" 
                      />
                    </div>
                  )}

                  {/* Hero Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <h4 className="font-bold text-xl text-gray-800">Hero Banner</h4>
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full border border-purple-300">
                        🔗 Links to Products Page
                      </span>
                    </div>

                    {/* Image Info */}
                    {hero.image && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Hero Banner Image</p>
                        <p className="text-sm text-gray-600">Size: 1920x1080 pixels</p>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Created:</span>
                        <span>{formatDate(hero.createdAt)}</span>
                      </div>
                      {hero.updatedAt && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Updated:</span>
                          <span>{formatDate(hero.updatedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hero.id)}
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

export default HeroManagement;
