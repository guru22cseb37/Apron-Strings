"use client";

import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Home, UtensilsCrossed, Cake, ShoppingBag, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onScrollToSection: (id: string) => void;
}

export default function MobileBottomNav({ onOpenCart, onScrollToSection }: MobileBottomNavProps) {
  const { cart } = useApp();
  const [active, setActive] = useState("hero");
  const [cartBurst, setCartBurst] = useState(false);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Watch cart changes for burst effect
  const [prevTotal, setPrevTotal] = useState(totalItems);
  useEffect(() => {
    if (totalItems > prevTotal) {
      setCartBurst(true);
      setTimeout(() => setCartBurst(false), 600);
    }
    setPrevTotal(totalItems);
  }, [totalItems, prevTotal]);

  const tabs = [
    { id: "hero", label: "Home", icon: Home },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "cake-builder", label: "Builder", icon: Cake },
    { id: "testimonials", label: "Reviews", icon: Star },
  ];

  const handleTab = (id: string) => {
    setActive(id);
    onScrollToSection(id);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden">
      {/* Frosted glass pill bar */}
      <div className="mx-3 mb-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-apron-charcoal/10 flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 cursor-pointer"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-apron-caramel text-white shadow-md shadow-apron-caramel/25"
                    : "text-apron-charcoal/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {/* Active pip */}
                {isActive && (
                  <motion.div
                    layoutId="tab-active-pip"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-apron-caramel"
                  />
                )}
              </motion.div>
              <span className={`text-[9px] font-semibold uppercase tracking-wide ${isActive ? "text-apron-caramel" : "text-apron-charcoal/40"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Cart tab — special */}
        <button
          onClick={() => {
            setActive("cart");
            onOpenCart();
          }}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 cursor-pointer"
        >
          <motion.div
            animate={cartBurst ? { scale: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              active === "cart"
                ? "bg-apron-caramel text-white shadow-md shadow-apron-caramel/25"
                : "text-apron-charcoal/50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center border border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <span className={`text-[9px] font-semibold uppercase tracking-wide ${active === "cart" ? "text-apron-caramel" : "text-apron-charcoal/40"}`}>
            Cart
          </span>
        </button>
      </div>
    </div>
  );
}
