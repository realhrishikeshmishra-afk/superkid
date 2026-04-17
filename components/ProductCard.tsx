import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    emoji?: string | null;
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = Math.round(product.price);
  const salePrice = product.salePrice ? Math.round(product.salePrice) : null;
  const isSale = salePrice && salePrice < price;
  const discount = isSale
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <div className="card-product group flex flex-col">
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden rounded-t-[18px]">
        <div className="w-full aspect-square bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-105 relative overflow-hidden">
          <img 
            src={`https://loremflickr.com/600/600/${encodeURIComponent(product.name.toLowerCase())},sticker,art?random=${product.id || Math.random()}`} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        {isSale && (
          <span className="badge-sale absolute top-3 left-3">
            {discount}% OFF
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-extrabold text-[#e91c78] uppercase tracking-widest">
          {product.category?.name || "Sticker"}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-[#12040a] text-sm leading-snug line-clamp-2 hover:text-[#e91c78] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0d9e8]">
          <div className="flex flex-col">
            {isSale ? (
              <>
                <span className="font-extrabold text-[#e91c78] text-base leading-none">₹{salePrice}</span>
                <span className="text-[11px] text-[#8c5d73] line-through font-medium mt-0.5">₹{price}</span>
              </>
            ) : (
              <span className="font-extrabold text-[#12040a] text-base leading-none">₹{price}</span>
            )}
          </div>

          <button className="w-9 h-9 bg-[#e91c78] text-white rounded-xl flex items-center justify-center hover:bg-[#c81568] transition-all hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(233,28,120,0.3)] hover:shadow-[0_6px_18px_rgba(233,28,120,0.4)]">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
