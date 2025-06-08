import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, 'products', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-12 text-gray-600">Loading...</div>;

  const images = [product.mainImage, ...(product.otherImages || [])].filter(Boolean);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

 const whatsappLink = `https://wa.me/918209987858?text=${encodeURIComponent(
  `👋 Hello Karni Exim Team,

I'm interested in the following product:

🛍️ *Product:* ${product.name}
📂 *Category:* ${product.category}
🔗 *Product Link:* https://karni-exim-new.netlify.app/products/${product.id}

Please provide a quote or more details.

Thanks & Regards,
`
)}`;


  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 mt-4">
        <div className="w-full">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Slider {...settings}>
              {images.map((img, idx) => (
                <div key={idx} className="relative pb-[100%]">
                  <img
                    src={img}
                    alt={`${product.name} - Image ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="flex flex-col space-y-4 px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{product.name}</h1>
          <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>

          {product.badges?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-300 text-xs sm:text-sm text-gray-800 font-medium px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {product.outOfStock && (
            <p className="text-red-600 font-bold text-sm uppercase">Out of Stock</p>
          )}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded shadow transition"
          >
            📩 Get Quote on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
