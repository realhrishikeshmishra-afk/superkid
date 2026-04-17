"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "New Drop — 2024",
    title: "Epic Stickers\nFor Your Ride",
    subtitle: "Custom decals that make your bike or car stand out from the crowd.",
    cta: "Shop Stickers",
    emoji: "🏍️",
    bg: "from-[#fde8f3] to-[#fff5fa]",
    accent: "#e91c78",
  },
  {
    tag: "Devotional Collection",
    title: "Powerful &\nDivine Decals",
    subtitle: "High-quality spiritual decals for your home, vehicle, and sacred spaces.",
    cta: "View Collection",
    emoji: "🛕",
    bg: "from-amber-50 to-[#fff9ed]",
    accent: "#f59e0b",
  },
  {
    tag: "Office & Signage",
    title: "Professional\nOffice Signs",
    subtitle: "Sleek, branded signage that speaks for your workspace before you do.",
    cta: "Explore Signs",
    emoji: "🏢",
    bg: "from-sky-50 to-[#f0f9ff]",
    accent: "#0ea5e9",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];

  return (
    <section className={`relative w-full overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      <div className="container mx-auto px-4 lg:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center min-h-[560px]">

        {/* Text */}
        <div className="space-y-6 max-w-lg fade-up" key={current}>
          <div
            className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
            style={{ background: `${slide.accent}18`, color: slide.accent }}
          >
            {slide.tag}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#12040a] leading-[1.0] tracking-tight whitespace-pre-line">
            {slide.title}
          </h1>

          <p className="text-base md:text-lg text-[#8c5d73] font-medium leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
              style={{ background: slide.accent, boxShadow: `0 4px 20px ${slide.accent}40` }}
            >
              {slide.cta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center h-12 px-7 rounded-xl font-bold text-sm text-[#12040a] bg-white border border-[#f0d9e8] hover:border-[#e91c78] hover:text-[#e91c78] transition-all"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="hidden md:flex justify-center items-center relative">
          <div
            className="w-[380px] h-[380px] rounded-[40px] bg-white shadow-[0_20px_80px_-10px_rgba(0,0,0,0.12)] flex items-center justify-center text-[220px] leading-none relative overflow-hidden fade-up"
            key={`img-${current}`}
          >
            <span className="select-none">{slide.emoji}</span>
            {/* Dot grid decorative bg */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#12040a_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          {/* Floating discount bubble */}
          <div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-xs shadow-xl leading-tight text-center"
            style={{ background: slide.accent }}
          >
            <span className="text-[10px]">UP TO</span>
            <span className="text-xl leading-none">50%</span>
            <span className="text-[9px]">OFF</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={prev} className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white shadow flex items-center justify-center hover:bg-white transition-all">
          <ChevronLeft className="w-4 h-4 text-[#12040a]" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? "w-8 bg-[#e91c78]" : "w-3 bg-[#e91c78]/25"}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm border border-white shadow flex items-center justify-center hover:bg-white transition-all">
          <ChevronRight className="w-4 h-4 text-[#12040a]" />
        </button>
      </div>
    </section>
  );
}
