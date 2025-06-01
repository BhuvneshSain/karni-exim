import BestsellerCarousel from '../components/BestsellerCarousel';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (

    <div>

      <section className="text-center py-20 bg-gradient-to-br from-white to-blue-50">
        <h1 className="text-5xl font-extrabold text-blue-900">Karni Exim</h1>
        <p className="mt-4 text-xl italic text-gray-600">
          Delivering Quality Across Borders 🌍
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-md transition"
          >
            🛒 Shop Now
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow-md transition"
          >
            📦 Request a Quote
          </button>
        </div>
      </section>

      <BestsellerCarousel />
    </div>
  );
};

export default Home;
