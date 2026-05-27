"use client";

import { useRef, useEffect, useState } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Flame, ArrowRight, ShoppingCart } from "lucide-react";
import confetti from "canvas-confetti";

// ─── Animated Star Rating Component ───
function AnimatedStars({ rating, hovered }: { rating: number; hovered: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(rating);
        return (
          <motion.span
            key={n}
            initial={false}
            animate={
              hovered && filled
                ? { scale: 1.25, opacity: 1 }
                : { scale: 1, opacity: filled ? 1 : 0.25 }
            }
            transition={{ delay: hovered ? (n - 1) * 0.07 : 0, duration: 0.25, type: "spring", stiffness: 500, damping: 14 }}
          >
            <Star
              className={`w-3 h-3 transition-colors duration-300 ${
                filled
                  ? hovered
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-apron-gold text-apron-gold"
                  : "text-apron-beige"
              }`}
            />
          </motion.span>
        );
      })}
    </div>
  );
}

// ─── 3D Tilt Card ───
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) * 10;
    setTransform(`perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`);
    setShine({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setShine(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transform, transition: "transform 0.18s ease-out" }}
    >
      {/* Gloss shine overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl z-20"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,${shine.opacity}) 0%, transparent 65%)`,
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </div>
  );
}

export default function BestSellers() {
  const { menuItems, addToCart } = useApp();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const bestSellers = menuItems.filter((item) => item.isFeatured);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [menuItems]);

  const handleQuickAdd = (product: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);

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
    <section id="best-sellers" className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden z-10">
      {/* Background glowing particles */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-apron-peach/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-apron-pink/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-1 text-apron-caramel text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-apron-caramel animate-pulse" />
            Most Craved Masterpieces
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-apron-charcoal leading-tight">
            Our Elite Best Sellers
          </h2>
        </div>
        <p className="text-apron-charcoal/50 text-xs md:text-sm font-sans font-light max-w-sm">
          A curate-collection of culinary highlights selected by our head chef. Loved globally, baked fresh daily. Drag or swipe below to explore.
        </p>
      </div>

      {/* Swipeable Carousel */}
      <div className="max-w-7xl mx-auto overflow-hidden">
        <motion.div
          ref={carouselRef}
          className="cursor-grab active:cursor-grabbing py-6 select-none"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width - 40 }}
            className="flex gap-8 w-max px-2"
          >
            {bestSellers.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-[280px] sm:w-[320px] md:w-[380px] shrink-0"
              >
                {/* 3D Tilt Card Wrapper */}
                <TiltCard className="relative rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-5 glass-near hover:shadow-2xl transition-shadow duration-500 group overflow-hidden">
                  {/* Glowing halo on hover */}
                  <div className="absolute inset-0 bg-radial-gradient from-apron-pink/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Card Image */}
                  <div
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-apron-cream border border-white soft-neumorphic shadow-xs"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover scale-102 group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                    />

                    {/* Chef tag */}
                    <div className="absolute top-4 left-4 py-1.5 px-3 rounded-full border border-white bg-apron-caramel text-white text-[9px] uppercase tracking-wider font-bold shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-apron-pink animate-spin-slow" />
                      Chef Recommendation
                    </div>

                    {/* Animated star rating badge */}
                    <div className="absolute bottom-4 right-4 py-1.5 px-3 rounded-full border border-white/50 bg-white/80 backdrop-blur-md text-[10px] font-bold text-apron-charcoal shadow-xs flex items-center gap-1.5">
                      <AnimatedStars rating={item.rating} hovered={hoveredId === item.id} />
                      <span className="text-apron-caramel font-bold text-[10px]">{item.rating}</span>
                    </div>
                  </div>

                  {/* Card description */}
                  <div className="text-left relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-apron-caramel font-bold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-apron-charcoal mb-2 leading-tight group-hover:text-apron-caramel transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-xs text-apron-charcoal/50 leading-relaxed font-sans line-clamp-3 mb-6 font-light">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-apron-beige/35">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-apron-caramel font-semibold">Price per serving</span>
                        <span className="font-serif text-xl md:text-2xl font-bold text-apron-charcoal">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(item, e)}
                        className="btn-liquid flex items-center gap-2 py-3 px-5 rounded-full bg-apron-caramel text-white text-xs uppercase tracking-wider font-semibold shadow-md hover-magnetic cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Quick Order
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            {/* CTA Final Card */}
            <div className="w-[280px] sm:w-[320px] shrink-0 self-stretch flex items-stretch">
              <div className="w-full rounded-3xl border border-white/60 bg-apron-peach/30 backdrop-blur-md p-6 glass-near flex flex-col justify-between text-left relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-apron-pink/20 blur-xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-full bg-white border border-white soft-neumorphic flex items-center justify-center mb-6 text-apron-caramel shadow-xs">
                    <Sparkles className="w-5 h-5 animate-bounce" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-apron-charcoal mb-2 leading-tight">
                    Craving <br />
                    Something <br />
                    Unique?
                  </h3>
                  <p className="text-xs text-apron-charcoal/50 leading-relaxed font-sans font-light">
                    Sift through our custom cake planner and let us craft a delicious canvas matching your dream flavor, size, and icing styles.
                  </p>
                </div>

                <a
                  href="#cake-builder"
                  className="mt-6 flex items-center justify-between p-3.5 rounded-2xl bg-white border border-white text-apron-caramel text-xs font-semibold uppercase tracking-wider shadow-xs hover:bg-apron-peach/60 transition-all group-hover:border-apron-caramel/25"
                >
                  Start Designing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
