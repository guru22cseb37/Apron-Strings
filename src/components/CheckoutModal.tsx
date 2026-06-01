"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, Mail, MapPin, Gift, Check, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, couponApplied, createOrder } = useApp();

  // Lock body scroll and stop Lenis smooth scrolling when checkout modal is open
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

  // Stepper state
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "COD" | "GPay" | "PhonePe">("Card");
  const [upiId, setUpiId] = useState("");

  // Step 1: Customer Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // Step 2: Packaging
  const [giftWrap, setGiftWrap] = useState(false);
  const [candles, setCandles] = useState(false);
  const [giftCard, setGiftCard] = useState(false);
  const [giftCardText, setGiftCardText] = useState("");

  // Step 3: Card Details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Pricing math
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 9.99;
  
  const packagingCost = 
    (giftWrap ? 5.00 : 0) + 
    (candles ? 3.50 : 0) + 
    (giftCard ? 4.50 : 0);
  
  const total = subtotal - discount + shipping + packagingCost;

  // Address lookup simulator
  const handleAddressChange = (val: string) => {
    setAddress(val);
    if (val.length > 1) {
      const db = [
        "123 Chocolate Blvd, Sweet Valley",
        "14 Pastry Hill, Cream City",
        "88 Caramel Lane, Sugar Land",
        "7 Vanilla Court, Dessert Ridge",
        "204 Flaky Croissant Way, Paris Heights",
      ];
      setAddressSuggestions(db.filter((item) => item.toLowerCase().includes(val.toLowerCase())));
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (val: string) => {
    setAddress(val);
    setAddressSuggestions([]);
  };

  // Format card inputs
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    const formatted = clean.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length > 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const sendWhatsAppRedirect = (orderId: string) => {
    const phoneNumber = "919940716032"; // Admin WhatsApp Phone
    
    // Construct items list text
    const itemsText = cart.map(item => {
      const customizationText = item.customization 
        ? `\n   └ 🍦 Cream: ${item.customization.cream || "None"}${item.customization.message ? ` | ✍️ Message: "${item.customization.message}"` : ""}`
        : "";
      return `🧁 *${item.product.name}* (x${item.quantity}) - ₹${(item.product.price * item.quantity).toFixed(2)}${customizationText}`;
    }).join("\n");

    const packagingDetails = [
      giftWrap ? "🎀 Luxury Satin Gift Wrap (+₹5.00)" : "",
      candles ? "🕯️ Premium Sparkles & Candles (+₹3.50)" : "",
      giftCard ? `✉️ Fountain Note: "${giftCardText}" (+₹4.50)` : "",
    ].filter(Boolean).join("\n");

    // Construct the elegant message
    const message = `✨ *NEW ORDER PLACED!* 🎂
-----------------------------------
👑 *Order Number:* ${orderId}
👤 *Customer Name:* ${name}
📧 *Email:* ${email}
📍 *Delivery Address:* ${address}

📅 *Delivery Date:* ${deliveryDate || "As soon as possible"}
⏰ *Delivery Time:* ${deliveryTime || "During open hours"}

📦 *Items Ordered:*
${itemsText}

${packagingDetails ? `🎁 *Premium Packaging:*\n${packagingDetails}\n` : ""}
-----------------------------------
🏷️ *Subtotal:* ₹${subtotal.toFixed(2)}
💸 *Discount:* -₹${discount.toFixed(2)}
🚚 *Delivery Charges:* ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
💰 *Total Billed:* *₹${total.toFixed(2)}*

🍰 _Thank you for choosing Apron Strings Bakery!_ 🧑‍🍳`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create order entry in AppContext
      const order = createOrder(name, email, address, deliveryDate, deliveryTime);
      setCreatedOrderNumber(order.id);
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger beautiful pastel flower/sugar confetti celebration!
      const colors = ["#FFE8ED", "#FFF3EC", "#FAF7F2", "#D6A575"];
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors,
      });

      const end = Date.now() + (1.5 * 1000);
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Automatically redirect to WhatsApp!
      sendWhatsAppRedirect(order.id);

    }, 2500);
  };

  const downloadOrderCertificate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Vintage parchment
    ctx.fillStyle = "#FAF5EC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(214, 165, 117, 0.05)";
    for (let i = 0; i < 500; i++) {
      ctx.fillRect(Math.random() * 800, Math.random() * 1000, 2, 2);
    }

    // Border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 940);
    ctx.strokeStyle = "#AA7C11";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, 720, 920);

    // Header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#2D2926";
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText("APRON STRINGS", 400, 120);

    ctx.fillStyle = "#AA7C11";
    ctx.font = "italic 14px 'Playfair Display', Georgia, serif";
    ctx.fillText("—   A R T I S A N   P A T I S S E R I E   —", 400, 175);

    ctx.fillStyle = "#8E6D38";
    ctx.font = "italic bold 32px 'Playfair Display', Georgia, serif";
    ctx.fillText("Gourmet Order Receipt & Recipe", 400, 240);

    ctx.beginPath();
    ctx.moveTo(250, 280);
    ctx.lineTo(550, 280);
    ctx.strokeStyle = "rgba(142, 109, 56, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Body
    ctx.fillStyle = "#2D2926";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText(`This confirms that Order ${createdOrderNumber} has been successfully booked`, 400, 330);
    ctx.fillText("and scheduled for baking at our artisan Normandy ovens.", 400, 360);

    ctx.fillStyle = "#8E6D38";
    ctx.font = "bold uppercase tracking-wider 12px sans-serif";
    ctx.fillText("DELIVERY & ORDER RECEIPT DETAILS", 400, 420);

    ctx.strokeStyle = "rgba(142, 109, 56, 0.2)";
    ctx.strokeRect(120, 450, 560, 320);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(120, 450, 560, 320);

    const itemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

    const specs = [
      { key: "Order Number:", value: createdOrderNumber },
      { key: "Customer Name:", value: name },
      { key: "Delivery Address:", value: address.length > 35 ? address.slice(0, 35) + "..." : address },
      { key: "Items Booked:", value: `${itemsCount} handcrafted desserts` },
      { key: "Packaging Wrap:", value: giftWrap ? "Satin Gift Wrap & Cursive Card" : "Standard Bakery Box" },
      { key: "Payment Method:", value: paymentMethod === "Card" ? "Credit / Debit Card" : paymentMethod === "COD" ? "Cash on Delivery (COD)" : paymentMethod === "GPay" ? "Google Pay (UPI)" : "PhonePe (UPI)" },
      { key: "Total Amount Billed:", value: `₹${total.toFixed(2)}` },
    ];

    ctx.textAlign = "left";
    specs.forEach((s, idx) => {
      const y = 485 + idx * 46;
      ctx.fillStyle = "#AA7C11";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(s.key, 150, y);

      ctx.fillStyle = "#2D2926";
      ctx.font = "italic 15px Georgia, serif";
      ctx.fillText(s.value, 330, y);
    });

    // Seal
    const sealX = 250;
    const sealY = 880;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(sealX - 8, sealY - 8, 5, sealX, sealY, 40);
    sealGrad.addColorStop(0, "#D93636");
    sealGrad.addColorStop(0.8, "#B31C1C");
    sealGrad.addColorStop(1, "#801010");
    ctx.fillStyle = sealGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sealX, sealY, 32, 0, Math.PI * 2);
    ctx.strokeStyle = "#801010";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E6C687";
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText("N", sealX, sealY);

    // Signature
    const sigX = 550;
    const sigY = 870;
    ctx.textAlign = "center";
    ctx.fillStyle = "#2D2926";
    ctx.font = "italic 24px 'Playfair Display', Georgia, serif";
    ctx.fillText("Audrey Hepburn", sigX, sigY);

    ctx.beginPath();
    ctx.moveTo(sigX - 100, sigY + 12);
    ctx.lineTo(sigX + 100, sigY + 12);
    ctx.strokeStyle = "#8E6D38";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#8E6D38";
    ctx.font = "bold 9px sans-serif";
    ctx.fillText("CHEF DE PATISSERIE", sigX, sigY + 28);
    ctx.fillText("APRON STRINGS BAKERY", sigX, sigY + 40);

    ctx.fillStyle = "#2D2926";
    ctx.font = "11px Georgia, serif";
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillText(`Dated: ${dateStr}`, 400, 800);

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Apron-Strings-Invoice-${createdOrderNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Invoice certificate generation failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-apron-charcoal/45 backdrop-blur-sm"
      />

      {/* Checkout Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-apron-cream rounded-3xl overflow-hidden border border-white shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
        data-lenis-prevent
      >
        {/* Close Button */}
        {!isProcessing && !isSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md text-apron-charcoal hover:text-apron-caramel transition-colors cursor-pointer soft-neumorphic"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 h-full">
          
          {/* LEFT PANEL: Multi-step checkout form flow */}
          <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between text-left">
            <AnimatePresence mode="wait">
              {/* Receipt Success View */}
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100 mx-auto shadow-md animate-bounce">
                    <Check className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-apron-caramel block">
                      Order Fully Dispatched
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-apron-charcoal">
                      Fresh Happiness Booked!
                    </h2>
                    <p className="text-xs text-apron-charcoal/50 max-w-sm mx-auto font-sans leading-relaxed">
                      Thank you for dining at Apron Strings. Our patissiers are preheating the ovens to sculpt your gourmet treats.
                    </p>
                  </div>

                  {/* Order receipt block */}
                  <div className="max-w-md mx-auto p-5 rounded-2xl border border-white bg-white/75 backdrop-blur-md soft-neumorphic space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-apron-beige/35 font-bold">
                      <span className="text-apron-charcoal">Order Number:</span>
                      <span className="text-apron-caramel">{createdOrderNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-apron-charcoal/65">
                      <span>Customer:</span>
                      <span className="font-semibold text-apron-charcoal">{name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-apron-charcoal/65">
                      <span>Delivery Location:</span>
                      <span className="font-semibold text-apron-charcoal text-right line-clamp-1 max-w-[200px]">{address}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-apron-charcoal/65">
                      <span>Items:</span>
                      <span className="font-semibold text-apron-charcoal">
                        {cart.reduce((acc, i) => acc + i.quantity, 0)} desserts
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-apron-beige/35 font-bold text-apron-charcoal">
                      <span>Total Billed:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => sendWhatsAppRedirect(createdOrderNumber)}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover-magnetic border border-transparent"
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4 text-white"
                      >
                        <path d="M12.031 2c-5.524 0-10 4.476-10 10 0 1.83.493 3.548 1.349 5.029l-1.379 5.041 5.163-1.353c1.42.793 3.037 1.283 4.867 1.283 5.524 0 10-4.476 10-10s-4.476-10-10-10zm.04 17.5a7.46 7.46 0 0 1-3.83-1.049l-.275-.164-2.852.748.761-2.784-.183-.292a7.447 7.447 0 0 1-1.142-3.959c0-4.12 3.351-7.471 7.471-7.471 4.12 0 7.471 3.351 7.471 7.471 0 4.12-3.351 7.471-7.421 7.471zm3.84-5.183c-.21-.105-1.246-.615-1.439-.685-.192-.07-.332-.105-.472.105-.14.21-.543.685-.665.825-.123.14-.246.158-.456.053-.21-.105-.889-.327-1.693-1.042-.625-.558-1.047-1.248-1.17-1.458-.123-.21-.013-.323.092-.428.095-.095.21-.246.315-.368.105-.123.14-.21.21-.35.07-.14.035-.263-.017-.368-.052-.105-.472-1.14-.648-1.56-.172-.411-.343-.356-.472-.363-.12-.006-.259-.007-.399-.007-.14 0-.368.053-.56.263-.193.21-.737.72-.737 1.754s.754 2.035.859 2.175c.105.14 1.484 2.266 3.59 3.175.5.216.89.346 1.196.443.504.16 1.036.136 1.426.079.435-.064 1.246-.51 1.421-.998.175-.488.175-.91.123-.998-.053-.088-.193-.14-.403-.245z"/>
                      </svg>
                      Share via WhatsApp
                    </button>

                    <button
                      onClick={downloadOrderCertificate}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-apron-caramel text-apron-caramel text-xs font-semibold uppercase tracking-wider hover:bg-apron-peach/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover-magnetic"
                    >
                      <Sparkles className="w-4 h-4 text-apron-gold animate-pulse" />
                      Download Recipe Receipt
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto btn-liquid py-3.5 px-8 rounded-full bg-apron-caramel text-white text-xs font-semibold uppercase tracking-wider shadow-md hover-magnetic cursor-pointer"
                    >
                      Back to Lounge
                    </button>
                  </div>
                </motion.div>
              ) : isProcessing ? (
                /* Processing payment overlay */
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-apron-caramel/60 animate-spin flex items-center justify-center text-apron-caramel bg-white/40 shadow-sm border-t-transparent" />
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-apron-charcoal mb-1">
                      Securing Chef Vault
                    </h3>
                    <p className="text-xs text-apron-caramel uppercase tracking-widest font-semibold">
                      Authorizing Stripe Premium payment gateway
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Stepper Forms */
                <div className="space-y-6">
                  {/* Stepper Progress bar */}
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-apron-caramel mb-4 pb-2 border-b border-apron-beige/25">
                    <span className={step >= 1 ? "text-apron-caramel" : "text-apron-charcoal/20"}>1. Customer Details</span>
                    <span className={step >= 2 ? "text-apron-caramel" : "text-apron-charcoal/20"}>2. Satin Wrapper</span>
                    <span className={step >= 3 ? "text-apron-caramel" : "text-apron-charcoal/20"}>3. Payment Desk</span>
                  </div>

                  {/* Step 1: Customer details forms */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-serif text-2xl font-bold text-apron-charcoal">Delivery Contact Info</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Audrey Hepburn"
                          className="w-full py-3.5 px-5 rounded-2xl border border-white/60 bg-white/40 soft-neumorphic text-sm text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="audrey@elegance.com"
                            className="w-full py-3.5 pl-11 pr-5 rounded-2xl border border-white/60 bg-white/40 soft-neumorphic text-sm text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                          />
                          <Mail className="w-4.5 h-4.5 text-apron-caramel/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Delivery Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            placeholder="Type here..."
                            className="w-full py-3.5 pl-11 pr-5 rounded-2xl border border-white/60 bg-white/40 soft-neumorphic text-sm text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                          />
                          <MapPin className="w-4.5 h-4.5 text-apron-caramel/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Autocomplete dropdown */}
                        {addressSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-apron-peach/60 shadow-xl overflow-hidden z-30">
                            {addressSuggestions.map((sug) => (
                              <button
                                key={sug}
                                onClick={() => handleSelectAddress(sug)}
                                className="w-full p-4 text-left text-xs font-sans font-medium text-apron-charcoal hover:bg-apron-peach/30 transition-colors border-b border-apron-cream last:border-0"
                              >
                                📍 {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delivery Date & Time Pickers */}
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Delivery Date</label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full py-3.5 px-5 rounded-2xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Delivery Time</label>
                          <input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="w-full py-3.5 px-5 rounded-2xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40 cursor-pointer"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Packaging checkmarks */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <h3 className="font-serif text-2xl font-bold text-apron-charcoal">Premium Packaging Options</h3>
                      
                      <div className="space-y-3">
                        {/* Satin wrap */}
                        <label className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${giftWrap ? "bg-apron-peach/60 border-apron-caramel/40 shadow-xs" : "bg-white border-white/80 soft-neumorphic"}`}>
                          <div className="flex items-center gap-3.5">
                            <input
                              type="checkbox"
                              checked={giftWrap}
                              onChange={(e) => setGiftWrap(e.target.checked)}
                              className="w-4 h-4 rounded text-apron-caramel focus:ring-apron-caramel cursor-pointer"
                            />
                            <div>
                              <span className="block text-xs font-bold uppercase tracking-wide text-apron-charcoal">Luxury Satin Gift Wrap</span>
                              <span className="block text-[10px] text-apron-charcoal/50 font-light mt-0.5">Wrapped in thick pastel cream paper and hand-tied double satin bow</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-apron-caramel">+₹5.00</span>
                        </label>

                        {/* Candles */}
                        <label className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${candles ? "bg-apron-peach/60 border-apron-caramel/40 shadow-xs" : "bg-white border-white/80 soft-neumorphic"}`}>
                          <div className="flex items-center gap-3.5">
                            <input
                              type="checkbox"
                              checked={candles}
                              onChange={(e) => setCandles(e.target.checked)}
                              className="w-4 h-4 rounded text-apron-caramel focus:ring-apron-caramel cursor-pointer"
                            />
                            <div>
                              <span className="block text-xs font-bold uppercase tracking-wide text-apron-charcoal">Premium Birthday Sparkles & Candles</span>
                              <span className="block text-[10px] text-apron-charcoal/50 font-light mt-0.5">Includes 6 organic beeswax pastel candle rods and safety matchbox</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-apron-caramel">+₹3.50</span>
                        </label>

                        {/* Handwritten gift note */}
                        <label className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${giftCard ? "bg-apron-peach/60 border-apron-caramel/40 shadow-xs" : "bg-white border-white/80 soft-neumorphic"}`}>
                          <div className="flex items-center gap-3.5">
                            <input
                              type="checkbox"
                              checked={giftCard}
                              onChange={(e) => setGiftCard(e.target.checked)}
                              className="w-4 h-4 rounded text-apron-caramel focus:ring-apron-caramel cursor-pointer"
                            />
                            <div>
                              <span className="block text-xs font-bold uppercase tracking-wide text-apron-charcoal">Handwritten Gift Card Message</span>
                              <span className="block text-[10px] text-apron-charcoal/50 font-light mt-0.5">Written in gold fountain cursive on frosted vanilla cardstock</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-apron-caramel">+₹4.50</span>
                        </label>
                      </div>

                      {giftCard && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-2"
                        >
                          <textarea
                            value={giftCardText}
                            onChange={(e) => setGiftCardText(e.target.value)}
                            placeholder="Write your cursive message card text here..."
                            rows={3}
                            maxLength={150}
                            className="w-full p-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic text-xs font-sans focus:outline-none focus:border-apron-caramel/40 text-apron-charcoal placeholder-apron-charcoal/30"
                          />
                          <span className="text-[9px] font-semibold text-apron-caramel/75 float-right mr-2 mt-1">
                            {giftCardText.length}/150
                          </span>
                        </motion.div>
                      )}

                      {/* Dynamic ribbon wrapping gift visualizer box */}
                      {giftWrap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                          className="pt-2 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md border border-[#d6a575]/25 p-4 rounded-3xl soft-neumorphic mt-3 text-center"
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#d6a575] mb-2 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-apron-gold animate-pulse" /> Gold Satin Wrapping Active
                          </span>
                          
                          {/* Animated 3D-ish Isometric Box Container */}
                          <div className="relative w-40 h-40 flex items-center justify-center select-none">
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-[#fff5ea]/40 rounded-full blur-md animate-pulse" />
                            
                            {/* Gift Box Base */}
                            <div className="relative w-28 h-28 bg-gradient-to-tr from-[#ffebe6] to-white border border-[#d6a575]/35 rounded-2xl shadow-xl flex items-center justify-center">
                              {/* Horizontal Ribbon Layer */}
                              <div className="absolute left-0 right-0 h-5 bg-[#d6a575] shadow-inner origin-center scale-x-0 animate-[ribbon-horizontal_0.5s_ease-out_0.2s_forwards]" />
                              
                              {/* Vertical Ribbon Layer */}
                              <div className="absolute top-0 bottom-0 w-5 bg-[#d6a575] shadow-inner origin-center scale-y-0 animate-[ribbon-vertical_0.5s_ease-out_0.7s_forwards]" />
                              
                              {/* Elegant Bow knot assembly in the exact center */}
                              <div className="absolute w-12 h-12 flex items-center justify-center">
                                {/* Left Bow Loop */}
                                <div className="absolute right-1/2 bottom-1/2 w-8 h-8 rounded-full border-4 border-[#d6a575] bg-[#e6bd8f]/40 origin-bottom-right rotate-45 scale-0 animate-[bow-loop-left_0.6s_ease-out_1.2s_forwards]" />
                                {/* Right Bow Loop */}
                                <div className="absolute left-1/2 bottom-1/2 w-8 h-8 rounded-full border-4 border-[#d6a575] bg-[#e6bd8f]/40 origin-bottom-left -rotate-45 scale-0 animate-[bow-loop-right_0.6s_ease-out_1.3s_forwards]" />
                                
                                {/* Center Knot Button */}
                                <div className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-[#a67c52] to-[#e6bd8f] border border-white shadow-md scale-0 animate-[knot-pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_1.7s_forwards] flex items-center justify-center">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                              
                              {/* Gold Normandy Stamp Seal on bottom corner */}
                              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#d6a575] border border-white shadow-sm flex items-center justify-center scale-0 animate-[knot-pop_0.5s_ease-out_2.0s_forwards]">
                                <span className="text-[7px] text-white font-serif font-bold">N</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-apron-charcoal/60 text-center font-sans max-w-[280px] mt-1 leading-relaxed">
                            Watch as our virtual satin ribbon seals your gourmet gift box with the Normandy Wax Seal of culinary excellence.
                          </p>

                          <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes ribbon-horizontal {
                              0% { transform: scaleX(0); }
                              100% { transform: scaleX(1); }
                            }
                            @keyframes ribbon-vertical {
                              0% { transform: scaleY(0); }
                              100% { transform: scaleY(1); }
                            }
                            @keyframes bow-loop-left {
                              0% { transform: scale(0) rotate(45deg); }
                              70% { transform: scale(1.2) rotate(45deg); }
                              100% { transform: scale(1) rotate(45deg); }
                            }
                            @keyframes bow-loop-right {
                              0% { transform: scale(0) rotate(-45deg); }
                              70% { transform: scale(1.2) rotate(-45deg); }
                              100% { transform: scale(1) rotate(-45deg); }
                            }
                            @keyframes knot-pop {
                              0% { transform: scale(0); }
                              100% { transform: scale(1); }
                            }
                          `}} />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Payment Desk with Method Selector */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-2xl font-bold text-apron-charcoal">Premium Payment Counter</h3>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 py-1 px-3 rounded-lg flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> SECURED
                        </span>
                      </div>

                      {/* Payment Method Selector Docks */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                        {[
                          { id: "Card", label: "💳 Card", desc: "Credit / Debit" },
                          { id: "COD", label: "💵 Cash (COD)", desc: "Pay on Delivery" },
                          { id: "GPay", label: "📱 GPay", desc: "Google Pay UPI" },
                          { id: "PhonePe", label: "🟣 PhonePe", desc: "PhonePe UPI" },
                        ].map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              paymentMethod === method.id
                                ? "bg-apron-caramel border-apron-caramel text-white shadow-md shadow-apron-caramel/10"
                                : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/85"
                            }`}
                          >
                            <span className="text-xs font-bold block">{method.label}</span>
                            <span className={`text-[8px] font-light block mt-0.5 ${paymentMethod === method.id ? "text-white/80" : "text-apron-charcoal/50"}`}>
                              {method.desc}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* CONDITIONAL PAYMENT FORMS */}
                      <AnimatePresence mode="wait">
                        {paymentMethod === "Card" && (
                          <motion.div
                            key="card-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                          >
                            {/* VIRTUAL GOLD CARD RENDERER */}
                            <div className="w-full aspect-[1.586/1] md:h-48 rounded-2xl bg-gradient-to-br from-[#EACDA3] via-[#C5A059] to-[#8E6D38] p-5 border border-white/30 text-white shadow-xl flex flex-col justify-between relative overflow-hidden select-none">
                              {/* Metallic golden hologram chips */}
                              <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-white/10 blur-xs pointer-events-none" />
                              
                              <div className="flex items-start justify-between">
                                <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-600 border border-white/35 opacity-90 shadow-inner" /> {/* Chip */}
                                <span className="font-sans font-bold tracking-widest text-xs italic opacity-95 text-[#FFF9E6]">GOLD PASS</span>
                              </div>

                              {/* Credit card digits front */}
                              <span className="font-mono text-base md:text-xl tracking-[0.2em] font-semibold text-[#FFFDF5] shadow-xs text-center block py-1.5">
                                {cardNumber || "•••• •••• •••• ••••"}
                              </span>

                              <div className="flex justify-between items-end">
                                <div className="text-left">
                                  <span className="block text-[8px] uppercase tracking-wider text-[#FFF9E6] opacity-75">Cardholder Name</span>
                                  <span className="block font-serif text-xs md:text-sm font-semibold tracking-wide uppercase text-[#FFFDF5] truncate max-w-[200px]">
                                    {cardName || "Audrey Hepburn"}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="block text-[8px] uppercase tracking-wider text-[#FFF9E6] opacity-75">Expiry</span>
                                  <span className="block font-mono text-xs md:text-sm text-[#FFFDF5]">
                                    {cardExpiry || "MM/YY"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Input fields */}
                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Cardholder Name</label>
                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="Audrey Hepburn"
                                  className="w-full py-3 px-4 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Credit Card Number</label>
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => handleCardNumberChange(e.target.value)}
                                  placeholder="4000 1234 5678 9010"
                                  className="w-full py-3 px-4 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Expiry Date</label>
                                  <input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => handleExpiryChange(e.target.value)}
                                    placeholder="MM/YY"
                                    className="w-full py-3 px-4 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">CVV code</label>
                                  <input
                                    type="password"
                                    maxLength={3}
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                    placeholder="•••"
                                    className="w-full py-3 px-4 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === "COD" && (
                          <motion.div
                            key="cod-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8 rounded-2xl border border-white bg-white/50 backdrop-blur-md soft-neumorphic space-y-4 text-center"
                          >
                            <div className="w-16 h-16 rounded-full bg-apron-peach/60 flex items-center justify-center text-apron-caramel mx-auto border border-white shadow-xs">
                              <span className="text-2xl">💵</span>
                            </div>
                            <div>
                              <h4 className="font-serif font-bold text-apron-charcoal text-base">Cash on Delivery (COD) Selected</h4>
                              <p className="text-xs text-apron-charcoal/60 max-w-sm mx-auto font-sans leading-relaxed mt-2">
                                Your gourmet delights will be baked fresh and hand-delivered by our premium bakery courier. Please prepare cash (₹) to complete the transaction upon delivery.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {(paymentMethod === "GPay" || paymentMethod === "PhonePe") && (
                          <motion.div
                            key="upi-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-6 rounded-2xl border border-white bg-white/50 backdrop-blur-md soft-neumorphic space-y-4 text-left"
                          >
                            <div className="flex items-center gap-3.5 border-b border-apron-beige/25 pb-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-apron-peach/60 flex items-center justify-center text-apron-caramel border border-white shadow-xs shrink-0">
                                <span className="text-lg">{paymentMethod === "GPay" ? "📱" : "🟣"}</span>
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-apron-charcoal text-sm">
                                  {paymentMethod === "GPay" ? "Google Pay (UPI)" : "PhonePe (UPI)"}
                                </h4>
                                <p className="text-[10px] text-apron-caramel/90 font-medium">Instant Secure Mobile Checkout</p>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-apron-caramel">Enter UPI ID</label>
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. yourname@okaxis or yournumber@ybl"
                                className="w-full py-3 px-4 rounded-xl border border-white/60 bg-white/40 soft-neumorphic text-xs text-apron-charcoal focus:outline-none focus:border-apron-caramel/40"
                              />
                              <span className="block text-[9px] text-apron-charcoal/45 font-light italic mt-1 leading-normal">
                                Please verify your UPI ID contains '@' and is active on your mobile app.
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Bottom Navigation controls */}
                  <div className="flex items-center justify-between pt-6 border-t border-apron-beige/35 mt-8">
                    {step > 1 ? (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="py-3 px-6 rounded-full border border-white/80 text-apron-caramel text-xs font-semibold uppercase tracking-wider cursor-pointer soft-neumorphic hover-magnetic"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <button
                        disabled={step === 1 && (!name || !email || !address || !deliveryDate || !deliveryTime)}
                        onClick={() => setStep(step + 1)}
                        className="btn-liquid py-3 px-8 rounded-full bg-apron-caramel text-white text-xs font-semibold uppercase tracking-wider shadow-md hover-magnetic cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        disabled={
                          paymentMethod === "Card" 
                            ? (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3)
                            : (paymentMethod === "GPay" || paymentMethod === "PhonePe")
                            ? (!upiId.includes("@") || upiId.length < 5)
                            : false
                        }
                        onClick={handlePayment}
                        className="btn-liquid py-3.5 px-10 rounded-full bg-apron-caramel text-white text-xs font-semibold uppercase tracking-wider shadow-md hover-magnetic cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {paymentMethod === "COD" ? "Confirm Cash Order" : "Authorize Payment"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PANEL: Sleek, high-end Invoice breakdown */}
          <div className="md:col-span-5 bg-white/40 border-l border-apron-beige/35 p-6 md:p-10 flex flex-col justify-between text-left">
            <div>
              <h3 className="font-serif text-lg font-bold text-apron-charcoal mb-6 border-b border-apron-beige/25 pb-3 flex items-center gap-1.5">
                <Gift className="w-5 h-5 text-apron-caramel" />
                Order Summary
              </h3>

              {/* Items recap lists */}
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 mb-6" data-lenis-prevent>
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white shrink-0 shadow-3xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-serif font-bold text-apron-charcoal truncate">{item.product.name}</span>
                      <span className="block text-[9px] text-apron-caramel font-semibold">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-serif font-semibold text-apron-charcoal shrink-0">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations lines */}
            <div className="space-y-3 border-t border-apron-beige/35 pt-6">
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

              {/* Packaging Surcharges line */}
              {packagingCost > 0 && (
                <div className="flex items-center justify-between text-xs text-apron-charcoal/70">
                  <span>Satin Wrap & Custom Packaging</span>
                  <span>+₹{packagingCost.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-apron-beige/35 font-serif text-xl font-bold text-apron-charcoal">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
