import PropTypes from 'prop-types';

/**
 * Simple Tooltip component
 * Displays text with a tooltip on hover
 */
const Tooltip = ({ text, children }) => {
  return (
    <div className="relative inline-block group">
      {children}
      {text && (
        <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-charcoal-dark rounded shadow-lg whitespace-nowrap z-10 transition-opacity opacity-0 group-hover:opacity-100">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-charcoal-dark"></div>
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
