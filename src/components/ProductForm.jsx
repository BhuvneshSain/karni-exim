import { useState } from "react";
import { db, storage } from '../firebase';
import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useProducts from '../hooks/useProducts';

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const { products, loading } = useProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage && !editProductId) return alert("Main image required!");
    setSubmitting(true);

    try {
      let mainImageUrl = '';
      if (mainImage) {
        const mainRef = ref(storage, `products/${Date.now()}_${mainImage.name}`);
        await uploadBytes(mainRef, mainImage);
        mainImageUrl = await getDownloadURL(mainRef);
      }

      const otherImageUrls = [];
      for (let file of otherImages) {
        const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        otherImageUrls.push(url);
      }

      const productData = {
        name,
        category: category === 'custom' ? customCategory : category,
        description,
        isBestSeller,
        badges: [],
        createdAt: Timestamp.now(),
      };

      if (mainImageUrl) productData.mainImage = mainImageUrl;
      if (otherImageUrls.length > 0) productData.otherImages = otherImageUrls;

      if (editProductId) {
        const productRef = doc(db, "products", editProductId);
        await updateDoc(productRef, productData);
        alert("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        alert("Product added successfully!");
      }

      setName(""); setCategory(""); setCustomCategory(""); setDescription("");
      setMainImage(null); setOtherImages([]); setIsBestSeller(false); setEditProductId(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditProductId(product.id);
    setName(product.name);
    setCategory(product.category);
    setCustomCategory("");
    setDescription(product.description);
    setIsBestSeller(product.isBestSeller);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted successfully!");
      window.location.reload(); // Refresh the page
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    }
  }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        {editProductId ? 'Edit Product' : 'Add New Product'}
      </h2>

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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="custom">Other (type below)</option>
          </select>
        </div>

        {category === 'custom' && (
          <input
            type="text"
            placeholder="New Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="border rounded px-4 py-2 w-full"
            required
          />
        )}

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
  className="w-full border border-gray-300 px-3 py-2 rounded"
/>



        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm">Other Images:</label>
         <input
  type="file"
  multiple
  onChange={(e) => setOtherImages([...e.target.files])}
  className="w-full border border-gray-300 px-3 py-2 rounded"
/>


        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
          />
          Bestseller
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
          disabled={submitting}
        >
          {submitting ? (editProductId ? 'Updating...' : 'Adding...') : (editProductId ? 'Update Product' : 'Add Product')}
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
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
