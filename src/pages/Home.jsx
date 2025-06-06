import { useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import BestsellerCarousel from '../components/BestsellerCarousel';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const bestsellers = products.filter(p => p.isBestSeller);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-blue-900">Karni Exim</h1>
          <p className="mt-4 text-xl italic text-gray-600">
            Delivering Quality Across Borders 🌍
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition"
            >
              🛒 Shop Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow transition"
            >
              📦 Request a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">🔥 Bestsellers</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : bestsellers.length === 0 ? (
            <p className="text-center text-gray-500">No bestsellers available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bestsellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
