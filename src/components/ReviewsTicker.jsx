import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaQuoteRight, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore/lite';
import LoadingSpinner from './LoadingSpinner';
import './ReviewsTicker.css';

const ReviewCard = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="review-card flex-shrink-0 w-full md:w-[350px] bg-cornsilk rounded-xl shadow-lg p-6 mx-3 my-4"
    >
      <div className="flex items-center mb-4">
        <div className="review-avatar w-12 h-12 bg-saffron/20 rounded-full flex items-center justify-center text-charcoal font-bold text-lg mr-3">
          {review.name.substring(0, 1)}
        </div>
        <div>
          <h3 className="font-bold text-charcoal">{review.name}</h3>
          <p className="text-sm text-gray">{review.company}, {review.location}</p>
        </div>
      </div>
      
      <div className="flex mb-3 star-rating">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < review.rating ? "active-star" : "text-gray-300"} 
            style={{'--star-index': i}}
            size={18} 
          />
        ))}
      </div>
      
      <div className="relative">
        <FaQuoteLeft className="quote-icon quote-left absolute top-0 left-0 text-saffron opacity-50" size={20} />
        <p className="text-charcoal px-6 py-2">{review.text}</p>
        <FaQuoteRight className="quote-icon quote-right absolute bottom-0 right-0 text-saffron opacity-50" size={20} />
      </div>
    </motion.div>
  );
};

