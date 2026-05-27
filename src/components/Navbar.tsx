"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Volume2, VolumeX, Wind, Menu, X, ChefHat, Sparkles, Check, Music, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onScrollToSection: (sectionId: string) => void;
}

const THEMES = [
  { id: "classic", label: "Classic Cream", emoji: "🍦", class: "" },
  { id: "dark", label: "Dark Truffle", emoji: "🍫", class: "theme-dark" },
  { id: "sakura", label: "Sakura Spring", emoji: "🌸", class: "theme-sakura" },
];

export default function Navbar({ onOpenCart, onOpenAdmin, onScrollToSection }: NavbarProps) {
  const { 
    cart, 
    ambientAudio, 
    setAmbientAudio, 
    aromaVisual, 
    setAromaVisual, 
    aromaProfile, 
    setAromaProfile, 
    audioTrack, 
    setAudioTrack 
  } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [aromaMenuOpen, setAromaMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("classic");

  // Cart burst animation
  const [cartBurst, setCartBurst] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const prevTotalRef = useState(totalCartItems);
  useEffect(() => {
    if (totalCartItems > prevTotalRef[0]) {
      setCartBurst(true);
      setTimeout(() => setCartBurst(false), 550);
    }
    prevTotalRef[0] = totalCartItems;
  }, [totalCartItems]);

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement;
    THEMES.forEach(t => { if (t.class) html.classList.remove(t.class); });
    const theme = THEMES.find(t => t.id === activeTheme);
    if (theme?.class) html.classList.add(theme.class);
  }, [activeTheme]);

  // Monitor scroll state for styling changes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Menu", id: "menu" },
    { label: "Best Sellers", id: "best-sellers" },
    { label: "Custom Cakes", id: "cake-builder" },
    { label: "AI Decider", id: "ai-decider" },
    { label: "About", id: "about" },
    { label: "Reviews", id: "testimonials" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          scrolled
            ? "py-3 px-6 md:px-12 bg-apron-cream/70 backdrop-blur-md border-b border-apron-beige/50 shadow-sm"
            : "py-6 px-6 md:px-12 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => onScrollToSection("hero")}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="relative w-10 h-10 rounded-full bg-apron-peach flex items-center justify-center border border-apron-beige soft-neumorphic group-hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-5 h-5 text-apron-caramel" />
              <motion.div 
                className="absolute -top-1 -right-1 text-apron-gold"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            </div>
            <div>
              <span className="block font-serif text-xl md:text-2xl font-bold tracking-wide text-apron-charcoal group-hover:text-apron-caramel transition-colors duration-300">
                Apron Strings
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-apron-caramel/80 font-sans -mt-1 font-medium">
                Artisan Bakery
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onScrollToSection(item.id)}
                className="relative py-2 text-sm font-sans font-medium text-apron-charcoal hover:text-apron-caramel transition-colors duration-300 cursor-pointer group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-apron-caramel transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Control Utility Knobs & Cart */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              title="Admin Panel"
              className="relative p-2 rounded-full border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic hover:text-apron-caramel transition-all duration-300 cursor-pointer text-apron-charcoal flex items-center justify-center hover-magnetic"
            >
              <ChefHat className="w-4 h-4 md:w-5 h-5 text-apron-charcoal hover:text-apron-caramel" />
            </button>


            {/* Aroma Visualizer Scent Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAromaMenuOpen(true)}
              onMouseLeave={() => setAromaMenuOpen(false)}
            >
              <button
                onClick={() => setAromaMenuOpen(!aromaMenuOpen)}
                title="Select Ambient Patisserie Scent"
                className={`relative p-2 rounded-full border transition-all duration-500 cursor-pointer flex items-center justify-center hover-magnetic ${
                  aromaVisual
                    ? "bg-apron-peach/80 border-apron-peach text-apron-caramel shadow-sm"
                    : "bg-white/40 border-white/60 text-apron-charcoal soft-neumorphic"
                }`}
              >
                <Wind className={`w-4 h-4 md:w-5 h-5 ${aromaVisual ? "animate-pulse" : ""}`} />
              </button>

              <AnimatePresence>
                {aromaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl p-3 z-50 text-left text-xs font-sans text-apron-charcoal"
                  >
                    <div className="font-serif font-bold text-sm text-apron-caramel border-b border-apron-peach/30 pb-2 mb-2 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 animate-spin-slow" /> Aroma Mist Profile
                    </div>
                    <div className="flex flex-col gap-1">
                      {[
                        { id: "Vanilla", label: "🍦 Madagascar Vanilla", desc: "Warm vertical soft-cream glow" },
                        { id: "Caramel", label: "🍯 Normandy Caramel", desc: "Gooey caramel-gold slow drift" },
                        { id: "Chocolate", label: "🍫 Belgian Dark Truffle", desc: "Deep cocoa-tinted rising mist" },
                      ].map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => {
                            setAromaProfile(profile.id as any);
                            setAromaVisual(true);
                          }}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                            aromaVisual && aromaProfile === profile.id
                              ? "bg-apron-peach/60 text-apron-caramel font-semibold shadow-sm"
                              : "hover:bg-apron-cream/70 text-apron-charcoal/80 hover:text-apron-charcoal"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-xs">{profile.label}</div>
                            <div className="text-[10px] text-apron-charcoal/50 group-hover:text-apron-charcoal/70 transition-colors">
                              {profile.desc}
                            </div>
                          </div>
                          {aromaVisual && aromaProfile === profile.id && (
                            <Check className="w-3.5 h-3.5 text-apron-caramel animate-bounce" />
                          )}
                        </button>
                      ))}

                      <div className="border-t border-apron-peach/20 my-1 pt-1">
                        <button
                          onClick={() => setAromaVisual(!aromaVisual)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs font-medium cursor-pointer ${
                            !aromaVisual
                              ? "bg-red-50 text-red-600 font-semibold"
                              : "text-apron-charcoal hover:bg-apron-cream/50"
                          }`}
                        >
                          <span>{aromaVisual ? "💨 Disable Aroma Mist" : "✨ Enable Aroma Mist"}</span>
                          {!aromaVisual && <Check className="w-3.5 h-3.5 text-red-600" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Switcher Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setThemeMenuOpen(true)}
              onMouseLeave={() => setThemeMenuOpen(false)}
            >
              <button
                title="Switch Season Theme"
                className="relative p-2 rounded-full border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic hover:text-apron-caramel transition-all duration-300 cursor-pointer text-apron-charcoal flex items-center justify-center hover-magnetic"
              >
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl p-3 z-50 text-left text-xs font-sans text-apron-charcoal"
                  >
                    <div className="font-serif font-bold text-sm text-apron-caramel border-b border-apron-peach/30 pb-2 mb-2 flex items-center gap-1.5">
                      <Palette className="w-4 h-4" /> Seasonal Palette
                    </div>
                    <div className="flex flex-col gap-1">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setActiveTheme(theme.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                            activeTheme === theme.id
                              ? "bg-apron-pink/60 text-apron-caramel font-semibold shadow-sm"
                              : "hover:bg-apron-cream/70 text-apron-charcoal/80"
                          }`}
                        >
                          <span>{theme.emoji} {theme.label}</span>
                          {activeTheme === theme.id && <Check className="w-3.5 h-3.5 text-apron-caramel" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Bag Icon with burst + pulsing badge */}
            <motion.button
              onClick={onOpenCart}
              animate={cartBurst ? { scale: [1, 1.35, 0.9, 1.1, 1], rotate: [0, -12, 10, -5, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="relative p-2 rounded-full border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic text-apron-charcoal hover:text-apron-caramel transition-all duration-300 cursor-pointer flex items-center justify-center hover-magnetic"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <AnimatePresence>
                {totalCartItems > 0 && (
                  <motion.span
                    key={totalCartItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-apron-caramel text-[9px] md:text-[10px] font-bold text-white shadow-sm border border-white"
                  >
                    {totalCartItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-full border border-white/60 bg-white/40 soft-neumorphic text-apron-charcoal cursor-pointer flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 pt-24 pb-8 px-6 bg-white/95 backdrop-blur-xl border-b border-apron-peach/60 z-30 shadow-lg lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onScrollToSection(item.id);
                  }}
                  className="py-3 text-left font-serif text-lg font-semibold text-apron-charcoal hover:text-apron-caramel border-b border-apron-cream transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 mt-2 py-3 px-4 rounded-xl bg-apron-peach/50 border border-white text-apron-caramel font-medium hover:bg-apron-peach transition-all"
              >
                <ChefHat className="w-5 h-5" />
                Go to Admin Dashboard
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
