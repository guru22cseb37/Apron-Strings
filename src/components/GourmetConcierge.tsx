"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChefHat, Send, X, Sparkles, MessageSquare, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "audrey" | "user";
  text: string;
}

export default function GourmetConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "audrey",
      text: "Bonjour, chéri! I am Audrey, your AI Gourmet Concierge. 🌸 I am here to guide your palate through our exquisite collection of artisan sweets. How may I elevate your celebration today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat drawer
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle preset clicks
  const handlePresetClick = (presetText: string) => {
    sendMessage(presetText);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate Audrey's elegant reply after a brief typing pause
    setTimeout(() => {
      const responseText = generateAudreyReply(text);
      const audreyMsg: Message = {
        id: `audrey-${Date.now()}`,
        sender: "audrey",
        text: responseText,
      };
      setMessages((prev) => [...prev, audreyMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const generateAudreyReply = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("chocolate") || q.includes("cocoa") || q.includes("truffle") || q.includes("dark")) {
      return "Ah, dark chocolate — the absolute language of romance! 🍫 I highly recommend our Raspberry Chocolate Truffle pastry. It is crafted with 70% dark Valrhona cocoa mousse, layered with fresh organic raspberry coulis and Piedmont hazelnut praline. For an unforgettable pairing, enjoy it alongside a rich, warm double-shot espresso or a glass of dry Cabernet Sauvignon. Truly magnificent!";
    }

    if (q.includes("berry") || q.includes("fruit") || q.includes("strawberry") || q.includes("raspberry")) {
      return "Fresh, vibrant berries are the jewels of French patisserie! 🍓 For a crisp and elegant treat, you must try our French Strawberry Glacé Tart, filled with velvety Madagascar vanilla bean custard and fresh, hand-glazed summer strawberries. If you are celebrating, our custom Swiss Vanilla & Rose tiered cake decorated with fresh organic blossoms is an absolute dream!";
    }

    if (q.includes("gluten") || q.includes("gf") || q.includes("allergy") || q.includes("vegan") || q.includes("celiac")) {
      return "We believe luxury is for everyone, chéri! 🌱 Many of our pastries can be fully customized as Gluten-Free or Vegan. In our custom Cake Builder, you can choose organic gluten-free almond flour and dairy-free whip options! Every specialized recipe is prepared with absolute precision in our dedicated allergen-free suite of the kitchen to prevent cross-contact.";
    }

    if (q.includes("milestone") || q.includes("wedding") || q.includes("birthday") || q.includes("anniversary") || q.includes("party")) {
      return "A grand milestone deserves a true masterpiece! 🍰 Our Signature Floral Tiered Cake is designed specifically for these moments. It features multi-layered sponge frosted with soft vanilla Swiss meringue buttercream, embellished with organic edible gold flakes and handcrafted pastel sugar blossoms. Feel free to use our Cake Builder to add a personalized calligraphy message and select custom tiered flavors!";
    }

    if (q.includes("gift") || q.includes("present") || q.includes("hamper") || q.includes("box")) {
      return "To give a gift of sweetness is to share absolute happiness! 🎁 Our Artisan Grand Celebration Hamper is the ultimate curation of luxury, packed with pastel Parisian macarons, white chocolate truffles, organic cookies, and gourmet chocolate hazelnut spreads. In the checkout panel, you can also select our 'Premium Satin Wrapping' to have your gift box wrapped in custom silk ribbon.";
    }

    if (q.includes("pairing") || q.includes("tea") || q.includes("coffee") || q.includes("wine") || q.includes("drink")) {
      return "Magnifique! The right pairing unlocks hidden notes in fine pastry. 🍷 For vanilla bean creams and pastries, try a delicate hot lavender Earl Grey tea. For dark chocolates and fudge brownies, a bold, medium-dark roast coffee or a sparkling glass of champagne rose will perfectly cut through the richness and balance the sweet finish.";
    }

    if (q.includes("rupee") || q.includes("price") || q.includes("pay") || q.includes("cost") || q.includes("rs")) {
      return "Ah! All of our gourmet creations are priced in Indian Rupees (₹). You can easily see the updated prices on our Menu and customize your sizing in the builder. If you have a discount voucher, do not forget to enter it at checkout for special baker savings!";
    }

    if (q.includes("bonjour") || q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Bonjour! It is wonderful to meet you. 🌸 Tell me, are you searching for a decadent personal treat, or are you organizing an elegant celebration?";
    }

    // Default reply
    return "What an intriguing request, chéri! ✨ At Apron Strings, we handcraft every single pastry using organic French cultured butter and the world's finest extracts. I highly suggest exploring our 'Custom Cakes' builder to bring your dream dessert to life, or let me know if you would like recommendations on chocolate, allergen-free options, or fine tea pairings!";
  };

  const presets = [
    { text: "🍰 Recommend a milestone masterpiece", q: "milestone" },
    { text: "🌱 Do you offer Gluten-Free options?", q: "gluten" },
    { text: "🍷 What are the best dessert pairings?", q: "pairing" },
    { text: "🎁 Find the perfect gourmet gift", q: "gift" },
  ];

  return (
    <>
      {/* Floating Concierge Bubble Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasNotification(false);
          }}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-apron-caramel to-apron-gold text-white shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer border border-white/40"
        >
          <ChefHat className="w-6 h-6 animate-pulse" />
          
          <AnimatePresence>
            {hasNotification && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-4 w-4"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-white"></span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Hover Tooltip */}
          <span className="absolute right-16 bg-white/90 backdrop-blur-md text-apron-charcoal border border-apron-peach/60 shadow-lg px-3 py-1.5 rounded-xl text-xs font-serif font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with Audrey ✨
          </span>
        </button>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[520px] rounded-3xl bg-white/75 backdrop-blur-xl border border-white/50 shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
          >
            {/* Elegant Header */}
            <div className="p-4 bg-gradient-to-r from-apron-peach/60 to-apron-pink/60 border-b border-apron-peach/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-apron-caramel flex items-center justify-center border border-white text-white">
                  <ChefHat className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-apron-charcoal text-sm flex items-center gap-1.5">
                    Audrey <Sparkles className="w-3.5 h-3.5 text-apron-gold animate-bounce" />
                  </h3>
                  <p className="text-[10px] text-apron-caramel/90 font-medium uppercase tracking-wider">
                    AI Gourmet Concierge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/50 text-apron-charcoal/60 hover:text-apron-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-apron-cream/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                      msg.sender === "user"
                        ? "bg-apron-caramel text-white rounded-br-none border-apron-caramel/20"
                        : "bg-white/95 text-apron-charcoal rounded-bl-none border-white/80 font-serif italic"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/95 text-apron-charcoal p-3.5 rounded-2xl rounded-bl-none border border-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-apron-caramel rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-apron-caramel rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-apron-caramel rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Options */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 flex flex-col gap-1.5 border-t border-apron-peach/20 bg-white/40">
                <p className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel/70 mb-1">
                  Suggested Questions
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset.text)}
                      className="text-left text-[11px] font-medium p-2 rounded-xl bg-white/80 hover:bg-apron-peach/40 text-apron-charcoal hover:text-apron-caramel transition-all border border-apron-peach/20 cursor-pointer shadow-sm"
                    >
                      {preset.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white/90 border-t border-apron-peach/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Audrey about pairings, GF options..."
                className="flex-1 bg-apron-cream/35 border border-apron-peach/40 rounded-xl px-3 py-2 text-xs font-sans text-apron-charcoal placeholder-apron-charcoal/40 focus:outline-none focus:border-apron-caramel focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2 rounded-xl bg-apron-caramel disabled:bg-apron-caramel/45 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
