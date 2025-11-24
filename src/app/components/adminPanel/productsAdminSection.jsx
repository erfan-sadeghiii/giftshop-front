import { useEffect, useState } from "react";
import ProductCard from "../productCard";
import Link from "next/link";

const ProductsAdminSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products/`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading products...</p>;

  return (
    <main className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">مدیریت محصولات</h1>
        <Link href="/admin/products/create">
          <button className="px-4 py-2 bg-green-500 text-white rounded-xl shadow-sm hover:bg-green-600 transition">
            ایجاد محصول جدید
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">هیچ محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} isAdmin={true} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductsAdminSection;
