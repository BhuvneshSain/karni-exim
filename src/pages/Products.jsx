import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, loading } = useProducts();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Our Products</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Products;
