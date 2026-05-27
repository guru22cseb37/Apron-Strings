"use client";

import { useState, useEffect, useRef } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { Star, Heart, ShoppingCart, Eye, Sparkles, X, Check, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ─── Animated Star Rating ───
function AnimatedStars({ rating, hovered }: { rating: number; hovered: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => {
        const filled = n <= Math.round(rating);
        return (
          <motion.span
            key={n}
            animate={
              hovered && filled
                ? { scale: 1.2, opacity: 1 }
                : { scale: 1, opacity: filled ? 1 : 0.25 }
            }
            transition={{ delay: hovered ? (n - 1) * 0.07 : 0, duration: 0.25, type: "spring", stiffness: 500, damping: 15 }}
          >
            <Star className={`w-3 h-3 transition-colors duration-300 ${
              filled
                ? hovered ? "fill-yellow-400 text-yellow-400" : "fill-apron-gold text-apron-gold"
                : "text-apron-beige"
            }`} />
          </motion.span>
        );
      })}
    </div>
  );
}

// ─── 3D Tilt Card ───
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tfm, setTfm] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  const [shine, setShine] = useState({ x: 50, y: 50, op: 0 });
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -9;
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 9;
    setTfm(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`);
    setShine({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, op: 0.18 });
  };
  const handleLeave = () => {
    setTfm("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setShine(p => ({ ...p, op: 0 }));
  };
  return (
    <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={className} style={{ transform: tfm, transition: "transform 0.18s ease-out" }}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl z-20" style={{
        background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,${shine.op}) 0%, transparent 65%)`,
      }} />
      {children}
    </div>
  );
}

