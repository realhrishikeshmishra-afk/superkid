import CategoryCard from "@/components/CategoryCard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Categories | SuperKid Stickers",
  description: "Browse all sticker and decal categories at SuperKid Store.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="min-h-screen bg-[#fdf2f7]">
      {/* Header */}
      <div className="bg-white border-b border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <p className="section-label mb-2">Explore</p>
          <h1 className="section-title">All Categories</h1>
          <p className="text-[#8c5d73] text-sm font-medium mt-2 max-w-md">
            Find the perfect stickers for every occasion — from fuel covers to devotional decals.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">📂</span>
            <h2 className="text-2xl font-extrabold text-[#12040a] mt-4">No categories yet</h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
