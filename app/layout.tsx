import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "SuperKid | Premium Stickers & Decals",
  description: "India's favourite store for high-quality stickers, decals and posters. Shop unique designs for bikes, cars, laptops and more.",
};

import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/CartProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased" data-theme="light">
        <body className={`${plusJakarta.className} min-h-screen flex flex-col bg-[#fdf2f7] text-[#12040a]`}>
          <CartProvider>
            <Providers>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </Providers>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