const ReviewsTicker = () => {
  const tickerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosisMode, setDiagnosisMode] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    totalReviews: 0,
    reviewsWithApproved: 0,
    reviewsWithIsAdmin: 0,
    reviewsWithBothFlags: 0,
    reviewsWithCreatedAt: 0,
    reviewsEligibleForDisplay: 0,
    configStatus: 'unknown'
  });
  
  // Function to retry fetching reviews
  const retryFetch = () => {
    setLoading(true);
    setError(null);
    setDiagnosisMode(true);
    fetchReviews();
  };
  
  // Fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      setDiagnosis(prev => ({ ...prev, configStatus: 'complete' }));
      
      // First try to get all reviews to see what's available
      const allReviewsSnapshot = await getDocs(collection(db, "reviews"));
      
      if (allReviewsSnapshot.empty) {
        setReviewsData([]);
        setDiagnosis(prev => ({ ...prev, totalReviews: 0 }));
        setLoading(false);
        return;
      }
      
      // Check if we have reviews with the necessary fields
      let hasProperReviews = false;
      let reviewsWithApproved = 0;
      let reviewsWithIsAdmin = 0;
      let reviewsWithBothFlags = 0;
      let reviewsWithCreatedAt = 0;
      let reviewsEligibleForDisplay = 0;
      
      allReviewsSnapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.approved === true) reviewsWithApproved++;
        if (data.isAdmin === true) reviewsWithIsAdmin++;
        if (data.approved === true && data.isAdmin === true) reviewsWithBothFlags++;
        if (data.createdAt) reviewsWithCreatedAt++;
        
        if (data.approved === true && data.isAdmin === true && data.createdAt) {
          hasProperReviews = true;
          reviewsEligibleForDisplay++;
        }
      });
      
      // Update diagnosis state
      setDiagnosis({
        totalReviews: allReviewsSnapshot.size,
        reviewsWithApproved,
        reviewsWithIsAdmin,
        reviewsWithBothFlags,
        reviewsWithCreatedAt,
        reviewsEligibleForDisplay,
        configStatus: 'complete'
      });
      
      if (!hasProperReviews) {
        if (reviewsWithBothFlags === 0) {
          setError("No reviews have both required flags (isAdmin=true AND approved=true)");
        } else if (reviewsWithCreatedAt === 0) {
          setError("Reviews exist but don't have valid createdAt timestamps");
        }
      }
      
      // Now try with the specific query
      try {
        // Create the query to get approved reviews added by admin
        const reviewsQuery = query(
          collection(db, "reviews"), 
          where("approved", "==", true),
          where("isAdmin", "==", true)
        );
        
        const reviewsSnapshot = await getDocs(reviewsQuery);
        if (!reviewsSnapshot.empty) {
          // Now sort them manually since we can't use orderBy if there might be missing createdAt fields
          const reviewsList = reviewsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(review => review.createdAt) // Ensure reviews have createdAt
          .sort((a, b) => {
            // Sort by createdAt in descending order (newest first)
            return b.createdAt.seconds - a.createdAt.seconds;
          });
          
          if (reviewsList.length > 0) {
            setReviewsData(reviewsList);
          } else {
            setReviewsData([]);
          }
        } else {
          setReviewsData([]);
        }
      } catch (queryError) {
        console.error("ReviewsTicker: Error with composite query:", queryError);
        
        // Fallback to simpler queries
        try {
          
          // Just get reviews with isAdmin=true first
          const adminReviewsQuery = query(
            collection(db, "reviews"), 
            where("isAdmin", "==", true)
          );
          
          const adminReviewsSnapshot = await getDocs(adminReviewsQuery);
          
          if (!adminReviewsSnapshot.empty) {
            const reviewsList = adminReviewsSnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
              .filter(review => review.approved === true); // Filter for approved
            
            setReviewsData(reviewsList);
          } else {
            setReviewsData([]);
          }
        } catch (fallbackError) {
          console.error("ReviewsTicker: Even fallback queries failed:", fallbackError);
          setReviewsData([]);
          setError(fallbackError.message);
        }
      }
    } catch (error) {
      console.error("ReviewsTicker: Error fetching reviews:", error);
      setError(error.message);
      setReviewsData([]);
    } finally {
      setLoading(false);
    }
  };
    
  // Initial fetch when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);
  
  // Create a duplicate set of reviews for continuous scrolling effect (only if we have reviews)
  const allReviews = reviewsData.length > 0 ? [...reviewsData, ...reviewsData, ...reviewsData] : [];
  
  // Calculate the width of ticker content for animation
  useEffect(() => {
    if (tickerRef.current) {
      const width = tickerRef.current.scrollWidth / 2;
      setTickerWidth(-width);
    }
  }, [reviewsData]);

  // Don't render the section if there are no reviews to show and we're not loading
  if (!loading && reviewsData.length === 0 && !error) {
    return null;
  }
  
  return (
    <section className="py-16 bg-beige w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-8 md:mb-12"
        >
          What Our Clients Say
        </motion.h2>
          {loading && <LoadingSpinner text="Loading reviews..." />}
        
        {error && import.meta.env.DEV && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 mx-auto max-w-2xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-red-400" size={24} />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error fetching reviews</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-gray-500">This message is only visible in development mode</p>
                  <button 
                    onClick={retryFetch}
                    className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-charcoal hover:bg-charcoal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron"
                  >
                    <FaSync className="mr-1" /> Retry
                  </button>
                </div>
              </div>
            </div>
            
            {diagnosisMode && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-sm">Review Diagnostics:</h4>
                <ul className="mt-2 text-xs space-y-1 text-gray-700">
                  <li>Firebase Config: <span className={diagnosis.configStatus === 'complete' ? 'text-green-600' : 'text-red-600'}>{diagnosis.configStatus === 'complete' ? 'Valid' : 'Invalid'}</span></li>
                  <li>Total Reviews: {diagnosis.totalReviews}</li>
                  <li>Reviews with isAdmin=true: {diagnosis.reviewsWithIsAdmin}</li>
                  <li>Reviews with approved=true: {diagnosis.reviewsWithApproved}</li>
                  <li>Reviews with both flags: {diagnosis.reviewsWithBothFlags}</li>
                  <li>Reviews with valid createdAt: {diagnosis.reviewsWithCreatedAt}</li>
                  <li>Reviews eligible for display: {diagnosis.reviewsEligibleForDisplay}</li>
                </ul>
                
                {diagnosis.totalReviews > 0 && diagnosis.reviewsEligibleForDisplay === 0 && (
                  <div className="mt-3 text-xs bg-yellow-50 p-2 rounded">
                    <strong>Recommendation:</strong> Run the fix-review-timestamps.mjs script to repair review data.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {!loading && (
          <div className="relative review-ticker">
            {/* Desktop Ticker - Horizontal Scroll */}
            <div 
              className="hidden md:block"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div 
                ref={tickerRef}
                className="flex"
                animate={{
                  x: isHovered ? 0 : [0, tickerWidth || -2000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  }
                }}
              >
                {allReviews.map((review, index) => (
                  <ReviewCard key={`${review.id}-${index}`} review={review} index={index % reviewsData.length} />
                ))}
              </motion.div>
              
              {/* Gradient overlays for smooth edge fading */}
              <div className="ticker-fadeout-left"></div>
              <div className="ticker-fadeout-right"></div>
            </div>
            
            {/* Mobile & Tablet View - Grid Layout */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewsData.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsTicker;
