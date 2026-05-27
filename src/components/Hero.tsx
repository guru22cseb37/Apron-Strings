"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Play, Pause, Volume2, VolumeX, X, Maximize2, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { ambientAudio, setAmbientAudio } = useApp();

  // Living dashboard direct loop states
  const [activeVideoTrack, setActiveVideoTrack] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const VIDEO_TRACKS = [
    {
      title: "Chapter I: Sifting Happiness",
      description: "Sifting organic heritage flour in slow motion to create the perfect crumb architecture.",
      src: "/hero-loop.mp4",
      image: "/images/hero-cake.png",
    },
    {
      title: "Chapter II: Chocolate Sculpting",
      description: "Our pastry chefs frosting and layering 70% dark Valrhona chocolate blocks.",
      src: "/hero-loop.mp4",
      image: "/images/menu-chocolate-cake.png",
    },
    {
      title: "Chapter III: Strawberry Glacage",
      description: "Glazing fresh organic hand-picked berries on the velvet crème pâtissière.",
      src: "/hero-loop.mp4",
      image: "/images/menu-strawberry-pastry.png",
    }
  ];

  const handleNextTrack = () => {
    setVideoError(false);
    setActiveVideoTrack((prev) => (prev + 1) % VIDEO_TRACKS.length);
  };

  const handleTrackChange = (idx: number) => {
    setVideoError(false);
    setActiveVideoTrack(idx);
  };

  // Live "Next Batch" countdown timer — resets every 3 hours from midnight
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const computeCountdown = () => {
      const now = new Date();
      const secondsInDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const batchInterval = 3 * 3600; // every 3 hours
      const secsUntilNext = batchInterval - (secondsInDay % batchInterval);
      const h = Math.floor(secsUntilNext / 3600);
      const m = Math.floor((secsUntilNext % 3600) / 60);
      const s = secsUntilNext % 60;
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    computeCountdown();
    const id = setInterval(computeCountdown, 1000);
    return () => clearInterval(id);
  }, []);

  // Mouse positions for 3D parallax layers
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transform equations
  const p1X = useTransform(mouseX, [-500, 500], [-35, 35]);
  const p1Y = useTransform(mouseY, [-500, 500], [-35, 35]);
  const p2X = useTransform(mouseX, [-500, 500], [50, -50]);
  const p2Y = useTransform(mouseY, [-500, 500], [50, -50]);
  const p3X = useTransform(mouseX, [-500, 500], [-20, 20]);
  const p3Y = useTransform(mouseY, [-500, 500], [20, -20]);

  // Handle loading progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Wait for transition
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Monitor mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Powered sugar dust particle emitter on canvas
  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle blueprint
    class SugarParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      spin: number;
      spinSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Start above/within
        this.size = Math.random() * 2 + 1; // 1 to 3 px
        this.speedX = Math.random() * 0.4 - 0.2; // drifting drift
        this.speedY = Math.random() * 0.5 + 0.3; // slowly falling
        this.opacity = Math.random() * 0.4 + 0.1;
        this.spin = Math.random() * Math.PI;
        this.spinSpeed = Math.random() * 0.01 - 0.005;
      }

      update() {
        this.x += this.speedX + Math.sin(this.spin) * 0.1; // Gentle sway
        this.y += this.speedY;
        this.spin += this.spinSpeed;

        // Wrap around bottom
        if (this.y > height) {
          this.y = -10;
          this.x = Math.random() * width;
          this.speedY = Math.random() * 0.5 + 0.3;
        }
        // Wrap around sides
        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.translate(this.x, this.y);
        c.rotate(this.spin);
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        
        // Draw little star/fluffy sugar circle
        c.arc(0, 0, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particleCount = 80;
    const sugarDists: SugarParticle[] = Array.from(
      { length: particleCount },
      () => new SugarParticle()
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background ambient gradient overlays
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width
      );
      grad.addColorStop(0, "rgba(255, 243, 236, 0.4)");
      grad.addColorStop(0.5, "rgba(252, 250, 246, 0.3)");
      grad.addColorStop(1, "rgba(246, 236, 224, 0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render sugar dust
      sugarDists.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [loading]);

  // Procedural Rising Steam Particle Emitter on canvas
  useEffect(() => {
    if (loading) return;
    const canvas = steamCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 240);
    let height = (canvas.height = 120);

    class SteamParticle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      alpha: number = 0;
      fadeSpeed: number = 0;
      growthSpeed: number = 0;
      swayOffset: number = 0;
      swaySpeed: number = 0;

      constructor() {
        this.reset();
        // Stagger initial heights to make flow continuous
        this.y = Math.random() * height;
      }

      reset() {
        this.x = width / 2 + (Math.random() * 40 - 20);
        this.y = height + 10;
        this.vx = Math.random() * 0.1 - 0.05;
        this.vy = -(Math.random() * 0.3 + 0.2); // Slowly rising
        this.size = Math.random() * 4 + 5;     // Starts medium
        this.alpha = 0;                        // Starts invisible
        this.fadeSpeed = Math.random() * 0.002 + 0.002;
        this.growthSpeed = Math.random() * 0.04 + 0.06;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.008 + 0.004;
      }

      update() {
        this.x += this.vx + Math.sin(this.swayOffset) * 0.1;
        this.y += this.vy;
        this.swayOffset += this.swaySpeed;
        this.size += this.growthSpeed;

        // Fade in first, then fade out
        if (this.y > height * 0.6) {
          this.alpha = Math.min(this.alpha + 0.015, 0.20); // Cap peak opacity for elegant blend
        } else {
          this.alpha = Math.max(this.alpha - this.fadeSpeed, 0);
        }

        if (this.alpha <= 0 && this.y < height * 0.5) {
          this.reset();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        const grad = c.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, `rgba(255, 253, 250, ${this.alpha})`);
        grad.addColorStop(0.5, `rgba(255, 253, 250, ${this.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 253, 250, 0)`);
        c.fillStyle = grad;
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particleCount = 12;
    const particles = Array.from({ length: particleCount }, () => new SteamParticle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading]);

  return (
    <>
      {/* Luxury Cinematic Entrance Curtain Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#FCFAF6] z-50 flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-apron-peach border border-white soft-neumorphic flex items-center justify-center mb-6">
                <ChefHatIcon className="w-8 h-8 text-apron-caramel animate-bounce" />
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-apron-charcoal mb-2">
                Apron Strings
              </h1>
              <p className="text-xs uppercase tracking-[0.3em] text-apron-caramel font-medium mb-8">
                Sifting happiness...
              </p>
              
              {/* Luxury loading line */}
              <div className="w-48 h-[2px] bg-apron-beige rounded-full overflow-hidden relative border border-white">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-apron-caramel"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] text-apron-caramel/70 font-sans mt-2 font-medium">
                {Math.min(loadingProgress, 100)}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section Container */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Powdered Sugar Canvas particle emitter */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Ambient Blur Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-apron-pink/20 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-apron-peach/30 blur-[130px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left: Headlines & CTA */}
          <div className="lg:col-span-6 flex flex-col text-center lg:text-left items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-apron-caramel/20 bg-apron-peach/60 backdrop-blur-md text-xs font-semibold text-apron-caramel tracking-wide uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Award-Winning Artisan Patisserie
            </motion.div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-apron-charcoal leading-[1.05] mb-6">
              <span className="block overflow-hidden relative">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="block"
                >
                  Freshly Baked
                </motion.span>
              </span>
              <span className="block overflow-hidden relative mt-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="block text-shimmer"
                >
                  Happiness
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-sm md:text-base text-apron-charcoal/70 max-w-lg mb-10 leading-relaxed font-sans font-light"
            >
              Indulge in a culinary symphony. Handcrafted signature tiered cakes, melt-in-the-mouth French pastries, red velvet delicacies, and designer dessert hampers curated for life’s grandest celebrations.
            </motion.p>

            {/* Liquid Glow CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full sm:w-auto"
            >
              <button
                onClick={() => onScrollToSection("menu")}
                className="btn-liquid group px-8 py-4 rounded-full bg-apron-caramel text-white font-medium text-sm tracking-wider uppercase cursor-pointer shadow-md flex items-center gap-2 border border-apron-caramel hover-magnetic"
              >
                Explore Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onScrollToSection("cake-builder")}
                className="px-8 py-4 rounded-full bg-white/40 backdrop-blur-sm border border-white/80 hover:border-apron-caramel/50 text-apron-charcoal font-medium text-sm tracking-wider uppercase cursor-pointer soft-neumorphic hover-magnetic"
              >
                Custom Cake Builder
              </button>
            </motion.div>

            {/* Live Baked Fresh Timer */}
            {countdown && (
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-full border border-apron-caramel/20 bg-apron-peach/50 backdrop-blur-sm text-apron-caramel"
                >
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Next fresh batch in
                  </span>
                  <span className="font-mono text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full border border-white">
                    {countdown}
                  </span>
                </motion.div>

                {/* Secondary Video Controller button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                  onClick={handleNextTrack}
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-full border border-white/80 bg-white/40 hover:bg-white/90 text-apron-caramel hover:text-apron-gold hover:border-apron-caramel/30 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider transition-all shadow-3xs cursor-pointer hover:scale-105 active:scale-95 animate-pulse"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Switch Baking Loop
                </motion.button>
              </div>
            )}
          </div>

          {/* Hero Right: 3D Floating Cake Showcase */}
          <div className="lg:col-span-6 flex justify-center relative min-h-[350px] md:min-h-[500px]">
            {/* Parallax Floating Dessert outline elements */}
            <motion.div
              style={{ x: p1X, y: p1Y }}
              className="absolute top-8 left-12 md:top-12 md:left-20 w-12 h-12 rounded-full bg-apron-pink/80 border border-white flex items-center justify-center soft-neumorphic z-20 pointer-events-none animate-float-slow"
            >
              <Sparkles className="w-5 h-5 text-apron-caramel/60" />
            </motion.div>

            <motion.div
              style={{ x: p2X, y: p2Y }}
              className="absolute bottom-8 right-12 md:bottom-16 md:right-20 w-16 h-16 rounded-full bg-apron-peach border border-white flex items-center justify-center soft-neumorphic z-20 pointer-events-none animate-float"
            >
              <span className="text-2xl">🍓</span>
            </motion.div>

            <motion.div
              style={{ x: p3X, y: p3Y }}
              className="absolute top-2/3 left-4 md:left-8 w-10 h-10 rounded-full bg-white border border-white flex items-center justify-center soft-neumorphic z-20 pointer-events-none animate-float-fast"
            >
              <span className="text-xl">🌸</span>
            </motion.div>

            {/* Central Flagship Cake Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] select-none"
            >
              {/* Cinematic Golden Radial Bloom Spotlight */}
              <div className="absolute inset-[-60px] bg-radial-gradient from-apron-peach via-rgba(255,210,170,0.18) to-transparent blur-[70px] pointer-events-none z-0 scale-110 animate-pulse" />
              
              {/* Rotating golden vector dashed ring */}
              <svg className="absolute inset-[-24px] w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-0 animate-spin-slow opacity-40 text-apron-gold/75" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" fill="none" />
              </svg>
              
              {/* Highlight plate shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-apron-chocolate/10 blur-xl rounded-full z-0" />
              
              {/* Showcase Video container with 3D elevational borders */}
              <div 
                onClick={handleNextTrack}
                className="w-full h-full rounded-full border-[10px] md:border-[16px] border-white/60 bg-white/30 backdrop-blur-sm overflow-hidden soft-neumorphic shadow-lg hover:scale-102 transition-all duration-500 relative z-10 flex items-center justify-center cursor-pointer group/showcase"
              >
                {!videoError ? (
                  <video
                    key={activeVideoTrack}
                    src={VIDEO_TRACKS[activeVideoTrack].src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  />
                ) : (
                  <motion.img
                    key={`fallback-${activeVideoTrack}`}
                    src={VIDEO_TRACKS[activeVideoTrack].image}
                    alt={VIDEO_TRACKS[activeVideoTrack].title}
                    initial={{ scale: 1.02, opacity: 0 }}
                    animate={{ 
                      scale: [1.02, 1.10, 1.02], 
                      opacity: 1 
                    }}
                    transition={{
                      opacity: { duration: 0.6 },
                      scale: {
                        repeat: Infinity,
                        duration: 20,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>

              {/* Floating Strawberry - Mouse Parallax */}
              <motion.div
                style={{
                  x: useTransform(mouseX, [-500, 500], [35, -35]),
                  y: useTransform(mouseY, [-500, 500], [-30, 30])
                }}
                className="absolute top-1/2 -left-12 w-12 h-12 pointer-events-none z-25 select-none text-xl flex items-center justify-center bg-white/50 border border-white/65 backdrop-blur-xs rounded-full soft-neumorphic animate-float"
              >
                🍓
              </motion.div>

              {/* Floating Pink Macaron - Mouse Parallax */}
              <motion.div
                style={{
                  x: useTransform(mouseX, [-500, 500], [-45, 45]),
                  y: useTransform(mouseY, [-500, 500], [-45, 45])
                }}
                className="absolute -top-4 -right-4 w-12 h-12 pointer-events-none z-25 select-none text-xl flex items-center justify-center bg-white/50 border border-white/65 backdrop-blur-xs rounded-full soft-neumorphic animate-float-slow"
              >
                🍬
              </motion.div>

              {/* Floating Golden Flower Blossom - Mouse Parallax */}
              <motion.div
                style={{
                  x: useTransform(mouseX, [-500, 500], [-25, 25]),
                  y: useTransform(mouseY, [-500, 500], [35, -35])
                }}
                className="absolute -bottom-6 left-1/3 w-10 h-10 pointer-events-none z-25 select-none text-base flex items-center justify-center bg-white/50 border border-white/65 backdrop-blur-xs rounded-full soft-neumorphic animate-float-fast"
              >
                🌸
              </motion.div>

              {/* Floating Sparkles - Mouse Parallax */}
              <motion.div
                style={{
                  x: useTransform(mouseX, [-500, 500], [30, -30]),
                  y: useTransform(mouseY, [-500, 500], [40, -40])
                }}
                className="absolute -top-12 left-1/4 w-8 h-8 pointer-events-none z-25 select-none text-sm flex items-center justify-center bg-white/70 border border-white/80 backdrop-blur-xs rounded-full soft-neumorphic animate-pulse"
              >
                ✨
              </motion.div>

              {/* Procedural Canvas Steam Emitter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-60 h-30 pointer-events-none z-25 overflow-hidden opacity-40 blur-xs">
                <canvas ref={steamCanvasRef} className="w-full h-full" />
              </div>

            </motion.div>
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-center select-none pointer-events-none">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-apron-caramel/70">
              Scroll Down
            </span>
            <div className="w-6 h-10 rounded-full border border-apron-caramel/40 flex items-start justify-center p-1 bg-white/20 backdrop-blur-xs shadow-xs">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-apron-caramel"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero section ends here */}
    </>
  );
}

// Chef hat SVG icon for loader
function ChefHatIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 18V6a4 4 0 0 1 8 0v12" />
      <path d="M18 18V9a4 4 0 0 0-8 0v9" />
      <path d="M3 18h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
      <path d="M12 6V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
    </svg>
  );
}
