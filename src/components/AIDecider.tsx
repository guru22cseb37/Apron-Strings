"use client";

import { useState } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, ArrowRight, Heart, RefreshCw, ShoppingCart } from "lucide-react";

export default function AIDecider() {
  const { menuItems, addToCart } = useApp();
  const [mood, setMood] = useState("");
  const [flavor, setFlavor] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedItem, setRecommendedItem] = useState<MenuItem | null>(null);
  const [chefNote, setChefNote] = useState("");

  const moods = [
    { name: "Cozy & Warm", emoji: "☕", desc: "Craving warm vanilla comforts, caramels, and comfort baking" },
    { name: "Romantic & Sweet", emoji: "🌹", desc: "Desiring fresh berries, cream swirls, and floral dimensions" },
    { name: "Celebratory & Bold", emoji: "✨", desc: "Ready for rich chocolates, custom tiers, and gold luxury decoration" },
    { name: "Sophisticated & Elegant", emoji: "🥂", desc: "Seeking sea-salt praline accents, pistachio roasts, and subtle sweet bounds" },
  ];

  const flavorNotes = [
    { name: "Intensely Chocolatey", code: "chocolate" },
    { name: "Velvety & Creamy", code: "creamy" },
    { name: "Fresh & Fruity", code: "fruity" },
    { name: "Gooey & Chewy", code: "chewy" },
  ];

  const handleRecommendation = () => {
    setIsAnalyzing(true);
    setRecommendedItem(null);

    // Simulate luxury AI baking chef analysis
    setTimeout(() => {
      let matchedId = "1"; // default signature cake
      let notes = "";

      // Matching algorithm
      if (mood === "Cozy & Warm") {
        if (flavor === "chocolate" || flavor === "chewy") {
          matchedId = "6"; // Caramel fudge brownie
          notes = "Pairs exquisitely with a slow-poured espresso or single-origin French press! The salted caramel swirled into our warm fudge brownie matches the rich earthy notes of fresh coffee.";
        } else {
          matchedId = "5"; // Gooey Sea-Salt Cookie
          notes = "A cozy hug in a cookie! Best enjoyed alongside a mug of steamed cardamom milk. The sea-salt flakes highlight the rich, warm Belgian chocolate chunks.";
        }
      } else if (mood === "Romantic & Sweet") {
        if (flavor === "fruity") {
          matchedId = "3"; // Strawberry glacé tart
          notes = "A poetic match! Indulge alongside a glass of dry rosé. The fresh almond sweetcrust shell and Madagascar vanilla bean crème perfectly highlight the tart organic strawberries.";
        } else {
          matchedId = "4"; // Red velvet cupcake
          notes = "Perfect for romantic shared moments! Accompany with white jasmine tea. The slight cocoa touch in our red velvet sponge beautifully melts into the rich vanilla cream cheese frosting.";
        }
      } else if (mood === "Celebratory & Bold") {
        if (flavor === "chocolate") {
          matchedId = "2"; // Raspberry chocolate truffle
          notes = "A bold celebration of luxury! Excellent with champagne. The Piedmont hazelnut praline crunch underneath Valrhona mousse stands proud, backed by sour raspberries.";
        } else {
          matchedId = "1"; // Signature floral tiered cake
          notes = "The ultimate custom crown for life's grandest milestones. Best shared among family with light Earl Grey tea. The Swiss meringue buttercream acts as a soft vanilla canvas.";
        }
      } else {
        // Sophisticated & Elegant
        if (flavor === "chocolate" || flavor === "chewy") {
          matchedId = "2"; // Chocolate truffle
          notes = "A highly refined dark chocolate masterpiece. Matches beautifully with aged tawny port. The Piedmont hazelnuts bring out the toasted wood notes of the wine.";
        } else {
          matchedId = "7"; // Celebration Hamper
          notes = "An elaborate culinary assortment for true dessert epicures. Outstanding when paired with a chilled dessert cider or floral herbal tea infusions.";
        }
      }

      const match = menuItems.find((item) => item.id === matchedId) || menuItems[0];
      setRecommendedItem(match);
      setChefNote(notes);
      setIsAnalyzing(false);
    }, 2200);
  };

  const handleReset = () => {
    setMood("");
    setFlavor("");
    setRecommendedItem(null);
    setChefNote("");
  };

  return (
    <section id="ai-decider" className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden z-10">
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-apron-pink/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-apron-peach/25 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        
        {/* Headers */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 text-apron-caramel text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            <Brain className="w-4 h-4 text-apron-caramel" />
            AI Taste Engine
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-apron-charcoal mb-4">
            Find Your Dessert Vibe
          </h2>
          <p className="text-apron-charcoal/60 text-sm md:text-base max-w-xl mx-auto font-sans font-light">
            Indecisive? Let our AI Pastry Chef analyze your current mood and flavor preferences to craft the ultimate dessert recommendation and pairing experience.
          </p>
        </div>

        {/* Workspace Block */}
        <div className="rounded-3xl border border-white/60 bg-apron-cream/60 backdrop-blur-md p-6 md:p-10 soft-neumorphic text-left relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!recommendedItem && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Mood Selection */}
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-4">
                    1. Select Your Current Vibe
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moods.map((m) => (
                      <button
                        key={m.name}
                        onClick={() => setMood(m.name)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 hover-magnetic ${
                          mood === m.name
                            ? "bg-apron-caramel border-apron-caramel text-white shadow-md"
                            : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/80"
                        }`}
                      >
                        <span className="text-3xl mt-1 shrink-0">{m.emoji}</span>
                        <div>
                          <span className="block text-sm font-semibold uppercase tracking-wide">
                            {m.name}
                          </span>
                          <span className={`block text-[10px] mt-0.5 leading-relaxed font-light ${mood === m.name ? "text-white/80" : "text-apron-charcoal/50"}`}>
                            {m.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Selection */}
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-4">
                    2. Select Your Flavor Benchmark
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {flavorNotes.map((fn) => (
                      <button
                        key={fn.code}
                        onClick={() => setFlavor(fn.code)}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center h-[90px] hover-magnetic ${
                          flavor === fn.code
                            ? "bg-apron-caramel border-apron-caramel text-white shadow-md"
                            : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/80"
                        }`}
                      >
                        <span className="block text-xs font-bold uppercase tracking-wider">
                          {fn.name.split(" & ")[0]}
                        </span>
                        <span className={`block text-[9px] mt-1 font-light ${flavor === fn.code ? "text-white/85" : "text-apron-charcoal/50"}`}>
                          {fn.name.split(" & ")[1] || "Preference"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-4 text-center">
                  <button
                    disabled={!mood || !flavor}
                    onClick={handleRecommendation}
                    className="w-full sm:w-auto btn-liquid py-4 px-12 rounded-full bg-apron-caramel text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center gap-2 hover-magnetic cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Generate My Dessert Match
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Simulated Mixing Loader */}
            {isAnalyzing && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  {/* Rotating whisk circle */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-dashed border-apron-caramel/60"
                  />
                  {/* Center glowing cake */}
                  <div className="absolute inset-4 rounded-full bg-apron-peach border border-white soft-neumorphic flex items-center justify-center text-apron-caramel">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-apron-charcoal mb-2">
                  Pastry Chef Is Mixing...
                </h3>
                <p className="text-xs text-apron-caramel tracking-wider uppercase font-semibold">
                  Analyzing ingredients, temperature, & flavor notes
                </p>
              </motion.div>
            )}

            {/* Recommendation Result Presentation */}
            {recommendedItem && !isAnalyzing && (
              <motion.div
                key="recommendation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* Result Left: Image card */}
                <div className="md:col-span-5 relative aspect-square rounded-3xl overflow-hidden border border-white soft-neumorphic shadow-md bg-apron-peach">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recommendedItem.image}
                    alt={recommendedItem.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute top-4 left-4 py-1.5 px-3 rounded-full border border-white bg-apron-pink/80 text-apron-caramel text-[9px] uppercase tracking-wider font-bold shadow-xs">
                    Your Perfect Match
                  </div>
                </div>

                {/* Result Right: Recommendation details */}
                <div className="md:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-widest text-apron-caramel font-bold">
                        {recommendedItem.category}
                      </span>
                      <span className="text-xs font-semibold text-apron-charcoal bg-white/80 py-1 px-3 border border-white rounded-full">
                        Match Score: 98%
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-apron-charcoal mb-3">
                      {recommendedItem.name}
                    </h3>
                    <p className="text-xs text-apron-charcoal/50 leading-relaxed font-sans mb-4 font-light">
                      {recommendedItem.description}
                    </p>

                    {/* Chef Pairing Notes box */}
                    <div className="p-4 rounded-2xl border border-white bg-white/70 backdrop-blur-md soft-neumorphic mb-6 text-left">
                      <span className="text-[9px] uppercase tracking-wider text-apron-caramel font-bold flex items-center gap-1.5 mb-1.5">
                        👨‍🍳 Chef’s Pairing & Tasting Note:
                      </span>
                      <p className="text-[11px] font-sans font-light italic leading-relaxed text-apron-charcoal/70">
                        "{chefNote}"
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => addToCart(recommendedItem, 1)}
                      className="w-full sm:w-auto btn-liquid py-3.5 px-8 rounded-full bg-apron-caramel text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center gap-2 hover-magnetic cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add Recommended Combo to Order
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white border border-white/80 text-apron-caramel text-xs uppercase tracking-wider font-semibold shadow-xs flex items-center justify-center gap-1.5 hover-magnetic cursor-pointer soft-neumorphic"
                    >
                      <RefreshCw className="w-4.5 h-4.5" />
                      Start Over
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
