import Link from "next/link";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    icon?: string | null;
    _count?: { products: number };
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group card-product flex flex-col items-center p-5 text-center transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#fde8f3] flex items-center justify-center text-3xl mb-3 group-hover:bg-[#e91c78] group-hover:scale-110 transition-all duration-300 shadow-[0_2px_10px_rgba(233,28,120,0.10)]">
        <span className="group-hover:scale-110 transition-transform duration-300">
          {category.icon || "🏷️"}
        </span>
      </div>
      <h3 className="font-bold text-[#12040a] text-xs leading-tight group-hover:text-[#e91c78] transition-colors">
        {category.name}
      </h3>
      {category._count && (
        <span className="text-[10px] text-[#8c5d73] font-medium mt-1">
          {category._count.products} items
        </span>
      )}
    </Link>
  );
}
