import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#fdf2f7]">
      <div className="bg-white p-10 rounded-3xl border border-[#f0d9e8] text-center max-w-sm shadow-[0_8px_40px_rgba(233,28,120,0.08)]">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#12040a] mb-2">Order Confirmed!</h1>
        <p className="text-[#8c5d73] text-sm font-medium mb-8">
          Thank you for shopping with SuperKid. Your fake order has been successfully placed.
        </p>
        <Link 
          href="/products" 
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#e91c78] text-white font-bold hover:bg-[#c81568] transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
