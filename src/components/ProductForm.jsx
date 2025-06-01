import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    bestseller: false,
    outOfStock: false,
    badges: {
      new: false,
      limitedStock: false,
      ecoFriendly: false
    },
    variants: [{ size: '', color: '', material: '' }]
  });
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const updateForm = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in form.badges) {
      setForm(prev => ({
        ...prev,
        badges: { ...prev.badges, [name]: checked }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const updateVariant = (i, e) => {
    const { name, value } = e.target;
    const updated = [...form.variants];
    updated[i][name] = value;
    setForm(prev => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', material: '' }]
    }));
  };

  const uploadImage = async (file) => {
    const path = `products/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mainImageUrl = mainImage ? await uploadImage(mainImage) : '';
      const additionalUrls = await Promise.all(
        Array.from(additionalImages).map(file => uploadImage(file))
      );

      await addDoc(collection(db, 'products'), {
        ...form,
        mainImage: mainImageUrl,
        additionalImages: additionalUrls,
        createdAt: serverTimestamp()
      });

      alert('Product uploaded!');
      // Reset
      setForm({
        name: '',
        category: '',
        description: '',
        bestseller: false,
        outOfStock: false,
        badges: {
          new: false,
          limitedStock: false,
          ecoFriendly: false
        },
        variants: [{ size: '', color: '', material: '' }]
      });
      setMainImage(null);
      setAdditionalImages([]);
    } catch (err) {
      alert('Error uploading: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Upload New Product</h2>
      <input name="name" value={form.name} onChange={updateForm} placeholder="Product Name" required className="border p-2 w-full" />
      <input name="category" value={form.category} onChange={updateForm} placeholder="Category" required className="border p-2 w-full" />
      <textarea name="description" value={form.description} onChange={updateForm} placeholder="Description" className="border p-2 w-full"></textarea>

      <div className="flex items-center gap-4">
        <label><input type="checkbox" name="bestseller" checked={form.bestseller} onChange={updateForm} /> Bestseller</label>
        <label><input type="checkbox" name="outOfStock" checked={form.outOfStock} onChange={updateForm} /> Out of Stock</label>
      </div>

      <h3 className="font-semibold">Badges</h3>
      <div className="flex gap-4">
        <label><input type="checkbox" name="new" checked={form.badges.new} onChange={updateForm} /> New</label>
        <label><input type="checkbox" name="limitedStock" checked={form.badges.limitedStock} onChange={updateForm} /> Limited Stock</label>
        <label><input type="checkbox" name="ecoFriendly" checked={form.badges.ecoFriendly} onChange={updateForm} /> Eco-Friendly</label>
      </div>

      <h3 className="font-semibold">Variants</h3>
      {form.variants.map((variant, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input name="size" placeholder="Size" value={variant.size} onChange={(e) => updateVariant(i, e)} className="border p-2" />
          <input name="color" placeholder="Color" value={variant.color} onChange={(e) => updateVariant(i, e)} className="border p-2" />
          <input name="material" placeholder="Material" value={variant.material} onChange={(e) => updateVariant(i, e)} className="border p-2" />
        </div>
      ))}
      <button type="button" onClick={addVariant} className="text-sm text-blue-600 underline">+ Add Variant</button>

      <div>
        <label>Main Image</label>
        <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} required />
      </div>
      <div>
        <label>Additional Images</label>
        <input type="file" accept="image/*" multiple onChange={(e) => setAdditionalImages(e.target.files)} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Upload Product</button>
    </form>
  );
};

export default ProductForm;
