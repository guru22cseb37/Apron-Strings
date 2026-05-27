"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Award, ArrowUpRight } from "lucide-react";

export default function BakeryTimeline() {
  const chapters = [
    {
      num: "Chapter I",
      year: "2018",
      title: "The First Flour Sift",
      story: "Our story began in the quiet, cozy sanctuary of a domestic kitchen. Blessed with a generations-old family apron and a sifter, we embarked on a boundary-breaking quest. We became deeply obsessed with perfect crumb density, optimal moisture retention, and delicate natural sugars, building the foundation of our gourmet craft.",
      icon: "🥣",
      flavor: "Earthy flour, organic cane sugars, & family heritage.",
    },
    {
      num: "Chapter II",
      year: "2020",
      title: "Solace Dessert Hampers",
      story: "When the world stood still, we sought to build bridges of warmth. We launched our home-curated Solace Hampers, hand-carrying warm Callebaut fudge brownies, gooey triple cookies, and customized letters of hope straight to neighborhood doorsteps—establishing Apron Strings' legendary cult following.",
      icon: "📦",
      flavor: "Warm melted fudge, hand-wrapped ribbons, & letters of love.",
    },
    {
      num: "Chapter III",
      year: "2023",
      title: "The Grand Luxury Salon",
      story: "We unlocked the doors to our dream flagship designer patisserie lounge. Partnering with local organic micro-creameries for Normand butter and farm cream, we introduced edible gold-flaked tiers. The lounge quickly earned regional culinary honors for its visually unforgettable dessert architecture.",
      icon: "🏛️",
      flavor: "Fresh churned dairy cream, alpine honey, & edible gold leaf.",
    },
    {
      num: "Chapter IV",
      year: "2026",
      title: "The Culinary Art Lounge",
      story: "Today, we stand at the intersection of rigorous classic French pastry fundamentals and modern visual art. We design high-fidelity sensory experiences. Every custom tiered cake and glazed pastry is mathematically refined to trigger childhood happiness and satisfy absolute sweet cravings.",
      icon: "👨‍🍳",
      flavor: "Madagascar vanilla, Valrhona glaze, & avant-garde pastry art.",
    },
  ];

  const apothecaryIngredients = [
    {
      name: "Normandy Cultured Butter",
      desc: "Churned slowly in Normandy from aged grass-fed dairy cream, providing an incredibly high fat count of 84% for an airy, melt-in-the-mouth flaky crumb architecture.",
      icon: "🧈",
      origin: "Normandy, France",
    },
    {
      name: "Madagascar Bourbon Vanilla",
      desc: "Sourced from grower cooperatives in Sambava. Hand-cured orchids yielding intensely rich, floral, wood-toned vanilla black seeds scraped fresh for every batter.",
      icon: "🍦",
      origin: "Sambava, Madagascar",
    },
    {
      name: "Belgian Callebaut Block",
      desc: "Ultra-refined sustainable dark chocolate blocks. Rich in cocoa solids and natural butter, offering an unbelievably rich satin gloss and robust roasted cocoa base.",
      icon: "🍫",
      origin: "Verviers, Belgium",
    },
    {
      name: "Piedmont Hazelnuts",
      desc: "Perfect Piedmont hazelnuts roasted to deep golden shades, releasing sweet essential oils to create a dense, highly addictive custom praline crunch.",
      icon: "🌰",
      origin: "Piedmont, Italy",
    },
  ];

  return (
    <section id="about" className="py-28 px-6 md:px-12 bg-transparent relative z-10 overflow-hidden">
      
      {/* Decorative backdrop gradients */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-apron-peach/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-apron-pink/25 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Cinematic Introductory Splitscreen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-apron-caramel/25 bg-white/40 backdrop-blur-xs text-[10px] font-bold uppercase text-apron-caramel tracking-[0.2em]">
              <Award className="w-3.5 h-3.5" />
              Chapters of Storytelling
            </div>
            
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-apron-charcoal leading-[1.08] tracking-tight">
              Baking is the <br />
              <span className="text-shimmer">Visual Art</span> of Emotion
            </h2>
            
            <p className="text-sm md:text-base text-apron-charcoal/75 leading-relaxed font-sans font-light max-w-xl">
              At Apron Strings, we do not simply bake cookies or layer cream. We curate visual and emotional memories. A single bite of a French strawberry tart is a portal—transporting you back to cozy Sunday kitchen tables, rich vanilla aromas, and pure childhood laughters.
            </p>
            
            <p className="text-xs md:text-sm text-apron-charcoal/60 leading-relaxed font-sans font-light max-w-lg">
              We operate under an absolute, uncompromising commitment to visual culinary architecture. No fillers, no preservatives, and zero artificial dyes. Just pure Normandy cultured butter, Madagascar vanilla caviar, and a relentless devotion to absolute patisserie perfection.
            </p>
          </div>

          {/* Right: Floating Dior-style showcase stack */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Elegant glass back-plate */}
            <div className="absolute inset-[-20px] bg-white/20 border border-white/60 backdrop-blur-sm rounded-[50px] pointer-events-none z-0 soft-neumorphic" />
            
            <div className="relative w-80 h-[420px] rounded-[40px] overflow-hidden border-[12px] border-white bg-white soft-neumorphic shadow-xl z-10 flex flex-col justify-between p-4 group">
              <div className="w-full h-[68%] rounded-[28px] overflow-hidden relative border border-apron-beige/35 bg-apron-cream shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/menu-strawberry-pastry.png"
                  alt="Normandy Strawberry Tart Baking"
                  className="w-full h-full object-cover pointer-events-none group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-apron-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Story annotation tag */}
              <div className="text-left pt-3.5 pb-1">
                <span className="text-[8px] uppercase font-bold text-apron-caramel tracking-[0.25em] block">Fine Craft Declaration</span>
                <p className="font-serif text-base font-bold text-apron-charcoal mt-1 leading-snug group-hover:text-apron-caramel transition-colors">
                  "Pastry is culinary sculpture sweetened with passion."
                </p>
                <span className="block text-[9px] text-apron-charcoal/40 font-sans mt-1">— Audrey, Chef de Patisserie</span>
              </div>
            </div>

          </div>
        </div>

        {/* Storytelling chapters - The Staggered Art Gallery */}
        <div className="mb-32">
          
          <div className="text-center mb-20 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-apron-caramel block">The Chronicle</span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-apron-charcoal">Our Sweet Exhibition</h3>
            <div className="w-12 h-[1px] bg-apron-caramel/45 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {chapters.map((ch, idx) => (
              <motion.div
                key={ch.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-8 md:p-10 rounded-[36px] border border-white/70 bg-white/40 backdrop-blur-md soft-neumorphic flex flex-col justify-between text-left group hover:-translate-y-2.5 transition-all duration-500 overflow-hidden shadow-xs hover:shadow-lg ${
                  idx % 2 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                {/* Large Background Cursive Chapter Number */}
                <span className="absolute -top-6 -right-6 font-serif font-black italic text-8xl md:text-9xl text-apron-peach/60 select-none pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out z-0">
                  {ch.year}
                </span>

                <div className="relative z-10 space-y-4">
                  {/* Chapter Tagline */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-apron-caramel">
                      {ch.num}
                    </span>
                    <span className="text-xl w-10 h-10 rounded-full border border-white/60 bg-white/50 flex items-center justify-center soft-neumorphic shadow-3xs">
                      {ch.icon}
                    </span>
                  </div>

                  {/* Chapter Header */}
                  <div>
                    <h4 className="font-serif text-xl md:text-2xl font-bold text-apron-charcoal leading-tight">
                      {ch.title}
                    </h4>
                    <span className="inline-block px-2.5 py-0.5 mt-1 rounded bg-apron-peach border border-white text-[9px] font-sans font-bold text-apron-caramel">
                      Established {ch.year}
                    </span>
                  </div>

                  {/* Story Description */}
                  <p className="text-xs text-apron-charcoal/70 leading-relaxed font-sans font-light">
                    {ch.story}
                  </p>
                </div>

                {/* Card footer annotation */}
                <div className="relative z-10 pt-6 mt-6 border-t border-apron-beige/35 flex items-center justify-between text-[9px] font-sans font-medium text-apron-charcoal/45 group-hover:text-apron-caramel transition-colors">
                  <span>Note: {ch.flavor}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

              </motion.div>
            ))}
          </div>

        </div>

        {/* Ingredient Apothecary Exhibition */}
        <div className="pt-12 md:pt-24">
          
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-apron-caramel block">Botanical Source</span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-apron-charcoal">The Ingredient Apothecary</h3>
            <p className="text-xs text-apron-charcoal/50 max-w-md mx-auto font-sans font-light">
              We source only raw, pristine elements from historic terroirs. Every seed, splash, and cream block is selected for pure flavor authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apothecaryIngredients.map((ing, idx) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="p-6 rounded-[28px] border border-white/60 bg-white/30 backdrop-blur-md soft-neumorphic text-left flex flex-col justify-between h-[280px] group hover:-translate-y-1.5 transition-all duration-300 shadow-3xs"
              >
                <div>
                  {/* Frosted specimen jar icon */}
                  <div className="w-12 h-12 rounded-full border border-white bg-apron-peach/60 backdrop-blur-xs flex items-center justify-center text-2xl shadow-3xs mb-5 group-hover:scale-105 transition-transform duration-300">
                    {ing.icon}
                  </div>
                  
                  {/* Ingredient name */}
                  <h4 className="font-serif text-base font-bold text-apron-charcoal leading-snug mb-2 group-hover:text-apron-caramel transition-colors">
                    {ing.name}
                  </h4>
                  
                  {/* Botanical spec description */}
                  <p className="text-[10px] text-apron-charcoal/50 leading-relaxed font-sans font-light line-clamp-4">
                    {ing.desc}
                  </p>
                </div>

                {/* Country of Origin stamp */}
                <div className="pt-3 border-t border-apron-beige/25 flex items-center justify-between text-[8px] uppercase tracking-wider text-apron-caramel font-bold">
                  <span>Origin: {ing.origin}</span>
                  <Sparkles className="w-3 h-3 animate-pulse" />
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
