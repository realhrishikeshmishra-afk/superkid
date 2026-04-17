import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { MapPin, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "../LogoutButton";
import AddressesClient from "./AddressesClient";

export default async function AddressesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      addresses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const addresses = dbUser?.addresses || [];
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Customer";

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
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fde8f3] text-[#8c5d73] font-bold text-sm transition-colors transition-all">
                <Package className="w-4 h-4" /> Order History
              </Link>
              <Link href="/profile/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fdf2f7] text-[#e91c78] font-bold text-sm shadow-sm transition-all">
                <MapPin className="w-4 h-4" /> Saved Addresses
              </Link>
              <div className="mt-4 pt-4 border-t border-[#f0d9e8]">
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Main Content Area (Addresses) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#f0d9e8] rounded-3xl p-6 md:p-8 min-h-[500px] shadow-sm">
              <AddressesClient initialAddresses={addresses} userName={userName} />

              {/* Tips */}
              <div className="mt-12 p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">Why save addresses?</h4>
                <p className="text-sm text-amber-900/70 font-medium leading-relaxed">
                  Saving your home or office address allows you to zip through checkout with a single click. No more typing your details every time you want a new sticker!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