export default function MenuSection() {
  const { menuItems, addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [previewQty, setPreviewQty] = useState(1);
  const [addedAlert, setAddedAlert] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Lock body scroll and stop Lenis smooth scrolling when item quick preview is open
  useEffect(() => {
    if (previewItem) {
      document.body.style.overflow = "hidden";
      // @ts-ignore
      window.lenis?.stop();
    } else {
      document.body.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    };
  }, [previewItem]);

  // Category filter lists
  const categories = ["All", "Cakes", "Pastries", "Cupcakes", "Cookies", "Brownies", "Dessert Boxes"];

  const filteredItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product: MenuItem, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, quantity);
    
    // Trigger pop alert
    setAddedAlert(product.name);
    setTimeout(() => setAddedAlert(null), 2500);

    // Trigger sweet powdered-sugar and pastel sprinkles confetti burst!
    if (e && typeof window !== "undefined") {
      const originX = e.clientX / window.innerWidth;
      const originY = e.clientY / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 55,
        origin: { x: originX, y: originY },
        colors: ["#FCFAF6", "#FFF3EC", "#FFE8ED", "#F6ECE0", "#D6A575"], // Sugar, Peach, Pink, Beige, Caramel
        gravity: 0.5, // Slow, airy drift
        scalar: 0.6,  // Delicate micro grain size
        ticks: 90,    // Soft dissolve
        drift: 0.08,  // Slight sway
      });
    } else if (typeof window !== "undefined") {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.85 },
        colors: ["#FCFAF6", "#FFF3EC", "#FFE8ED", "#F6ECE0", "#D6A575"],
        gravity: 0.5,
        scalar: 0.6,
        ticks: 90,
      });
    }
  };

  return (
    <section id="menu" className="py-24 px-6 md:px-12 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Headers */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 text-apron-caramel text-xs uppercase tracking-[0.25em] font-semibold mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gastronomy Showcase
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-apron-charcoal mb-4"
          >
            Explore Our Sweet Creations
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-apron-charcoal/60 text-sm md:text-base max-w-xl mx-auto font-sans font-light"
          >
            Every pastry is a hand-painted canvas of flavor. Sifted with organic ingredients and baked with obsessive passion.
          </motion.p>
        </div>

        {/* Filter Pills — Ink-Fill Sliding Indicator */}
        <div className="relative flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              ref={(el) => { pillRefs.current[cat] = el; }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setActiveCategory(cat);
                const el = pillRefs.current[cat];
                if (el) { setPillLeft(el.offsetLeft); setPillWidth(el.offsetWidth); }
              }}
              className={`relative px-5 py-2.5 rounded-full text-xs font-sans font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer border z-10 overflow-hidden ${
                activeCategory === cat
                  ? "border-apron-caramel text-white shadow-md shadow-apron-caramel/20"
                  : "bg-white/50 border-white/80 text-apron-charcoal hover:bg-white/80 soft-neumorphic"
              }`}
            >
              {/* Ink fill background */}
              {activeCategory === cat && (
                <motion.span
                  layoutId="pill-ink"
                  className="absolute inset-0 bg-apron-caramel rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                />
              )}
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Dynamic Items Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="group relative cursor-pointer"
                onClick={() => { setPreviewItem(item); setPreviewQty(1); }}
              >
                {/* 3D Tilt Card */}
                <TiltCard className="rounded-3xl border border-white/60 bg-white/40 backdrop-blur-sm p-4 glass-near group-hover:shadow-2xl transition-shadow duration-500 flex flex-col h-full overflow-hidden relative">

                  {/* Steam on hover */}
                  <div className="absolute top-0 inset-x-0 h-24 overflow-hidden pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute left-[30%] top-6 w-1 h-12 bg-white/30 rounded-full blur-[3px] animate-steam" />
                    <div className="absolute left-[50%] top-4 w-1.5 h-16 bg-white/20 rounded-full blur-[4px] animate-steam" style={{ animationDelay: "1s" }} />
                    <div className="absolute left-[70%] top-6 w-1 h-12 bg-white/30 rounded-full blur-[3px] animate-steam" style={{ animationDelay: "0.5s" }} />
                  </div>

                  {/* Image */}
                  <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden bg-apron-cream border border-white soft-neumorphic mb-4"
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-apron-charcoal/10 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center text-apron-caramel shadow-md border border-white transform scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    <button onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/60 bg-white/70 backdrop-blur-md flex items-center justify-center text-apron-charcoal hover:text-red-500 transition-colors shadow-sm z-20 cursor-pointer">
                      <Heart className={`w-4 h-4 transition-transform duration-300 ${favorites[item.id] ? "fill-red-500 text-red-500 scale-110" : ""}`} />
                    </button>
                    {item.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full border border-white bg-apron-pink/80 text-apron-caramel text-[9px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 animate-pulse" /> Featured
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-apron-caramel font-semibold">{item.category}</span>
                        <div className="flex items-center gap-1">
                          <AnimatedStars rating={item.rating} hovered={hoveredCard === item.id} />
                          <span className="font-semibold text-apron-charcoal text-[10px] ml-0.5">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-apron-charcoal mb-1 leading-snug group-hover:text-apron-caramel transition-colors duration-300">{item.name}</h3>
                      <p className="text-[11px] text-apron-charcoal/50 leading-relaxed font-sans line-clamp-2 mb-4 font-light">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-apron-beige/35">
                      <span className="font-serif text-lg font-bold text-apron-charcoal">₹{item.price.toFixed(2)}</span>
                      <button onClick={(e) => handleAddToCart(item, 1, e)}
                        className="w-10 h-10 rounded-full bg-apron-peach/60 border border-white text-apron-caramel hover:bg-apron-caramel hover:text-white hover:border-apron-caramel transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs hover-magnetic">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Item Quick Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="absolute inset-0 bg-apron-charcoal/45 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl bg-apron-cream rounded-3xl overflow-hidden border border-white shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
              data-lenis-prevent
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md text-apron-charcoal hover:text-apron-caramel transition-colors cursor-pointer soft-neumorphic"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left side: Premium Image and tags */}
                <div className="md:col-span-6 relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-apron-peach border-r border-apron-beige/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewItem.image}
                    alt={previewItem.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute bottom-4 left-4 py-2.5 px-4 rounded-xl border border-white bg-white/75 backdrop-blur-md glass-premium">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Chef Recommendation</span>
                    <span className="block text-xs font-semibold text-apron-charcoal">Best served warm at room temp</span>
                  </div>
                </div>

                {/* Right side: Detailed descriptions */}
                <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-apron-caramel mb-2 block">
                      {previewItem.category}
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-apron-charcoal mb-3 leading-snug">
                      {previewItem.name}
                    </h2>
                    
                    {/* Ratings */}
                    <div className="flex items-center gap-1 text-apron-gold mb-4 border-b border-apron-beige/35 pb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(previewItem.rating)
                                ? "fill-apron-gold text-apron-gold"
                                : "text-apron-beige"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-apron-charcoal ml-2">
                        {previewItem.rating} stars (58 Reviews)
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-apron-charcoal/70 mb-6 leading-relaxed font-sans font-light">
                      {previewItem.description}
                    </p>

                    {/* Spotlight Ingredients */}
                    <div className="mb-6">
                      <span className="block text-[10px] uppercase tracking-wider text-apron-caramel font-bold mb-2.5">
                        Highlighted Ingredients
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {previewItem.ingredients.map((ing) => (
                          <span
                            key={ing}
                            className="text-[11px] font-medium text-apron-charcoal/80 py-1.5 px-3 rounded-lg bg-apron-peach/40 border border-white"
                          >
                            ✨ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Allergens warning panel */}
                    <div className="mb-8">
                      <span className="block text-[10px] uppercase tracking-wider text-apron-caramel font-bold mb-2">
                        Allergens Declared
                      </span>
                      <div className="flex gap-2">
                        {previewItem.allergens.map((alg) => (
                          <span
                            key={alg}
                            className="text-[10px] font-bold text-red-700/80 bg-red-50 py-1 px-2.5 rounded-md border border-red-100"
                          >
                            ⚠️ {alg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls and Checkout triggers */}
                  <div>
                    <div className="flex items-center justify-between border-t border-apron-beige/45 pt-6 mb-6">
                      <span className="font-serif text-2xl font-bold text-apron-charcoal">
                        ₹{(previewItem.price * previewQty).toFixed(2)}
                      </span>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1 border border-white/60 bg-white/40 backdrop-blur-md rounded-full p-1 soft-neumorphic shadow-xs">
                        <button
                          onClick={() => setPreviewQty(Math.max(1, previewQty - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-apron-charcoal hover:bg-apron-beige/50 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-apron-charcoal">
                          {previewQty}
                        </span>
                        <button
                          onClick={() => setPreviewQty(previewQty + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-apron-charcoal hover:bg-apron-beige/50 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(previewItem, previewQty);
                        setPreviewItem(null);
                      }}
                      className="w-full btn-liquid py-4 rounded-full bg-apron-caramel text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 hover-magnetic cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart ({(previewItem.price * previewQty).toFixed(2)})
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating alert bar for successful cart addition */}
      <AnimatePresence>
        {addedAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 py-3.5 px-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-3 glass-premium"
          >
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500">
              <Check className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-apron-charcoal">
                Delicious Choice!
              </span>
              <span className="block text-[10px] text-apron-caramel font-medium -mt-0.5">
                Added {addedAlert} to cart.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
