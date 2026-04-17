"use client";

import { useState } from "react";
import { Plus, MapPin, Trash2, Home, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressesClientProps {
  initialAddresses: Address[];
  userName: string;
}

export default function AddressesClient({ initialAddresses, userName }: AddressesClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ street: "", city: "", state: "", zipCode: "", phoneNumber: "", isDefault: false });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 border-b border-[#f0d9e8] pb-4">
        <h2 className="text-xl font-extrabold text-[#12040a]">Saved Addresses</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="h-10 px-4 rounded-xl bg-[#e91c78] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#c81568] transition-all"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {initialAddresses.length === 0 ? (
        <div className="text-center py-20 bg-[#fdf2f7]/50 rounded-[2rem] border-2 border-dashed border-[#f0d9e8]">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-300 mx-auto mb-4 shadow-sm">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#12040a]">No addresses saved</h3>
          <p className="text-sm text-[#8c5d73] mt-2 mb-6 font-medium">Add your shipping address for faster checkout.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 px-8 items-center justify-center rounded-xl bg-white border border-[#fde8f3] text-[#e91c78] font-bold text-sm hover:bg-[#fde8f3] transition-all shadow-sm"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialAddresses.map((addr) => (
            <div key={addr.id} className="border border-[#f0d9e8] rounded-2xl p-5 hover:border-[#e91c78]/30 transition-all relative group bg-white">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#fde8f3] rounded-xl flex items-center justify-center text-[#e91c78]">
                  <Home className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-[#12040a] text-sm">Shipping Address</h4>
              </div>
              
              <div className="space-y-1 text-sm text-[#8c5d73] font-medium leading-relaxed">
                <p className="text-[#12040a] font-bold">{userName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                <p className="pt-2 text-[#12040a] font-semibold italic text-xs">📞 {addr.phoneNumber}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#fde8f3] flex items-center gap-4">
                <button className="text-xs font-bold text-[#e91c78] hover:underline">Edit</button>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="text-xs font-bold text-red-400 hover:text-red-500 flex items-center gap-1.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deletingId === addr.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} 
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#12040a]/40 backdrop-blur-sm" onClick={() => !loading && setShowModal(false)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-[#12040a]">Add New Address</h3>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full hover:bg-[#fdf2f7] flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-[#8c5d73]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#8c5d73] uppercase tracking-widest px-1">Street Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="House No, Building, Area"
                    value={formData.street}
                    onChange={e => setFormData({...formData, street: e.target.value})}
                    className="w-full h-12 bg-[#fdf2f7] rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e91c78]/20 transition-all border-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8c5d73] uppercase tracking-widest px-1">City</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full h-12 bg-[#fdf2f7] rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e91c78]/20 transition-all border-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8c5d73] uppercase tracking-widest px-1">PIN Code</label>
                    <input 
                      required
                      type="text" 
                      maxLength={6}
                      placeholder="6 Digits"
                      value={formData.zipCode}
                      onChange={e => setFormData({...formData, zipCode: e.target.value})}
                      className="w-full h-12 bg-[#fdf2f7] rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e91c78]/20 transition-all border-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8c5d73] uppercase tracking-widest px-1">State</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full h-12 bg-[#fdf2f7] rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e91c78]/20 transition-all border-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8c5d73] uppercase tracking-widest px-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      maxLength={10}
                      placeholder="10 Digits"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full h-12 bg-[#fdf2f7] rounded-xl px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#e91c78]/20 transition-all border-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={formData.isDefault}
                      onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-[#fde8f3] rounded-full peer peer-checked:bg-[#e91c78] transition-colors" />
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform" />
                  </div>
                  <span className="text-xs font-bold text-[#8c5d73]">Set as default address</span>
                </label>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full h-14 bg-[#e91c78] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#c81568] transition-all disabled:opacity-50 mt-4 shadow-lg shadow-rose-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Address"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
