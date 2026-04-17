"use client";
import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  ShoppingCart, Star, Heart, Share2, Plus, Minus,
  Zap, Shield, Truck, ChevronRight, Check
} from "lucide-react";
import { useCart } from "./CartProvider";

interface ProductDetailsProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M (4\")");
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const sizes = ["S (2\")", "M (4\")", "L (6\")", "XL (8\")"];
  const price = Math.round(product.price);
  const salePrice = product.salePrice ? Math.round(product.salePrice) : null;
  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: salePrice || price,
      qty: quantity,
      emoji: product.emoji || "🏷️",
      size: selectedSize,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#fdf2f7]">
      {/* Breadcrumb */}
      <div className="border-b border-[#f0d9e8] bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#8c5d73]">
          <Link href="/" className="hover:text-[#e91c78] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/categories" className="hover:text-[#e91c78] transition-colors">Categories</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/categories/${product.category.slug}`} className="hover:text-[#e91c78] transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#12040a] font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative w-full aspect-square bg-white rounded-[24px] border border-[#f0d9e8] overflow-hidden flex items-center justify-center group shadow-[0_2px_16px_-2px_rgba(18,4,10,0.08)]">
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#e91c78] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                  {discount}% OFF
                </div>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-[#f0d9e8] transition-colors hover:border-[#e91c78]"
              >
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-[#e91c78] text-[#e91c78]" : "text-[#8c5d73]"}`} />
              </button>

            <img 
              src={`https://loremflickr.com/800/800/${encodeURIComponent(product.name.toLowerCase())},sticker,art?random=${product.id || Math.random()}`} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-white rounded-[14px] border-2 border-[#e91c78]/20 hover:border-[#e91c78] flex items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                <img 
                  src={`https://loremflickr.com/200/200/${encodeURIComponent(product.name.toLowerCase())},sticker,art?random=${product.id || i}`} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="lg:pt-2 space-y-7">
            {/* Category + Stars */}
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#fde8f3] text-[#e91c78] text-[10px] font-extrabold rounded-full tracking-widest uppercase">
                {product.category.name}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12040a] leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-[#12040a]">4.0</span>
                </div>
                <span className="text-[#8c5d73] text-xs font-medium">(48 reviews)</span>
                <span className="w-1 h-1 rounded-full bg-[#f0d9e8]" />
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  In Stock
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white border border-[#f0d9e8] rounded-2xl px-6 py-5">
              {product.salePrice ? (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-extrabold text-[#e91c78] tracking-tight">₹{salePrice}</span>
                  <span className="text-lg font-bold text-[#8c5d73] line-through opacity-60">₹{price}</span>
                  <span className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-red-100 text-red-600 rounded-lg">
                    {discount}% OFF
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-extrabold text-[#12040a] tracking-tight mb-4">
                  ₹{price}
                </div>
              )}
              <p className="text-[11px] text-[#8c5d73] mt-1.5 font-medium">Inclusive of all taxes. Free shipping above ₹499.</p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#12040a]">Select Size</span>
                <button className="text-xs font-semibold text-[#e91c78] hover:underline">Size Guide</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-bold text-[#12040a] block mb-3">Quantity</span>
              <div className="inline-flex items-center bg-white border border-[#f0d9e8] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#8c5d73] hover:bg-[#fde8f3] hover:text-[#e91c78] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-extrabold text-[#12040a] text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#8c5d73] hover:bg-[#fde8f3] hover:text-[#e91c78] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-14 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
                  addedToCart
                    ? "bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                    : "bg-[#e91c78] text-white hover:bg-[#c81568] shadow-[0_4px_16px_rgba(233,28,120,0.25)] hover:shadow-[0_6px_24px_rgba(233,28,120,0.35)] hover:-translate-y-0.5"
                }`}
              >
                {addedToCart ? (
                  <><Check className="w-5 h-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </button>
              <button className="flex-1 h-14 rounded-xl font-bold text-sm tracking-wide border-2 border-[#12040a] text-[#12040a] hover:bg-[#12040a] hover:text-white transition-all duration-200 hover:-translate-y-0.5">
                Buy Now
              </button>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-xs text-[#8c5d73] font-semibold hover:text-[#e91c78] transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share this product
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders ₹499+" },
                { icon: Shield, label: "100% Genuine", sub: "Verified quality" },
                { icon: Zap, label: "Fast 24h", sub: "Dispatch" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white border border-[#f0d9e8] rounded-2xl p-4 flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-[#fde8f3] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#e91c78]" />
                  </div>
                  <span className="text-[11px] font-bold text-[#12040a] leading-tight">{label}</span>
                  <span className="text-[10px] text-[#8c5d73] font-medium">{sub}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white border border-[#f0d9e8] rounded-2xl p-6 space-y-3">
              <h2 className="text-sm font-extrabold text-[#12040a] uppercase tracking-wide">Product Details</h2>
              <p className="text-sm text-[#8c5d73] leading-relaxed font-medium">
                {product.description ||
                  "Premium UV-resistant vinyl sticker with strong adhesive backing. Weatherproof and scratch-resistant. Perfect for bikes, cars, laptops, and water bottles. Vivid colors that last for years."}
              </p>
              <ul className="space-y-1.5 pt-1">
                {["High-quality vinyl material", "UV & water resistant", "Easy bubble-free application", "Removable without residue"].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-xs text-[#12040a] font-semibold">
                    <Check className="w-3.5 h-3.5 text-[#e91c78] flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#f0d9e8]">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-1">
                <p className="section-label">You may also like</p>
                <h2 className="section-title">Related Products</h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-[#e91c78] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
