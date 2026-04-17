import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Package, MapPin, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Find user in local DB via Clerk ID, and include orders if available
  // If not in DB yet, pretend 0 orders.
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const orders = dbUser?.orders || [];

  return (
    <div className="min-h-screen bg-[#fdf2f7] py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-[#12040a] tracking-tight mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-[#f0d9e8] rounded-3xl p-6 text-center shadow-sm">
              <div className="w-20 h-20 bg-[#fde8f3] rounded-full mx-auto mb-4 border-4 border-white shadow-sm overflow-hidden">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#e91c78]">
                    {user.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-[#12040a]">{user.firstName} {user.lastName}</h2>
              <p className="text-xs font-semibold text-[#8c5d73] mt-1">{user.emailAddresses[0].emailAddress}</p>
            </div>

            <div className="bg-white border border-[#f0d9e8] rounded-3xl p-4 flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fdf2f7] text-[#e91c78] font-bold text-sm">
                <Package className="w-4 h-4" /> Order History
              </Link>
              <button disabled className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fde8f3] text-[#8c5d73] font-bold text-sm text-left transition-colors opacity-50 cursor-not-allowed">
                <MapPin className="w-4 h-4" /> Addresses (Coming Soon)
              </button>

              <div className="mt-4 pt-4 border-t border-[#f0d9e8]">
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Main Content Area (Orders) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#f0d9e8] rounded-3xl p-6 md:p-8 min-h-[500px]">
              <h2 className="text-xl font-extrabold text-[#12040a] mb-6 border-b border-[#f0d9e8] pb-4">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-[#fde8f3] rounded-2xl flex items-center justify-center text-rose-300 mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#12040a]">No orders found</h3>
                  <p className="text-sm text-[#8c5d73] mt-2 mb-6 font-medium">Looks like you haven't bought any amazing stickers yet.</p>
                  <Link href="/products" className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-[#e91c78] text-white font-bold text-sm hover:bg-[#c81568] transition-all">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-[#f0d9e8] rounded-2xl p-5 block hover:border-[#e91c78]/30 transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73]">Order #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-sm font-semibold text-[#12040a] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5d73]">Total</p>
                          <p className="text-lg font-extrabold text-[#e91c78]">₹{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex-shrink-0 flex items-center gap-3 bg-[#fdf2f7] p-2 pr-4 rounded-xl">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                              {item.product.emoji || "📦"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#12040a] max-w-[120px] truncate">{item.product.name}</p>
                              <p className="text-[10px] font-semibold text-[#8c5d73]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
