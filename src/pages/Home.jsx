import { useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import BestsellerCarousel from '../components/BestsellerCarousel';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.isBestSeller);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-white to-blue-50 w-full">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900">Karni Exim</h1>
          <p className="mt-4 text-lg md:text-2xl italic text-gray-600">
            Delivering Quality Across Borders 🌍
          </p>

          <div className="mt-8 flex justify-center gap-4 md:gap-6 flex-wrap">            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg transition text-base md:text-lg"
            >
              🛒 Shop Now
            </button>
            <a
              href="https://wa.me/918209987858?text=Hi%20Karni%20Exim!%20I'm%20interested%20in%20your%20products.%20Please%20provide%20a%20quote."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg transition text-base md:text-lg inline-flex items-center"
            >
              📦 Request a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="py-16 md:py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8 md:mb-12">🔥 Bestsellers</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <BestsellerCarousel products={bestsellers} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
