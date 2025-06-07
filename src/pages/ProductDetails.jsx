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

  const images = [product.mainImage, ...(product.otherImages || [])];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

 const whatsappLink = `https://wa.me/918209987858?text=${encodeURIComponent(
  `👋 Hello Karni Exim Team,

I'm interested in the following product:

🛍️ *Product:* ${product.name}
📂 *Category:* ${product.category}
🔗 *Product Link:* https://karni-exim-new.netlify.app/product/${product.id}

Please provide a quote or more details.

Thanks & Regards,
`
)}`;


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/products" className="text-blue-600 hover:underline">&larr; Back to Products</Link>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <Slider {...settings}>
            {images.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`More ${idx}`}
                  className="w-full object-contain max-h-80 sm:max-h-96 md:max-h-[28rem] rounded shadow"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-900">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="mt-4 text-sm text-gray-500">Category: {product.category}</p>

          {product.badges?.length > 0 && (
            <div className="mt-4 space-x-2">
              {product.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-300 text-sm text-gray-800 font-medium px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {product.outOfStock && (
            <p className="text-red-600 font-bold uppercase mt-4">Out of Stock</p>
          )}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow transition"
          >
            📩 Get Quote on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
