// Image size recommendations for various image types in the application
export const IMAGE_RECOMMENDATIONS = {
  hero: {
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    description: "Hero images should be high-resolution landscape images (1920x1080 pixels or larger) with a 16:9 aspect ratio for optimal display. These images will be displayed as full-width banners on the homepage and should have clear, eye-catching visuals with minimal text."
  },
  main: {
    width: 800,
    height: 800,
    aspectRatio: "1:1",
    description: "Main product images should be square (1:1 aspect ratio) with dimensions of at least 800x800 pixels. Use a clean, white background for product clarity and consistency. The main image is displayed prominently on product listings and detail pages."
  },
  additional: {
    width: 800,
    height: 800,
    aspectRatio: "flexible",
    description: "Additional product images should be at least 800x800 pixels. While a square format is recommended for consistency, other aspect ratios are acceptable. These images can show different angles, details, or the product in use."
  }
};

// Get specific recommendation based on image type
export const getImageSizeRecommendation = (type) => {
  return IMAGE_RECOMMENDATIONS[type] || IMAGE_RECOMMENDATIONS.main;
};

// Format image size recommendation as a user-friendly string
export const formatImageRecommendation = (type) => {
  const rec = getImageSizeRecommendation(type);
  return `${rec.width}x${rec.height}px (${rec.aspectRatio})`;
};
