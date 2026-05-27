"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  
  // Transform scaleX (0 to 1) to the left offset of the glowing tip (-32px to 100% - 32px)
  const left = useTransform(scaleX, (v) => `calc(${v * 100}% - 32px)`);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          background: "linear-gradient(to right, var(--apron-caramel, #D6A575), var(--apron-gold, #C5A059), var(--apron-pink, #FFE8ED), var(--apron-caramel, #D6A575))",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      {/* Glowing tip */}
      <motion.div
        className="absolute top-0 h-[2px] w-8 blur-sm"
        style={{
          left,
          background: "var(--apron-caramel, rgba(214, 165, 117, 0.9))",
        }}
      />
    </div>
  );
}
