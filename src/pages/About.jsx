import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-charcoal mb-8"
      >
        About Karni Exim - Agro Commodities Exporter
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-cornsilk rounded-lg shadow-md p-6 md:p-8 border-t-4 border-saffron text-left md:text-center"
      >
        <p className="text-charcoal text-lg leading-relaxed mb-6">
          <strong className="text-saffron">Karni Exim</strong> is a trusted <strong>bulk exporter of Indian agro commodities</strong> based in <strong>Bikaner, Rajasthan</strong>. We specialise in sourcing and supplying <strong>oilseeds, pulses, spices, and other farm-origin products</strong> to discerning buyers across the globe, backed by rigorous quality controls and transparent trade practices.
        </p>

        <p className="text-charcoal text-lg leading-relaxed mb-6">
          Through a <strong>robust farm-to-port supply chain</strong> and dedicated quality teams, we manage <strong>large-volume orders</strong> and custom specifications for international buyers. Each lot is cleaned, graded, and packed to export-grade standards so every shipment preserves natural flavour, aroma, and nutrition.
        </p>

        <p className="text-charcoal text-lg leading-relaxed mb-6">
          Based in Rajasthan's agri-export heartland, <strong>Karni Exim</strong> connects Indian farmers with global buyers through ethical sourcing and dependable logistics. We support clients across continents with <strong>customised B2B export programs</strong>, competitive pricing, and transparent communication.
        </p>

        <div className="bg-white/50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-charcoal mb-4 text-center">Why Choose Karni Exim?</h3>
          <ul className="text-charcoal text-lg space-y-2 list-disc list-inside md:list-outside md:px-12">
            <li><strong>Direct sourcing network</strong> across India's leading agricultural regions</li>
            <li><strong>Bulk export capabilities</strong> for oilseeds, pulses, spices, and grains</li>
            <li><strong>Global compliance</strong> with moisture, purity, and food-safety standards</li>
            <li><strong>Custom packaging</strong> and labelling tailored for destination markets</li>
            <li><strong>B2B support</strong> for wholesalers, processors, and retailers</li>
            <li><strong>Competitive pricing</strong> backed by reliable, on-time shipments</li>
          </ul>
        </div>

        <p className="text-saffron text-xl font-medium italic text-center">
          "From Rajasthan's fields to global shelves — delivering India's finest harvests."
        </p>
      </motion.div>
    </div>
  );
};

export default About;
