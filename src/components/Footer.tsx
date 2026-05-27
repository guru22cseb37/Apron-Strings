"use client";

import { useApp } from "@/context/AppContext";
import { ChefHat, Sparkles, Phone, MapPin, Mail, Send } from "lucide-react";
import { useState } from "react";

// Inline stable custom social SVGs to support all React 19/Next 16 bundler configurations
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ onScrollToSection }: FooterProps) {
  const [emailSub, setEmailSub] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSubSuccess(true);
    setEmailSub("");
    setTimeout(() => setSubSuccess(false), 4000);
  };

  const instagramImages = [
    { src: "/images/hero-cake.png", category: "Cakes" },
    { src: "/images/menu-chocolate-cake.png", category: "Pastries" },
    { src: "/images/menu-strawberry-pastry.png", category: "Pastries" },
    { src: "/images/menu-red-cupcake.png", category: "Cupcakes" },
    { src: "/images/menu-sea-cookie.png", category: "Cookies" },
    { src: "/images/menu-gift-hamper.png", category: "Dessert Boxes" },
  ];

  return (
    <footer className="bg-apron-charcoal text-white/80 py-20 px-6 md:px-12 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Col 1: Brand & Socials */}
        <div className="md:col-span-4 space-y-6 text-left">
          <div className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-apron-peach">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold tracking-wide text-white">
                Apron Strings
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-apron-peach/80 font-sans -mt-1">
                Artisan Patisserie
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-sans font-light">
            Crafting award-winning designer celebration cakes and hand-painted French pastries. We sift joy, sugar, and passion into every delicious crumb.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3.5 pt-2">
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-apron-peach hover:text-apron-charcoal transition-all">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-apron-peach hover:text-apron-charcoal transition-all">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-apron-peach hover:text-apron-charcoal transition-all">
              <span className="font-bold text-xs">P</span> {/* Pinterest */}
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="md:col-span-2 space-y-4 text-left">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Patisserie</h4>
          <ul className="space-y-2 text-xs font-sans font-light text-white/50">
            {["hero", "menu", "best-sellers", "cake-builder"].map((id) => (
              <li key={id}>
                <button
                  onClick={() => onScrollToSection(id)}
                  className="hover:text-apron-peach transition-colors cursor-pointer capitalize"
                >
                  {id.replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact & Hours */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Schedules & Contact</h4>
          <ul className="space-y-3 text-xs font-sans font-light text-white/50">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-apron-peach shrink-0 mt-0.5" />
              <span>123 Chocolate Blvd, Sweet Valley, CA</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-apron-peach shrink-0" />
              <span>+1 (800) 555-CAKE</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-apron-peach shrink-0" />
              <span>hello@apronstrings.com</span>
            </li>
            <li className="pt-2 border-t border-white/5 text-[10px] font-bold text-apron-peach uppercase tracking-wider">
              ⏱️ Open Daily: 8:00 AM – 9:00 PM
            </li>
          </ul>
        </div>

        {/* Col 4: Pinterest-style Instagram Dessert Gallery */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Visual Appetizer</h4>
          
          <div className="grid grid-cols-3 gap-2">
            {instagramImages.map((img, i) => (
              <button
                key={i}
                onClick={() => onScrollToSection("menu")}
                className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5 hover:scale-105 hover:border-apron-peach/40 transition-all cursor-pointer relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={`Instagram post ${i}`}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </button>
            ))}
          </div>

          {/* Newsletter Box */}
          <form onSubmit={handleSubscribe} className="pt-2">
            <div className="relative">
              <input
                type="email"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                placeholder="Subscribe to fresh treats..."
                className="w-full py-2 pl-3 pr-10 rounded-lg border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-apron-peach/40"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-apron-peach hover:text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {subSuccess && (
              <span className="text-[9px] text-apron-peach font-bold block mt-1">
                🎉 Welcome to the inner circle! Watch your inbox.
              </span>
            )}
          </form>
        </div>

      </div>

      {/* Credits */}
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/30 font-sans font-light gap-4">
        <span>© {new Date().getFullYear()} Apron Strings Patisserie Lounge. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-apron-peach">Privacy Policy</a>
          <a href="#" className="hover:text-apron-peach">Terms of Dining</a>
        </div>
      </div>
    </footer>
  );
}
