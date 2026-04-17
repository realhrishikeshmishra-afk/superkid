import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { ArrowRight, Zap, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [latestProducts, categories, saleProducts] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { NOT: { salePrice: null } },
      take: 4,
      include: { category: true },
    }),
  ]);

  return (
    <div className="space-y-0">
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-[#f0d9e8]">
          {[
            { icon: Truck,      title: "Free Shipping",   sub: "On orders ₹499+" },
            { icon: Shield,     title: "100% Genuine",    sub: "Verified quality" },
            { icon: Zap,        title: "Fast Dispatch",   sub: "Within 24 hours" },
            { icon: RotateCcw,  title: "Easy Returns",    sub: "7-day hassle free" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 md:justify-center md:px-6">
              <div className="w-10 h-10 rounded-xl bg-[#fde8f3] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#e91c78]" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#12040a]">{title}</p>
                <p className="text-[11px] text-[#8c5d73] font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-[#fdf2f7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
              <p className="section-label">Explore</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link href="/categories" className="text-sm font-bold text-[#e91c78] hover:underline flex items-center gap-1">
              All categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST PRODUCTS ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
              <p className="section-label">Fresh arrivals</p>
              <h2 className="section-title">Latest Products</h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#e91c78] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:mx-0 md:px-0">
            {latestProducts.map((product) => (
              <div key={product.id} className="min-w-[220px] md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH SALE BANNER ── */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-[#fdf2f7]">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Sale banner card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#e91c78] to-[#a0105a] rounded-[24px] px-8 py-10 md:px-14 md:py-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Text */}
              <div className="text-white text-center md:text-left space-y-3 relative z-10">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] bg-white/15 rounded-full px-3 py-1">
                  Limited Time Offer
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-none tracking-tight">
                  Flash Sale<br />
                  <span className="text-[#f9e547]">Up to 50% Off</span>
                </h2>
                <p className="text-white/70 text-sm font-medium">
                  Grab these fan favourites before they're gone!
                </p>
                <Link
                  href="/categories/sale"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-[#e91c78] text-sm font-bold hover:bg-[#fff0f8] transition-all mt-2"
                >
                  Shop the Sale <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Emoji stack */}
              <div className="relative z-10 flex gap-4">
                {["🏍️", "🔥", "⚡"].map((e, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl md:text-5xl"
                    style={{ transform: `rotate(${(i - 1) * 6}deg)` }}
                  >
                    {e}
                  </div>
                ))}
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Sale Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-white border-t border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center space-y-6">
          <span className="section-label">Stay in the loop</span>
          <h2 className="section-title">Join the SuperKid Squad</h2>
          <p className="text-[#8c5d73] text-base font-medium leading-relaxed">
            Subscribe and be the first to know about new sticker drops, exclusive deals, and flash sales.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-xl bg-[#fdf2f7] border border-[#f0d9e8] text-[#12040a] placeholder:text-[#8c5d73] text-sm font-medium outline-none focus:border-[#e91c78] transition-colors"
            />
            <button
              type="submit"
              className="h-12 px-7 rounded-xl bg-[#e91c78] text-white text-sm font-bold hover:bg-[#c81568] transition-all shadow-[0_4px_16px_rgba(233,28,120,0.25)] hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-[#8c5d73]/60 font-medium">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
