import { useState } from 'react';

const GoogleMapEmbed = ({ 
  address = "Plot No. 5, Suraj Colony, Near Udasar Army Gate, Bikaner-334001, Rajasthan, India",
  coordinates = "28.028338445268272,73.37893326669348",
  zoom = 15,
  className = ""
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  // Extract lat and lng for the embed URL
  const [lat, lng] = coordinates.split(',');

  // More accurate Google Maps embed URL with precise coordinates
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1804.2!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${zoom}.1!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin&q=${lat},${lng}`;
  
  // Google Maps direct link with precise coordinates
  const googleMapsDirectUrl = `https://www.google.com/maps/place/${lat},${lng}/@${coordinates},${zoom}z`;

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-lg shadow-md border-2 border-saffron/20 bg-cornsilk overflow-hidden ${className}`}>      {/* Fallback content - shown until map loads or if map fails */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-cornsilk transition-opacity duration-300 ${mapLoaded && !mapError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-charcoal mb-4">
          <h3 className="font-bold text-lg mb-2">📍 Karni Exim</h3>
          <p className="text-sm leading-relaxed">
            Plot No. 5, Suraj Colony<br />
            Near Udasar Army Gate<br />
            Bikaner-334001, Rajasthan, India
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Coordinates: {lat}°N, {lng}°E
          </p>
        </div>
        
        {mapError && (
          <p className="text-red-600 text-xs mb-3">
            Map couldn't load. Click below to view location.
          </p>
        )}
        
        <div className="flex gap-2 flex-wrap justify-center">
          <a
            href={googleMapsDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-saffron hover:bg-saffron/80 text-charcoal px-3 py-2 rounded shadow-sm text-xs font-medium transition-colors"
          >
            📍 Open in Google Maps
          </a>
          <a
            href={`https://www.google.com/maps/dir//${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-charcoal hover:bg-charcoal-dark text-white px-3 py-2 rounded shadow-sm text-xs font-medium transition-colors"
          >
            🧭 Get Directions
          </a>
        </div>
      </div>

      {/* Google Maps iframe */}
      <iframe
        title="Karni Exim Location - Google Maps"
        className="w-full h-full min-h-[300px] absolute inset-0 z-10"
        src={googleMapsEmbedUrl}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleMapLoad}
        onError={handleMapError}
      />
    </div>
  );
};

export default GoogleMapEmbed;
