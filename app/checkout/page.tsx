"use client";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<"processing" | "done">("processing");

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowModal(true);
    setModalState("processing");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });
      
      const data = await res.json();

      if (data.success) {
        setModalState("done");
        clearCart();
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        alert("Authentication required or error occurred. Please sign in.");
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
    <div className="min-h-screen bg-[#fdf2f7] py-10 px-4 relative">
      {/* PROCESSING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
            {modalState === "processing" ? (
              <>
                <Loader2 className="w-12 h-12 text-[#e91c78] animate-spin mb-4" />
                <h3 className="text-xl font-extrabold text-[#12040a]">Processing Payment...</h3>
                <p className="text-[#8c5d73] text-sm mt-2 font-medium">Please do not close this window (Testing)</p>
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

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold text-[#12040a] tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="bg-white border border-[#f0d9e8] rounded-3xl p-6 md:p-8 space-y-6">
              
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#12040a]">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c5d73] mb-2 block">First Name</label>
                  <input required type="text" className="w-full h-11 px-4 rounded-xl border border-[#f0d9e8] text-sm font-medium focus:border-[#e91c78] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c5d73] mb-2 block">Last Name</label>
                  <input required type="text" className="w-full h-11 px-4 rounded-xl border border-[#f0d9e8] text-sm font-medium focus:border-[#e91c78] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c5d73] mb-2 block">Address</label>
                  <input required type="text" className="w-full h-11 px-4 rounded-xl border border-[#f0d9e8] text-sm font-medium focus:border-[#e91c78] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c5d73] mb-2 block">City</label>
                  <input required type="text" className="w-full h-11 px-4 rounded-xl border border-[#f0d9e8] text-sm font-medium focus:border-[#e91c78] outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#8c5d73] mb-2 block">PIN Code</label>
                  <input required type="text" className="w-full h-11 px-4 rounded-xl border border-[#f0d9e8] text-sm font-medium focus:border-[#e91c78] outline-none" />
                </div>
              </div>

              <div className="pt-6 border-t border-[#f0d9e8]">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#12040a] mb-4">Payment Method (Testing)</h2>
                <div className="flex items-center gap-3 p-4 border border-[#e91c78] rounded-xl bg-[#fdf2f7]">
                  <CreditCard className="text-[#e91c78]" />
                  <span className="font-bold text-[#12040a]">Fake Checkout Terminal</span>
                  <CheckCircle2 className="ml-auto text-[#e91c78]" />
                </div>
              </div>

            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#f0d9e8] rounded-3xl p-6 space-y-6 sticky top-24">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#12040a]">Order Summary</h2>
              
              <div className="space-y-4 max-h-[30vh] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm">
                    <span className="text-[#8c5d73] font-medium flex-1 truncate pr-4">{item.qty}x {item.name}</span>
                    <span className="font-bold text-[#12040a]">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f0d9e8] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8c5d73] font-medium">Subtotal</span>
                  <span className="font-bold text-[#12040a]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c5d73] font-medium">Delivery</span>
                  <span className="font-bold text-[#12040a]">{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0d9e8] flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73]">Total to pay</p>
                </div>
                <p className="text-2xl font-extrabold text-[#e91c78]">₹{total}</p>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#e91c78] text-white font-bold tracking-wide hover:bg-[#c81568] transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8c5d73] font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                SSL Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
