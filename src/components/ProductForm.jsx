import { useState } from "react";
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import useProducts from '../hooks/useProducts';

const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("https://karni-backend.onrender.com/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
};

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [attributes, setAttributes] = useState("");

  const { products, loading } = useProducts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) return alert("Main image required!");

    try {
      const mainImageUrl = await uploadImageToServer(mainImage);
      const otherImageUrls = await Promise.all(
        otherImages.map(file => uploadImageToServer(file))
      );

      const productData = {
        name,
        category,
        description,
        mainImage: mainImageUrl,
        otherImages: otherImageUrls,
        isBestSeller,
        outOfStock,
        badges: [],
        attributes: attributes.split(',').map((a) => a.trim()),
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "products"), productData);

      alert("Product added successfully!");
      setName(""); setCategory(""); setDescription(""); setMainImage(null);
      setOtherImages([]); setIsBestSeller(false); setOutOfStock(false); setAttributes("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-4 py-2 w-full"
          rows="4"
        />

        <div className="space-y-2">
          <label className="block font-medium text-sm">Main Image:</label>
          <input
            type="file"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="block w-full text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm">Other Images:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setOtherImages([...e.target.files])}
            className="block w-full text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
            />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={outOfStock}
              onChange={(e) => setOutOfStock(e.target.checked)}
            />
            Out of Stock
          </label>
        </div>

        <input
          type="text"
          placeholder="Attributes (comma separated)"
          value={attributes}
          onChange={(e) => setAttributes(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
        >
          Add Product
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-blue-700">Uploaded Products</h3>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.id} className="p-4 border rounded shadow-sm flex items-center gap-4">
                <img src={p.mainImage} alt={p.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg">{p.name}</h4>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
