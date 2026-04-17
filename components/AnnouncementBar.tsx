export default function AnnouncementBar() {
  const items = [
    "🎉 FREE SHIPPING on orders over ₹499",
    "🔥 50% OFF fuel stickers — Code: SPEED50",
    "✨ New arrivals: Devotional Collection is live",
    "📦 Fast 24h dispatch on all orders",
  ];

  return (
    <div className="bg-[#12040a] text-[#f9e547] py-2 overflow-hidden whitespace-nowrap">
      <div className="marquee">
        <div className="marquee-content flex gap-12">
          {items.map((text, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.15em] px-6 flex items-center gap-2">
              {text}
            </span>
          ))}
        </div>
        <div className="marquee-content flex gap-12" aria-hidden="true">
          {items.map((text, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.15em] px-6 flex items-center gap-2">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
