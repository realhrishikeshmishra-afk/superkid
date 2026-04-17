import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return {
    title: category ? `${category.name} | SuperKid Stickers` : "Category | SuperKid Stickers",
  };
}

export default async function CategoryListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: { include: { category: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!category) notFound();

  const products = category.products;

  return (
    <div className="min-h-screen bg-[#fdf2f7]">
      {/* Breadcrumb + Header */}
      <div className="bg-white border-b border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 pt-5 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8c5d73] mb-5">
            <Link href="/" className="hover:text-[#e91c78] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-[#e91c78] transition-colors">Categories</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#12040a] font-bold">{category.name}</span>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="section-label mb-2">{category.icon || "🏷️"} Collection</p>
              <h1 className="section-title">{category.name}</h1>
            </div>
            <span className="text-sm font-semibold text-[#8c5d73] bg-[#fde8f3] px-4 py-1.5 rounded-full">
              {products.length} Products
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 flex gap-8 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0 space-y-5">
          <div className="bg-white border border-[#f0d9e8] rounded-2xl p-5 space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#12040a]">Filters</h2>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73] block mb-3">Price Range</label>
              <input type="range" min={0} max={500} className="w-full accent-[#e91c78]" />
              <div className="flex justify-between text-[11px] font-bold text-[#8c5d73] mt-1">
                <span>₹0</span><span>₹500</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73] block mb-3">Sort By</label>
              <select className="w-full text-sm font-semibold text-[#12040a] bg-[#fdf2f7] border border-[#f0d9e8] rounded-xl px-3 py-2 outline-none focus:border-[#e91c78] transition-colors">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
              </select>
            </div>

            <button className="w-full h-10 rounded-xl bg-[#e91c78] text-white text-sm font-bold hover:bg-[#c81568] transition-all">
              Apply Filters
            </button>
          </div>

          {/* Promo card */}
          <div className="bg-gradient-to-br from-[#e91c78] to-[#a0105a] rounded-2xl p-5 text-white relative overflow-hidden">
            <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-70 mb-1">First Order</p>
            <h3 className="text-2xl font-extrabold leading-none mb-1">50% OFF</h3>
            <p className="text-xs font-semibold opacity-70 mb-4">Use code WELCOME50</p>
            <button className="h-8 px-4 rounded-xl bg-white text-[#e91c78] text-xs font-extrabold hover:bg-[#fff0f8] transition-all">
              Claim Now
            </button>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile Sort */}
          <div className="flex items-center justify-between mb-6 lg:hidden bg-white border border-[#f0d9e8] rounded-2xl px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#8c5d73]">
              <SlidersHorizontal className="w-4 h-4" /> Sort
            </span>
            <select className="text-sm font-bold text-[#12040a] bg-transparent border-none outline-none">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl">{category.icon || "🏷️"}</span>
              <h2 className="text-xl font-extrabold text-[#12040a] mt-4">No products in this category yet</h2>
              <p className="text-[#8c5d73] text-sm mt-2 font-medium">Check back soon!</p>
              <Link href="/products" className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-xl bg-[#e91c78] text-white text-sm font-bold hover:bg-[#c81568] transition-all">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
