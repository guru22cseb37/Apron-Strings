"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

export default function BackgroundAtmosphere() {
  const [mounted, setMounted] = useState(false);
  const { aromaProfile } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Premium HSL mesh gradient color mappings for Aroma Scent profiles
  const aromaGradients = {
    Vanilla: {
      spot1: "rgba(214, 165, 117, 0.12)", // Caramel tint
      spot2: "rgba(255, 232, 237, 0.25)", // Soft Pink tint
      spot3: "rgba(255, 243, 236, 0.35)", // Warm Peach tint
      spot4: "rgba(197, 160, 89, 0.10)",  // Soft Gold tint
    },
    Caramel: {
      spot1: "rgba(214, 165, 117, 0.28)", // Gooey amber (stronger caramel)
      spot2: "rgba(197, 160, 89, 0.22)",  // Warm honey gold
      spot3: "rgba(255, 243, 236, 0.24)", // Sweet peach
      spot4: "rgba(214, 165, 117, 0.16)", // Caramel gold glow
    },
    Chocolate: {
      spot1: "rgba(92, 64, 51, 0.20)",    // Rich espresso cocoa
      spot2: "rgba(168, 136, 120, 0.16)",  // Velvet milk chocolate
      spot3: "rgba(40, 37, 34, 0.22)",     // Dark cocoa truffle shadow
      spot4: "rgba(243, 208, 130, 0.08)",  // Contrast bronze-gold highlights
    }
  };

  const colors = aromaGradients[aromaProfile] || aromaGradients.Vanilla;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-apron-cream select-none">
      
      {/* Premium Cinematic Soft-Focus Patisserie Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/patisserie-bg.png"
          alt="Premium patisserie atmosphere background"
          className="w-full h-full object-cover opacity-[0.25] filter blur-[2px] scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-apron-cream/40 via-transparent to-apron-cream/40 mix-blend-overlay" />
      </div>

      {/* Dynamic Layered Mesh Gradient Circles */}
      <div className="absolute inset-0 opacity-80 mix-blend-multiply">
        
        {/* Spot 1: Warm Golden Caramel Spotlight - top left drifting */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
            background: `radial-gradient(circle, ${colors.spot1} 0%, rgba(255, 255, 255, 0) 70%)`
          }}
          transition={{
            x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            background: { duration: 1.5, ease: "easeInOut" } // Velvet scent shift transition
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[110px]"
        />

        {/* Spot 2: Frosted Blush Pink - bottom right drifting */}
        <motion.div
          animate={{
            x: [0, -90, 50, 0],
            y: [0, 70, -30, 0],
            scale: [1, 0.9, 1.1, 1],
            background: `radial-gradient(circle, ${colors.spot2} 0%, rgba(255, 255, 255, 0) 70%)`
          }}
          transition={{
            x: { duration: 28, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 28, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 28, repeat: Infinity, ease: "easeInOut" },
            background: { duration: 1.5, ease: "easeInOut" }
          }}
          className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full blur-[125px]"
        />

        {/* Spot 3: Peach Fog - center drifting */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.1, 0.95, 1],
            background: `radial-gradient(circle, ${colors.spot3} 0%, rgba(255, 255, 255, 0) 70%)`
          }}
          transition={{
            x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            background: { duration: 1.5, ease: "easeInOut" }
          }}
          className="absolute top-1/3 left-1/4 w-[550px] h-[550px] rounded-full blur-[105px]"
        />

        {/* Spot 4: Soft Golden Bloom - right top drifting */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 80, -40, 0],
            scale: [1, 1.05, 0.9, 1],
            background: `radial-gradient(circle, ${colors.spot4} 0%, rgba(255, 255, 255, 0) 70%)`
          }}
          transition={{
            x: { duration: 32, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 32, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 32, repeat: Infinity, ease: "easeInOut" },
            background: { duration: 1.5, ease: "easeInOut" }
          }}
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
        />
      </div>

      {/* Atmospheric Transparent Pastry Art Patterns (subconscious branding at 1.5% opacity) */}
      <div className="absolute inset-0 opacity-[0.015] text-apron-chocolate flex flex-col justify-between p-12 md:p-24 pointer-events-none">
        
        {/* Row 1: Croissant and Wheat outlines */}
        <div className="flex justify-between items-start w-full">
          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [12, 17, 12] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 select-none"
          >
            {/* Croissant Vector Lineart */}
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 65C25 55 45 45 65 45C75 45 85 55 85 65C85 75 75 80 65 80C45 80 25 75 15 65Z" />
              <path d="M28 58C35 50 45 46 55 48" />
              <path d="M42 50C48 42 58 40 68 42" />
              <path d="M58 46C62 38 72 38 78 44" />
            </svg>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [-10, -5, -10] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="w-56 h-56 select-none hidden md:block"
          >
            {/* Wheat Stalk Vector Lineart */}
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M50 90V10" />
              <path d="M50 40C40 35 35 25 35 20C45 25 50 35 50 40Z" />
              <path d="M50 40C60 35 65 25 65 20C55 25 50 35 50 40Z" />
              <path d="M50 60C40 55 35 45 35 40C45 45 50 55 50 60Z" />
              <path d="M50 60C60 55 65 45 65 40C55 45 50 55 50 60Z" />
              <path d="M50 80C40 75 35 65 35 60C45 65 50 75 50 80Z" />
              <path d="M50 80C60 75 65 65 65 60C55 65 50 75 50 80Z" />
            </svg>
          </motion.div>
        </div>

        {/* Row 2: Cake and Strawberry stamps */}
        <div className="flex justify-around items-center w-full">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 4, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 select-none opacity-80"
          >
            {/* Elegant Bakery Masterpiece Sketch */}
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="25" y="55" width="50" height="25" rx="4" />
              <rect x="35" y="35" width="30" height="20" rx="3" />
              <circle cx="50" cy="27" r="4" />
              {/* Dripping glazes */}
              <path d="M25 59C28 61 31 59 34 62C37 60 40 59 43 62C46 59 49 61 52 59C55 62 58 60 61 62C64 59 67 61 70 59C73 62 76 60 78 59" />
              <path d="M35 38C38 40 41 38 44 40C47 38 50 40 53 38C56 40 59 38 62 40C65 38 67 40 68 38" />
            </svg>
          </motion.div>
        </div>

        {/* Row 3: Whisk and Bakery Stamp */}
        <div className="flex justify-between items-end w-full">
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [-15, -10, -15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-40 h-40 select-none hidden md:block"
          >
            {/* Whisk Outline */}
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M50 85V50" />
              <rect x="46" y="80" width="8" height="15" rx="2" />
              <path d="M50 50C40 45 35 30 35 20C35 10 65 10 65 20C65 30 60 45 50 50Z" />
              <path d="M50 50C44 42 40 30 40 20C40 10 60 10 60 20C60 30 56 42 50 50Z" />
              <path d="M50 50V15" />
            </svg>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="w-44 h-44 select-none"
          >
            {/* Strawberry Outline */}
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M50 20C68 20 78 35 78 55C78 72 65 85 50 85C35 85 22 72 22 55C22 35 32 20 50 20Z" />
              {/* Crown leaves */}
              <path d="M50 20C52 14 58 10 58 10C54 15 50 20 50 20Z" fill="currentColor" />
              <path d="M50 20C48 14 42 10 42 10C46 15 50 20 50 20Z" fill="currentColor" />
              <path d="M50 20C55 18 64 16 64 16C58 20 50 20 50 20Z" fill="currentColor" />
              <path d="M50 20C45 18 36 16 36 16C42 20 50 20 50 20Z" fill="currentColor" />
              {/* Seeds */}
              <circle cx="38" cy="40" r="1.2" fill="currentColor" />
              <circle cx="62" cy="40" r="1.2" fill="currentColor" />
              <circle cx="50" cy="48" r="1.2" fill="currentColor" />
              <circle cx="34" cy="56" r="1.2" fill="currentColor" />
              <circle cx="66" cy="56" r="1.2" fill="currentColor" />
              <circle cx="50" cy="64" r="1.2" fill="currentColor" />
              <circle cx="40" cy="72" r="1.2" fill="currentColor" />
              <circle cx="60" cy="72" r="1.2" fill="currentColor" />
            </svg>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
