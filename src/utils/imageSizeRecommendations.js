/**
 * Image Size Recommendations
 * Provides recommended image sizes for different product image types
 */

export const getImageSizeRecommendation = (type) => {
  const recommendations = {
    main: {
      width: 800,
      height: 800,
      description: 'Recommended: 800x800px square image for main product display'
    },
    hero: {
      width: 1200,
      height: 800,
      description: 'Recommended: 1200x800px for hero/banner display'
    },
    additional: {
      width: 600,
      height: 600,
      description: 'Recommended: 600x600px for additional product images'
    }
  };

  return recommendations[type] || recommendations.main;
};

export const formatImageRecommendation = (type) => {
  const rec = getImageSizeRecommendation(type);
  return `${rec.width}x${rec.height}px`;
};
