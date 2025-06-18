import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore/lite';

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
  const [stats, setStats] = useState({
    products: 3000,
    years: 43,
    clients: 600000,
    satisfaction: 100
  });
  const [loading, setLoading] = useState(true);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsDoc = await getDoc(doc(db, "settings", "stats"));
        if (statsDoc.exists()) {
          setStats(statsDoc.data());
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-beige w-full"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
          Why choose Karni Exim?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Product Count */}
          <div className="p-8 bg-cornsilk rounded-lg shadow-md hover:shadow-lg transition-shadow border border-saffron/20">
            <div className="text-saffron text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={stats.products} suffix="+" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-charcoal">
              STAINLESS STEEL PRODUCTS
            </div>
          </div>
          
          {/* Years of Expertise */}
          <div className="p-8 bg-cornsilk rounded-lg shadow-md hover:shadow-lg transition-shadow border border-saffron/20">
            <div className="text-saffron text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={stats.years} suffix="+" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-charcoal">
              YEARS OF EXPERTISE
            </div>
          </div>
          
          {/* Happy Clients */}
          <div className="p-8 bg-cornsilk rounded-lg shadow-md hover:shadow-lg transition-shadow border border-saffron/20">
            <div className="text-saffron text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation 
                end={stats.clients} 
                suffix="+" 
                duration={2.5}
                formatter={formatNumber} 
              />
            </div>
            <div className="uppercase tracking-wider font-semibold text-charcoal">
              HAPPY CLIENTS
            </div>
          </div>
          
          {/* Satisfaction Rate */}
          <div className="p-8 bg-cornsilk rounded-lg shadow-md hover:shadow-lg transition-shadow border border-saffron/20">
            <div className="text-saffron text-5xl md:text-6xl font-bold mb-4">
              <CounterAnimation end={stats.satisfaction} suffix="%" />
            </div>
            <div className="uppercase tracking-wider font-semibold text-charcoal">
              SATISFACTION RATE
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsCounter;
