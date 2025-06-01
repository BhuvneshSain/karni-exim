import { useState } from "react";
import { db, storage } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [attributes, setAttributes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) return alert("Main image required!");

    try {
      // Upload Main Image
      const mainRef = ref(storage, `products/${Date.now()}_${mainImage.name}`);
      await uploadBytes(mainRef, mainImage);
      const mainImageUrl = await getDownloadURL(mainRef);

      // Upload Other Images
      const otherImageUrls = [];
      for (let file of otherImages) {
        const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        otherImageUrls.push(url);
      }

      // Prepare Data
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

      // Add to Firestore
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
    <div className="max-w-3xl mx-auto px-4 py-12">
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
    </div>
  );
};

export default ProductForm;
