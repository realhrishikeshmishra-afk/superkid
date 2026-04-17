import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { SlidersHorizontal } from "lucide-react";

export const metadata = {
  title: "All Products | SuperKid Stickers",
  description: "Browse our complete collection of premium stickers and decals.",
};

export default async function AllProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fdf2f7]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <p className="section-label mb-2">Browse everything</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="section-title">Shop All Products</h1>
            <span className="text-sm font-semibold text-[#8c5d73] bg-[#fde8f3] px-4 py-1.5 rounded-full">
              {products.length} Products
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-8 bg-white border border-[#f0d9e8] rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#8c5d73]">
            <SlidersHorizontal className="w-4 h-4" />
            Sort & Filter
          </div>
          <select className="text-sm font-bold text-[#12040a] bg-transparent border-none outline-none cursor-pointer">
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Best Selling</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">🏷️</span>
            <h2 className="text-2xl font-extrabold text-[#12040a] mt-4">No products yet</h2>
            <p className="text-[#8c5d73] text-sm mt-2 font-medium">Check back soon — new drops are coming!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
