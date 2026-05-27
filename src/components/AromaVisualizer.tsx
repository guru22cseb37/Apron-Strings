"use client";

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";

interface Puff {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function AromaVisualizer() {
  const { aromaVisual, aromaProfile } = useApp();
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background floating clouds effect
  useEffect(() => {
    if (!aromaVisual) {
      setPuffs([]);
      return;
    }

    // Generate initial set of aroma puffs
    const initialPuffs = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: 5 + Math.random() * 90, // percent
      size: aromaProfile === "Chocolate" 
        ? 120 + Math.random() * 150 // Chocolate mist is heavier & larger
        : 60 + Math.random() * 120, // Vanilla and Caramel are lighter
      delay: Math.random() * 4, // s
      duration: aromaProfile === "Caramel"
        ? 10 + Math.random() * 10 // Caramel is slower & gooey
        : 7 + Math.random() * 8, // s
      opacity: aromaProfile === "Vanilla"
        ? 0.15 + Math.random() * 0.2
        : aromaProfile === "Caramel"
        ? 0.12 + Math.random() * 0.15
        : 0.08 + Math.random() * 0.12, // Chocolate is highly subtle
    }));
    setPuffs(initialPuffs);

    // Periodically replace puffs to keep motion alive
    const interval = setInterval(() => {
      setPuffs((prev) =>
        prev.map((p) => {
          if (Math.random() > 0.65) {
            return {
              ...p,
              left: 5 + Math.random() * 90,
              size: aromaProfile === "Chocolate"
                ? 120 + Math.random() * 150
                : 60 + Math.random() * 120,
              duration: aromaProfile === "Caramel"
                ? 10 + Math.random() * 10
                : 7 + Math.random() * 8,
              opacity: aromaProfile === "Vanilla"
                ? 0.15 + Math.random() * 0.2
                : aromaProfile === "Caramel"
                ? 0.12 + Math.random() * 0.15
                : 0.08 + Math.random() * 0.12,
            };
          }
          return p;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [aromaVisual, aromaProfile]);

  // High-pressure perfume scent spray canvas plume on profile change
  useEffect(() => {
    if (!aromaVisual || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Droplet blueprint
    interface Droplet {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      growth: number;
      decay: number;
    }

    const droplets: Droplet[] = [];

    // Trigger a rapid, high-pressure visual mist spray plume directed from the navbar aroma button
    const triggerSpray = () => {
      const startX = width - 120; // Near upper-right navbar scent dropdown
      const startY = 80;
      const count = 85;

      for (let i = 0; i < count; i++) {
        // Spray angle is directed down and leftwards (angle around 150 to 185 degrees)
        const angle = Math.PI * 0.8 + (Math.random() * 0.35 - 0.15);
        const speed = Math.random() * 7 + 4; // High starting velocity

        droplets.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.8, // Subtle gravity drift
          size: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.35 + 0.4,
          growth: Math.random() * 0.15 + 0.1,
          decay: Math.random() * 0.007 + 0.007,
        });
      }
    };

    triggerSpray();

    const getDropletColor = (profile: "Vanilla" | "Caramel" | "Chocolate", alpha: number) => {
      if (profile === "Vanilla") {
        return `rgba(255, 245, 238, ${alpha})`;
      } else if (profile === "Caramel") {
        return `rgba(214, 165, 117, ${alpha})`;
      } else {
        // Chocolate Cocoa
        return `rgba(92, 64, 51, ${alpha})`;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        
        // Air resistance: damp velocity
        d.vx *= 0.94;
        d.vy *= 0.94;

        d.x += d.vx;
        d.y += d.vy;
        d.size += d.growth;
        d.alpha -= d.decay;

        if (d.alpha <= 0) {
          droplets.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
        grad.addColorStop(0, getDropletColor(aromaProfile, d.alpha));
        grad.addColorStop(0.5, getDropletColor(aromaProfile, d.alpha * 0.35));
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [aromaProfile, aromaVisual]);

  if (!aromaVisual) return null;

  // Render distinct colors for each recipe profile
  const getAromaGradient = (profile: "Vanilla" | "Caramel" | "Chocolate") => {
    if (profile === "Vanilla") {
      return "radial-gradient(circle, rgba(255, 243, 236, 0.85) 0%, rgba(255, 255, 255, 0) 70%)";
    } else if (profile === "Caramel") {
      return "radial-gradient(circle, rgba(214, 165, 117, 0.75) 0%, rgba(255, 255, 255, 0) 70%)";
    } else {
      // Chocolate Cocoa mist
      return "radial-gradient(circle, rgba(92, 64, 51, 0.55) 0%, rgba(255, 255, 255, 0) 70%)";
    }
  };

  return (
    <>
      {/* Scent Spray Plume Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
      />

      {/* Floating ambient aroma clouds */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
        {puffs.map((puff) => (
          <div
            key={puff.id}
            className="aroma-particle"
            style={{
              left: `${puff.left}%`,
              width: `${puff.size}px`,
              height: `${puff.size}px`,
              bottom: `-150px`,
              animationDelay: `${puff.delay}s`,
              animationDuration: `${puff.duration}s`,
              opacity: puff.opacity,
              background: getAromaGradient(aromaProfile),
            }}
          />
        ))}
      </div>
    </>
  );
}
