"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import BestSellers from "@/components/BestSellers";
import CakeBuilder from "@/components/CakeBuilder";
import AIDecider from "@/components/AIDecider";
import BakeryTimeline from "@/components/BakeryTimeline";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import AdminPanel from "@/components/AdminPanel";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  // Overlays triggers state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A to open Admin Panel passcode gate
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Smooth scroll handler targeting component IDs
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-apron-cream flex flex-col items-center justify-center relative">
        <div className="w-16 h-16 rounded-full bg-apron-peach border border-white soft-neumorphic flex items-center justify-center animate-pulse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-8 h-8 text-apron-caramel"
          >
            <path d="M6 18V6a4 4 0 0 1 8 0v12" />
            <path d="M18 18V9a4 4 0 0 0-8 0v9" />
            <path d="M3 18h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
            <path d="M12 6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
          </svg>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent relative" suppressHydrationWarning>
      {/* Floating Glass Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Cinematic Hero */}
      <Hero onScrollToSection={handleScrollToSection} />

      {/* Best Sellers Marquee */}
      <BestSellers />

      {/* Category Menu Grid */}
      <MenuSection />

      {/* Custom Cake Builder */}
      <CakeBuilder />

      {/* AI Recommendation Engine */}
      <AIDecider />

      {/* Storytelling About timeline */}
      <BakeryTimeline />

      {/* Connoisseur Testimonials */}
      <Testimonials />

      {/* Luxury Footer */}
      <Footer 
        onScrollToSection={handleScrollToSection} 
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Slide-out Shopping Cart */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      {/* Stepper Checkout counter */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* Strings Admin Command Desk */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomNav
        onOpenCart={() => setCartOpen(true)}
        onScrollToSection={handleScrollToSection}
      />
    </main>
  );
}
