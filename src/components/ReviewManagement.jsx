import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, writeBatch } from 'firebase/firestore/lite';
import { motion } from 'framer-motion';
import { FaStar, FaTrash, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
    // Fetch reviews on component mount and update existing reviews to have isAdmin flag
  useEffect(() => {
    fetchReviews();
    updateExistingReviewsToAdmin();
  }, []);
  
  // This function updates all existing reviews to have the isAdmin flag
  const updateExistingReviewsToAdmin = async () => {
    try {
      const reviewsSnapshot = await getDocs(collection(db, "reviews"));
      
      // Skip if no reviews
      if (reviewsSnapshot.empty) return;
      
      const batch = writeBatch(db);
      let updateCount = 0;
      
      reviewsSnapshot.docs.forEach(docSnapshot => {
        const reviewData = docSnapshot.data();
        // Only update if isAdmin flag doesn't exist
        if (reviewData.isAdmin === undefined) {
          batch.update(doc(db, "reviews", docSnapshot.id), {
            isAdmin: true
          });
          updateCount++;
        }
      });
      
      // Only commit if there are updates to make
      if (updateCount > 0) {
        await batch.commit();
        console.log(`Updated ${updateCount} existing reviews with isAdmin flag`);
      }
    } catch (error) {
      console.error("Error updating existing reviews:", error);
    }
  };
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsSnapshot = await getDocs(collection(db, "reviews"));
      const reviewsList = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const reviewData = {
      name,
      company,
      location,
      rating: Number(rating),
      text,
      approved: true,
      isAdmin: true,
      createdAt: Timestamp.now()
    };
    
    try {
      if (editingId) {
        // Update existing review
        await updateDoc(doc(db, "reviews", editingId), reviewData);
        alert("Review updated successfully!");
      } else {
        // Add new review
        await addDoc(collection(db, "reviews"), reviewData);
        alert("Review added successfully!");
      }
      
      // Reset form
      resetForm();
      // Refresh reviews list
      fetchReviews();
    } catch (error) {
      console.error("Error saving review:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleEdit = (review) => {
    setName(review.name);
    setCompany(review.company);
    setLocation(review.location);
    setRating(review.rating);
    setText(review.text);
    setEditingId(review.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
        alert("Review deleted successfully!");
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };
  
  const toggleApproval = async (review) => {
    try {
      await updateDoc(doc(db, "reviews", review.id), {
        approved: !review.approved
      });
      fetchReviews();
    } catch (error) {
      console.error("Error updating review status:", error);
      alert(`Error: ${error.message}`);
    }
  };
    const resetForm = () => {
    setName('');
    setCompany('');
    setLocation('');
    setRating(5);
    setText('');
    setEditingId(null);
    setShowForm(false);  };
    return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          {showForm ? (editingId ? 'Edit Review' : 'Add New Review') : 'Review Management'}
        </h2>        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'bg-gray-300 text-gray-900 border-gray-400' : 'bg-saffron text-white border-saffron'} px-4 py-2 rounded shadow-md hover:shadow-lg transition font-medium border`}
          >
            {showForm ? 'Cancel' : 'Add New Review'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded border border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-saffron hover:bg-saffron/90 text-white font-semibold rounded shadow-md hover:shadow-lg border border-saffron"
            >
              {editingId ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </motion.form>
      )}
      
      {/* Reviews List */}      <div>        {loading ? (
          <LoadingSpinner text="Loading reviews..." />
        ) :reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg ${review.approved ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-gray-600">{review.company}, {review.location}</p>
                    <div className="flex my-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                          size={16}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mt-2">{review.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {review.createdAt?.toDate().toLocaleDateString() || 'Date unavailable'}
                    </p>                    <p className="text-xs text-gray-400 mt-1">
                      Added: {review.createdAt?.toDate().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleApproval(review)}
                      className={`p-2 rounded-full ${review.approved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                      title={review.approved ? 'Unapprove Review' : 'Approve Review'}
                    >
                      {review.approved ? <FaCheck /> : <FaTimes />}
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600"
                      title="Edit Review"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600"
                      title="Delete Review"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className={`mt-2 px-3 py-1 inline-block rounded-full text-xs ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {review.approved ? 'Approved' : 'Not Approved'}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found. Add your first review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
