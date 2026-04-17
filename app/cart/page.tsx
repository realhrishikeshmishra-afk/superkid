"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight,
  Loader2, CheckCircle2, ShieldCheck, Tag, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const DEMO_ITEMS = [
  { id: "1", name: "Classic Chrome Fuel Cap Emblem", price: 99, qty: 2, emoji: "✨", size: "M (4\")" },
  { id: "2", name: "Spirit of Freedom Eagle Decal", price: 59, qty: 1, emoji: "🦅", size: "L (6\")" },
];

export default function CartPage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [items, setItems] = useState(DEMO_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<"processing" | "done">("processing");

  const [step, setStep] = useState<"cart" | "shipping">("cart");
  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = couponApplied ? 20 : 0;
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal - discount + delivery;

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, delta: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!shippingData.name.trim()) errors.name = "Full name is required";
    if (!shippingData.phone.trim() || !/^\d{10}$/.test(shippingData.phone.replace(/\D/g, ""))) {
      errors.phone = "Valid 10-digit phone number is required";
    }
    if (!shippingData.street.trim()) errors.street = "Street address is required";
    if (!shippingData.city.trim()) errors.city = "City is required";
    if (!shippingData.state.trim()) errors.state = "State is required";
    if (!shippingData.zip.trim() || !/^\d{6}$/.test(shippingData.zip)) {
      errors.zip = "Valid 6-digit PIN code is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceed = async () => {
    if (!isLoaded || !userId) {
      alert("Please sign in first to place your order!");
      router.push("/sign-in");
      return;
    }

    if (step === "cart") {
      setStep("shipping");
      window.scrollTo(0, 0);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setShowModal(true);
    setModalState("processing");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, shipping: shippingData }),
      });
      const data = await res.json();

      if (data.success) {
        // Wait 5 seconds as requested by the user
        setTimeout(() => {
          setModalState("done");
          setTimeout(() => {
            setItems([]);
            router.push("/profile");
          }, 1500);
        }, 5000);
      } else {
        alert(data.error || "Authentication required or error occurred.");
        setShowModal(false);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setShowModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf2f7] relative">
      {/* PROCESSING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
            {modalState === "processing" ? (
              <>
                <Loader2 className="w-12 h-12 text-[#e91c78] animate-spin mb-4" />
                <h3 className="text-xl font-extrabold text-[#12040a]">Processing Payment...</h3>
                <p className="text-[#8c5d73] text-sm mt-2 font-medium">Please do not close this window</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-[#12040a]">Order Successful!</h3>
                <p className="text-[#8c5d73] text-sm mt-2 font-medium">Redirecting to your profile...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#f0d9e8]">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fde8f3] rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#e91c78]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#12040a] tracking-tight">
                  {step === "cart" ? "Your Cart" : "Shipping Details"}
                </h1>
                <p className="text-xs text-[#8c5d73] font-medium">
                  {step === "cart" ? `${items.length} item${items.length !== 1 ? "s" : ""}` : "Where should we send your stickers?"}
                </p>
              </div>
            </div>
            {step === "shipping" ? (
              <button 
                onClick={() => setStep("cart")}
                className="text-sm font-bold text-[#8c5d73] hover:text-[#e91c78] flex items-center gap-1"
              >
                ← Back to Cart
              </button>
            ) : (
              <Link href="/products" className="text-sm font-bold text-[#e91c78] hover:underline flex items-center gap-1">
                Continue Shopping <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        {items.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-24 space-y-5">
            <div className="w-24 h-24 bg-[#fde8f3] rounded-3xl flex items-center justify-center text-5xl mx-auto">
              🛒
            </div>
            <h2 className="text-2xl font-extrabold text-[#12040a]">Your cart is empty</h2>
            <p className="text-[#8c5d73] font-medium text-sm">Add some awesome stickers to get started!</p>
            <Link href="/products" className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#e91c78] text-white font-bold text-sm hover:bg-[#c81568] transition-all shadow-[0_4px_16px_rgba(233,28,120,0.25)] hover:-translate-y-0.5">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {step === "cart" ? (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#f0d9e8] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 hover:border-[#e91c78]/30 hover:shadow-[0_4px_20px_rgba(233,28,120,0.08)] transition-all"
                      >
                        {/* Image Thumb */}
                        <div className="w-20 h-20 bg-[#fdf2f7] rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          <img src={`https://loremflickr.com/200/200/${encodeURIComponent(item.name.toLowerCase())},sticker,art?random=${item.id}`} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left min-w-0">
                          <h3 className="font-bold text-[#12040a] text-sm leading-snug line-clamp-2">{item.name}</h3>
                          <p className="text-[11px] text-[#8c5d73] font-semibold mt-1">Size: {item.size}</p>
                          <p className="text-[11px] text-[#8c5d73] font-semibold">High-Quality Vinyl</p>
                        </div>

                        {/* Qty + Price + Remove */}
                        <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
                          <div className="inline-flex items-center bg-[#fdf2f7] border border-[#f0d9e8] rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-[#8c5d73] hover:bg-[#fde8f3] hover:text-[#e91c78] transition-colors">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-extrabold text-[#12040a] text-sm">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center text-[#8c5d73] hover:bg-[#fde8f3] hover:text-[#e91c78] transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[64px]">
                            <span className="font-extrabold text-[#e91c78] text-base block">₹{item.price * item.qty}</span>
                            <span className="text-[11px] text-[#8c5d73] font-medium">₹{item.price} each</span>
                          </div>

                          <button onClick={() => remove(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8c5d73] hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="bg-white border border-[#f0d9e8] rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#12040a] mb-3">
                      <Tag className="w-4 h-4 text-[#e91c78]" /> Apply Coupon
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        className="flex-1 h-10 px-4 rounded-xl border border-[#f0d9e8] text-sm font-semibold text-[#12040a] placeholder:text-[#8c5d73] outline-none focus:border-[#e91c78] bg-[#fdf2f7] transition-colors"
                      />
                      <button
                        onClick={() => coupon === "WELCOME20" && setCouponApplied(true)}
                        className="h-10 px-5 rounded-xl bg-[#12040a] text-white text-sm font-bold hover:bg-[#e91c78] transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-[11px] text-emerald-600 font-bold mt-2">✓ Coupon applied! You save ₹20</p>
                    )}
                    <p className="text-[10px] text-[#8c5d73] mt-2 font-medium">Try: WELCOME20</p>
                  </div>
                </>
              ) : (
                /* Shipping Form */
                <div className="bg-white border border-[#f0d9e8] rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={shippingData.name}
                        onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${formErrors.name ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                      />
                      {formErrors.name && <p className="text-[10px] text-red-500 font-bold">{formErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">Phone Number</label>
                      <input 
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${formErrors.phone ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                      />
                      {formErrors.phone && <p className="text-[10px] text-red-500 font-bold">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">Street Address / Landmark</label>
                    <input 
                      type="text"
                      placeholder="Flat no, Building, Street, Area"
                      value={shippingData.street}
                      onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                      className={`w-full h-12 px-4 rounded-xl border ${formErrors.street ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                    />
                    {formErrors.street && <p className="text-[10px] text-red-500 font-bold">{formErrors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">City</label>
                      <input 
                        type="text"
                        placeholder="City"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${formErrors.city ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                      />
                      {formErrors.city && <p className="text-[10px] text-red-500 font-bold">{formErrors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">State</label>
                      <input 
                        type="text"
                        placeholder="State"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${formErrors.state ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                      />
                      {formErrors.state && <p className="text-[10px] text-red-500 font-bold">{formErrors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#12040a] uppercase tracking-wide">PIN Code</label>
                      <input 
                        type="text"
                        placeholder="6 digits"
                        maxLength={6}
                        value={shippingData.zip}
                        onChange={(e) => setShippingData({...shippingData, zip: e.target.value.replace(/\D/g, "")})}
                        className={`w-full h-12 px-4 rounded-xl border ${formErrors.zip ? "border-red-500 bg-red-50" : "border-[#f0d9e8] bg-[#fdf2f7]"} text-sm font-semibold outline-none focus:border-[#e91c78] transition-all`}
                      />
                      {formErrors.zip && <p className="text-[10px] text-red-500 font-bold">{formErrors.zip}</p>}
                    </div>
                  </div>

                  <div className="bg-[#f0f9ff] border border-sky-100 rounded-2xl p-4 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-sky-900">COD Available</p>
                      <p className="text-[11px] text-sky-700 font-medium">You can choose Cash on Delivery at the next step.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 sticky top-20">
              <div className="bg-white border border-[#f0d9e8] rounded-2xl p-6 space-y-5 shadow-sm">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#12040a]">Order Summary</h2>

                <div className="space-y-3">
                  {[
                    { label: "Subtotal", value: `₹${subtotal}`, muted: false },
                    { label: "Discount", value: couponApplied ? `-₹${discount}` : "–", muted: !couponApplied, green: couponApplied },
                    { label: "Delivery", value: delivery === 0 ? "FREE 🎉" : `₹${delivery}`, muted: false, green: delivery === 0 },
                  ].map(({ label, value, muted, green }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className={`font-medium ${muted ? "text-[#8c5d73]/50" : "text-[#8c5d73]"}`}>{label}</span>
                      <span className={`font-bold ${green ? "text-emerald-600" : "text-[#12040a]"}`}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#f0d9e8] pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73]">Total</p>
                    <p className="text-3xl font-extrabold text-[#e91c78] tracking-tight">₹{total}</p>
                  </div>
                  <p className="text-[10px] text-[#8c5d73] font-medium">Incl. all taxes</p>
                </div>

                <button 
                  onClick={handleProceed}
                  disabled={loading}
                  className="w-full h-14 py-4 rounded-xl bg-[#e91c78] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#c81568] transition-all shadow-[0_4px_16px_rgba(233,28,120,0.25)] hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : step === "cart" ? (
                    <>Proceed to Shipping <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>Confirm & Place Order <CheckCircle2 className="w-4 h-4" /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#8c5d73] font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  100% Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
