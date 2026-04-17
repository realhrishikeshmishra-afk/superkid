import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
// Lucide react might not have these specific social icons in this version or they might be named differently.
// Let's use simple SVG icons or omit them if they cause build errors.
// Since we have a build error, I will replace them with inline SVGs for the social icons.

const links = {
  shop: [
    { href: "/categories/fuel-stickers", label: "Fuel Stickers" },
    { href: "/categories/devotional", label: "Devotional" },
    { href: "/categories/office-signs", label: "Office Signs" },
    { href: "/products", label: "All Products" },
    { href: "/categories/sale", label: "Sale 🔥" },
  ],
  policies: [
    { href: "/policies/shipping", label: "Shipping Policy" },
    { href: "/policies/returns", label: "Returns & Refunds" },
    { href: "/policies/privacy", label: "Privacy Policy" },
    { href: "/policies/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#12040a] text-white">
      {/* CTA Strip */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Join the SuperKid Squad</h2>
            <p className="text-[#8c5d73] text-sm mt-1 font-medium">Get exclusive drops, early sales & promo codes in your inbox.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="h-11 flex-1 md:w-64 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm px-4 outline-none focus:border-[#e91c78]/50 transition-colors"
            />
            <button className="h-11 px-6 rounded-xl bg-[#e91c78] text-white text-sm font-bold hover:bg-[#c81568] transition-all shadow-[0_4px_16px_rgba(233,28,120,0.3)] hover:-translate-y-0.5">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <span className="text-2xl font-extrabold text-[#e91c78] italic tracking-tight">Super</span>
            <span className="text-2xl font-extrabold text-white italic tracking-tight">Kid</span>
            <span className="text-xl ml-0.5">⭐</span>
          </Link>
          <p className="text-sm text-[#8c5d73] leading-relaxed font-medium">
            India's favourite store for high-quality stickers, decals &amp; posters. Transform your gear with our unique designs.
          </p>
          <div className="flex gap-3">
            {[
              {
                name: "Instagram",
                href: "#",
                svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              },
              {
                name: "Twitter",
                href: "#",
                svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              },
              {
                name: "Youtube",
                href: "#",
                svg: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2.2 9.5 2.2 12c0 2.5.3 4.9.3 4.9.3 1.6 1.6 2.9 3.2 3.2 2.7.3 10.3.3 10.3.3s7.6 0 10.3-.3c1.6-.3 2.9-1.6 3.2-3.2.3-2.5.3-4.9.3-4.9s0-2.4-.3-4.9c-.3-1.6-1.6-2.9-3.2-3.2-2.7-.3-10.3-.3-10.3-.3s-7.6 0-10.3.3c-1.6.3-2.9 1.6-3.2 3.2z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              },
            ].map(({ name, href, svg }) => (
              <a
                key={name}
                href={href}
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#8c5d73] hover:bg-[#e91c78] hover:text-white transition-all"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e91c78] mb-5">Shop</h3>
          <ul className="space-y-3">
            {links.shop.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#8c5d73] font-medium hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e91c78] mb-5">Policies</h3>
          <ul className="space-y-3">
            {links.policies.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-[#8c5d73] font-medium hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e91c78] mb-5">Contact</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-[#8c5d73] font-medium">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#e91c78]" />
              hello@superkidstore.in
            </li>
            <li className="flex items-start gap-3 text-sm text-[#8c5d73] font-medium">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#e91c78]" />
              +91 98765 43210
            </li>
            <li className="flex items-start gap-3 text-sm text-[#8c5d73] font-medium">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#e91c78]" />
              Ahmedabad, Gujarat, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 font-medium">© 2024 SuperKid Stickers. All rights reserved.</p>
          <div className="flex gap-3">
            {["Visa", "MC", "UPI", "COD"].map((m) => (
              <span key={m} className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-white/8 text-white/40 border border-white/8 tracking-wide">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
