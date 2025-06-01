import React from 'react';
import BestsellerCarousel from '../components/BestsellerCarousel';

const Home = () => {
  return (
    <div>
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-bold">Karni Exim</h1>
        <p className="mt-4 text-lg italic text-gray-600">Delivering Quality Across Borders</p>
      </section>
      <BestsellerCarousel />
    </div>
  );
};

export default Home;
