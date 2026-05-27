"use client";

import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Elizabeth Taylor",
      role: "Dessert Connoisseur",
      avatar: "👑",
      rating: 5,
      comment: "The Signature Floral Cake is a visual dream! It felt like slicing into a cloud of pure Madagascar vanilla. Sifting gold onto flowers is absolute genius.",
    },
    {
      name: "Gordon Ramsay",
      role: "Michelin Guide Reviewer",
      avatar: "👨‍🍳",
      rating: 5,
      comment: "Crisp almond sweetcrust shell, silky crème, perfectly glazed strawberries. The French strawberry tart is mathematically flawless. Absolute class.",
    },
    {
      name: "Coco Chanel",
      role: "Luxury Brand Stylist",
      avatar: "👗",
      rating: 5,
      comment: "Elegant shadows, warm peach tones, and the most decadent red velvet cupcake I have ever had. Apron Strings is the Chanel of baking.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden z-10">
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-apron-peach/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-apron-pink/25 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        
        {/* Headers */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 text-apron-caramel text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-apron-caramel animate-pulse" />
            Connoisseur Reviews
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-apron-charcoal mb-4">
            Loved by Dessert Connoisseurs
          </h2>
          <p className="text-apron-charcoal/60 text-sm md:text-base max-w-xl mx-auto font-sans font-light">
            Don't just take our word for it. Here is the feedback from our most elegant epicurean critics.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic flex flex-col justify-between text-left relative group hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-apron-pink/60 absolute top-4 right-4 pointer-events-none" />

              <div>
                {/* Stars */}
                <div className="flex text-apron-gold mb-4 gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-apron-gold text-apron-gold" />
                  ))}
                </div>

                <p className="text-xs md:text-sm text-apron-charcoal/70 leading-relaxed font-sans font-light italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-apron-beige/35">
                <div className="w-10 h-10 rounded-full border border-white bg-apron-peach/60 flex items-center justify-center text-xl shadow-xs">
                  {rev.avatar}
                </div>
                <div>
                  <span className="block font-serif text-sm font-bold text-apron-charcoal">{rev.name}</span>
                  <span className="block text-[9px] uppercase tracking-wider text-apron-caramel font-semibold font-sans">{rev.role}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
