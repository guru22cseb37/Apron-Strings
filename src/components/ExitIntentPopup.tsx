"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, Gift, ArrowRight } from "lucide-react";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Don't show if already seen this session
    if (sessionStorage.getItem("exit-popup-seen")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger only when cursor moves to very top of window (exit intent)
      if (e.clientY <= 10 && !triggered.current && !dismissed) {
        triggered.current = true;
        // Delay slightly for feel
        setTimeout(() => setVisible(true), 400);
        sessionStorage.setItem("exit-popup-seen", "1");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2500);
  };

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-apron-charcoal/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup Card */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9991] w-full max-w-sm mx-4"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/70 shadow-2xl bg-white/85 backdrop-blur-2xl">
              {/* Decorative gradient top stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-apron-pink via-apron-caramel to-apron-gold" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full border border-white/60 bg-white/40 text-apron-charcoal/50 hover:text-apron-charcoal transition-colors cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="p-7">
                {!submitted ? (
                  <>
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-14 h-14 rounded-full bg-apron-peach border border-white soft-neumorphic flex items-center justify-center"
                      >
                        <Gift className="w-6 h-6 text-apron-caramel" />
                      </motion.div>
                    </div>

                    <div className="text-center mb-5">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-apron-caramel block mb-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Before you leave
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-apron-charcoal leading-tight mb-2">
                        Take a Secret Recipe<br />With You 🎂
                      </h3>
                      <p className="text-xs text-apron-charcoal/55 font-sans font-light leading-relaxed">
                        Get our head chef's exclusive <strong className="text-apron-caramel">Normandy Vanilla Sponge</strong> recipe PDF delivered free to your inbox.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full py-3.5 pl-11 pr-5 rounded-2xl border border-white/60 bg-white/60 soft-neumorphic text-sm text-apron-charcoal focus:outline-none focus:border-apron-caramel/40 placeholder-apron-charcoal/30"
                        />
                        <Mail className="w-4 h-4 text-apron-caramel/50 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="submit"
                        className="w-full btn-liquid py-3.5 rounded-full bg-apron-caramel text-white font-semibold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Send Me the Recipe
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <button
                      onClick={handleClose}
                      className="w-full text-center text-[10px] text-apron-charcoal/35 font-sans mt-3 cursor-pointer hover:text-apron-charcoal/60 transition-colors"
                    >
                      No thanks, I don't like free recipes
                    </button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6 text-center space-y-3"
                  >
                    <div className="text-4xl">🎂</div>
                    <h3 className="font-serif text-xl font-bold text-apron-charcoal">Recipe is on its way!</h3>
                    <p className="text-xs text-apron-charcoal/55 font-sans">
                      Check your inbox for the Normandy Vanilla recipe from our head chef Audrey.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
