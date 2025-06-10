import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CounterAnimation = ({ end, duration = 2, suffix = '', formatter = null }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    if (isInView) {
      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const progressRatio = Math.min(progress / (duration * 1000), 1);
        
        // Easing function for smoother animation
        const easedProgress = progressRatio === 1 
          ? 1 
          : 1 - Math.pow(2, -10 * progressRatio);
        
        setCount(Math.floor(easedProgress * end));
        
        if (progressRatio < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView]);

  const displayValue = formatter ? formatter(count) : count;
  return <span ref={ref}>{isInView ? displayValue : 0}{suffix}</span>;
};

const StatsCounter = () => {
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-gray-50 w-full"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-12">
          Why choose Karni Exim?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Product Count */}
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-500 text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={3000} suffix="+" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-gray-800">
              STAINLESS STEEL PRODUCTS
            </div>
          </div>
          
          {/* Years of Expertise */}
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-500 text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={43} suffix="+" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-gray-800">
              YEARS OF EXPERTISE
            </div>
          </div>
          
          {/* Happy Clients */}
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-500 text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation 
                end={600000} 
                suffix="+" 
                duration={2.5}
                formatter={formatNumber} 
              />
            </div>
            <div className="uppercase tracking-wider font-semibold text-gray-800">
              HAPPY CLIENTS
            </div>
          </div>
          
          {/* Satisfaction Rate */}
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-500 text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={100} suffix="%" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-gray-800">
              SATISFACTION RATE
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsCounter;
