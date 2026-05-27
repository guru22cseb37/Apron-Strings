"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleIdCounter = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  // Spring physics for smooth ring trail
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 350, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    // Check if device supports fine pointers (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    setVisible(true);

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX);
      cursorY.set(clientY);

      // Trigger sparkle trailing on fast mouse movements
      const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);
      if (dist > 25 && sparkles.length < 8) {
        spawnSparkle(clientX, clientY);
        lastPos.current = { x: clientX, y: clientY };
      }
    };

    const spawnSparkle = (x: number, y: number) => {
      const colors = ["#D6A575", "#FFE8ED", "#C5A059", "#FFF3EC"];
      const newSparkle = {
        id: sparkleIdCounter.current++,
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 20 - 10),
        size: Math.random() * 5 + 3, // 3 to 8px
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setSparkles((prev) => [...prev.slice(-6), newSparkle]); // cap at 6 particles
      
      // Clean up sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 800);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest('[role="button"]') || 
        target.closest(".group") || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea');

      if (isHoverable) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    // Add pointer fine styling to HTML root
    document.documentElement.classList.add("custom-cursor-active");

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, sparkles.length]);

  if (!mounted || !visible) return null;

  return (
    <>
      {/* 1. Core trailing micro dot */}
      <motion.div
        className="fixed w-1.5 h-1.5 bg-apron-caramel rounded-full pointer-events-none z-55 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />

      {/* 2. Elastic Luxury Spring Ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none z-55 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: springX,
          y: springY,
          width: hovered ? 56 : 28,
          height: hovered ? 56 : 28,
          backgroundColor: hovered ? "rgba(255, 243, 236, 0.25)" : "rgba(255, 255, 255, 0)",
          border: hovered 
            ? "1px solid rgba(214, 165, 117, 0.5)" 
            : "1px solid rgba(214, 165, 117, 0.35)",
          backdropFilter: hovered ? "blur(3px)" : "blur(0px)",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 220,
        }}
      />

      {/* 3. Golden Sugar Dust Particles trail */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <AnimatePresence>
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              initial={{ opacity: 0.8, scale: 0 }}
              animate={{ opacity: 0, scale: 1.5, y: sp.y + 15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                left: sp.x,
                top: sp.y,
                width: sp.size,
                height: sp.size,
                backgroundColor: sp.color,
                boxShadow: `0 0 8px ${sp.color}`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
