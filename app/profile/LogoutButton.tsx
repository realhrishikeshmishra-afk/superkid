"use client";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button 
      onClick={() => signOut({ redirectUrl: "/" })} 
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-colors border border-transparent hover:border-red-100"
    >
      <LogOut className="w-4 h-4" /> Sign Out
    </button>
  );
}
