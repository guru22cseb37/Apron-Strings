"use client";

import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    couponApplied,
    applyCoupon,
  } = useApp();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Lock body scroll and stop Lenis smooth scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // @ts-ignore
      window.lenis?.stop();
    } else {
      document.body.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      // @ts-ignore
      window.lenis?.start();
    };
  }, [isOpen]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const deliveryThreshold = 50;
  const shipping = subtotal >= deliveryThreshold || subtotal === 0 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    const success = applyCoupon(promoCode);
    if (success) {
      setPromoSuccess(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoSuccess(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-apron-charcoal/45 backdrop-blur-sm"
          />

          {/* Drawer Body Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-apron-cream border-l border-white shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-apron-beige/35 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-apron-caramel" />
                <h2 className="font-serif text-xl font-bold text-apron-charcoal">Your Dessert Basket</h2>
                <span className="text-[10px] bg-apron-peach border border-white font-bold text-apron-caramel py-0.5 px-2.5 rounded-full">
                  {cart.length} unique
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-white/60 bg-white/40 soft-neumorphic hover:text-apron-caramel cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Banner */}
            {subtotal > 0 && (
              <div className="px-6 py-3 bg-apron-peach/45 border-b border-apron-beige/35 text-left">
                {subtotal >= deliveryThreshold ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 flex items-center gap-1.5">
                    🎉 Congratulations! You unlocked Free Express Delivery!
                  </span>
                ) : (
                  <div>
                    <span className="block text-[10px] font-semibold text-apron-caramel/90">
                      Add <strong className="font-bold">₹{(deliveryThreshold - subtotal).toFixed(2)}</strong> more for FREE Express Delivery
                    </span>
                    <div className="w-full h-1.5 bg-apron-beige/40 rounded-full mt-2 overflow-hidden border border-white/30">
                      <div
                        className="h-full bg-apron-caramel transition-all duration-500"
                        style={{ width: `${(subtotal / deliveryThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
                  {/* Whimsical animated empty cake box */}
                  <div className="relative w-32 h-32 mb-6">
                    {/* Box body */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 rounded-2xl bg-apron-peach/60 border-2 border-apron-caramel/20 flex items-end justify-center pb-2 shadow-md">
                      {/* Sad face dots */}
                      <div className="flex gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-apron-caramel/40" />
                        <div className="w-2 h-2 rounded-full bg-apron-caramel/40" />
                      </div>
                    </div>
                    {/* Box lid open */}
                    <motion.div
                      animate={{ rotate: [-5, 8, -5] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      style={{ transformOrigin: "left center" }}
                      className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 rounded-xl bg-apron-caramel/30 border-2 border-apron-caramel/20"
                    />
                    {/* Floating fork */}
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute -right-2 top-0 text-2xl select-none"
                    >
                      🍴
                    </motion.div>
                    {/* Star sparkles */}
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute top-0 left-0 text-sm select-none"
                    >
                      ✨
                    </motion.div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-apron-charcoal mb-2">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-apron-charcoal/50 font-sans font-light max-w-[200px] leading-relaxed">
                    Your sweet journey starts here 🎂<br />
                    Sift through our menu and add artisan treats to your hamper.
                  </p>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mt-6 text-[10px] text-apron-caramel/70 uppercase tracking-widest font-semibold"
                  >
                    ↑ Browse the menu above
                  </motion.div>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 p-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xs soft-neumorphic shadow-xs relative text-left"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-apron-cream border border-white shrink-0 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-bold text-apron-charcoal line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-apron-charcoal/30 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {/* Custom Cake custom config descriptions */}
                        {item.customization && (
                          <div className="mt-1 space-y-0.5 text-[9px] font-sans font-medium text-apron-caramel bg-apron-peach/30 p-2 rounded-lg border border-white/40">
                            <span className="block font-bold">🍰 Custom Build Details:</span>
                            {item.customization.flavor && <span className="block">Flavor: {item.customization.flavor}</span>}
                            {item.customization.size && <span className="block">Size: {item.customization.size}</span>}
                            {item.customization.cream && <span className="block">Frosting: {item.customization.cream}</span>}
                            {item.customization.message && (
                              <span className="block italic text-[9px] font-bold mt-1 text-[#AA7C11]">
                                Icing text: "{item.customization.message}"
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-apron-caramel font-semibold block mt-1">
                          ₹{item.product.price.toFixed(2)} each
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-apron-beige/20">
                        <div className="flex items-center gap-1.5 border border-white bg-white/50 rounded-full p-0.5 shadow-3xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs hover:bg-apron-beige/50 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-apron-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs hover:bg-apron-beige/50 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-serif text-sm font-bold text-apron-charcoal">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Cart Footer Checkout Actions */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-apron-beige/35 bg-white/30 backdrop-blur-md">
                
                {/* Coupon promo codes box */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="SWEETAPRON10 (10% Off)"
                        disabled={couponApplied}
                        className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs font-sans focus:outline-none focus:border-apron-caramel/50 text-apron-charcoal disabled:opacity-50"
                      />
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-apron-caramel/50" />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      disabled={couponApplied || !promoCode}
                      className="py-2.5 px-4 rounded-xl bg-apron-caramel text-white text-xs font-medium uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-40 disabled:pointer-events-none hover-magnetic"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <span className="text-[10px] text-red-500 font-bold block mt-1 text-left">
                      ⚠️ Invalid promo code. Try: SWEETAPRON10
                    </span>
                  )}
                  {couponApplied && (
                    <span className="text-[10px] text-green-700 font-bold flex items-center gap-1 mt-1 text-left bg-green-50 p-2 rounded-lg border border-green-100">
                      <Check className="w-3 h-3 text-green-700" />
                      Promo SWEETAPRON10 applied! 10% Off Basket items!
                    </span>
                  )}
                </div>

                {/* Bill details */}
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center justify-between text-xs text-apron-charcoal/70">
                    <span>Basket Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center justify-between text-xs text-green-700 font-semibold">
                      <span>10% Promo Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-apron-charcoal/70">
                    <span>Express Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-apron-beige/35 font-serif text-lg font-bold text-apron-charcoal">
                    <span>Grand Total</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={total.toFixed(2)}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="inline-block"
                      >
                        ₹{total.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full btn-liquid py-4 rounded-full bg-apron-caramel text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer hover-magnetic"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
