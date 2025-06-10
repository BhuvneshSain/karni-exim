import { useState } from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Position styling
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  // Arrow position styling
  const arrowStyles = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
  };

  return (
    <div 
      className="relative flex items-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 w-64 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-sm ${positionStyles[position]}`}>
          {text}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowStyles[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
