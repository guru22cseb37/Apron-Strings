"use client";

import { useState, useEffect, useRef } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Heart, ShoppingBag, Eye, Cake, Plus, Check } from "lucide-react";

export default function CakeBuilder() {
  const { addToCart } = useApp();
  
  // Custom states
  const [flavor, setFlavor] = useState("Madagascar Bourbon Vanilla");
  const [size, setSize] = useState("8\" Classic");
  const [cream, setCream] = useState("Swiss Meringue Buttercream");
  const [message, setMessage] = useState("");
  const [addedToCartAlert, setAddedToCartAlert] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Flavor selections
  const flavors = [
    { name: "Madagascar Bourbon Vanilla", desc: "Classic rich vanilla bean cake", price: 0 },
    { name: "Velvety Red Velvet Cocoa", desc: "Fluffy red velvet sponge with a hint of cocoa", price: 5 },
    { name: "Belgian Callebaut Dark Chocolate", desc: "Decadent dark fudge sponge", price: 8 },
    { name: "Salted Caramel Pecan Praline", desc: "Caramel sponge with praline crunches", price: 10 },
    { name: "Sicilian Roasted Pistachio Rose", desc: "Aromatic pistachio and floral rose water", price: 12 },
  ];

  // Size selections
  const sizes = [
    { name: "6\" Petit", desc: "Feeds 4-6 guests", price: 45 },
    { name: "8\" Classic", desc: "Feeds 8-12 guests", price: 65 },
    { name: "10\" Grand", desc: "Feeds 15-20 guests", price: 85 },
    { name: "2-Tier Celebration", desc: "Feeds 25-35 guests (6\" + 9\")", price: 145 },
  ];

  // Frosting colors & prices
  const creams = [
    { name: "Swiss Meringue Buttercream", desc: "Ultra-silky and light vanilla whip", color: "#FCFAF6", price: 0 },
    { name: "Soft Pink Rose Chantilly", desc: "Whipped cream infused with organic rose water", color: "#FFE8ED", price: 5 },
    { name: "Rich Salted Bronze Caramel", desc: "Bronze whipped ganache with caramel ribbons", color: "#EACDA3", price: 8 },
    { name: "Belgian White Chocolate Ganache", desc: "Velvety, rich white chocolate cream", color: "#FFF9E6", price: 10 },
  ];

  // Dynamic pricing calculation
  const getSelectedPrice = () => {
    const sizeObj = sizes.find((s) => s.name === size) || sizes[1];
    const flavorObj = flavors.find((f) => f.name === flavor) || flavors[0];
    const creamObj = creams.find((c) => c.name === cream) || creams[0];
    return sizeObj.price + flavorObj.price + creamObj.price;
  };

  // Draw cake inside the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const width = (canvas.width = 400);
    const height = (canvas.height = 420);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get cream color
    const selectedCream = creams.find((c) => c.name === cream) || creams[0];
    const frostingColor = selectedCream.color;

    // Draw luxury marble cake stand
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 60, 150, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#EAE6DF";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Stand base pillar
    ctx.fillStyle = "#DCD7CE";
    ctx.fillRect(width / 2 - 25, height - 60, 50, 40);
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 20, 80, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#C8C2B7";
    ctx.fill();

    // Setup cake parameters
    const isDoubleTier = size === "2-Tier Celebration";
    const baseCakeY = height - 120;
    
    // Draw Single or Multi Tiers
    if (isDoubleTier) {
      // Bottom Tier
      drawCakeTier(ctx, width / 2, baseCakeY, 200, 100, frostingColor);
      // Top Tier
      drawCakeTier(ctx, width / 2, baseCakeY - 80, 140, 80, frostingColor);
    } else {
      // Single Tier (size scaling)
      let cakeWidth = 200;
      let cakeHeight = 120;
      if (size === "6\" Petit") {
        cakeWidth = 160;
        cakeHeight = 100;
      } else if (size === "10\" Grand") {
        cakeWidth = 240;
        cakeHeight = 130;
      }
      drawCakeTier(ctx, width / 2, baseCakeY, cakeWidth, cakeHeight, frostingColor);
    }

    // Write custom cursive gold message
    if (message.trim().length > 0) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Beautiful gold text gradient
      const textGrad = ctx.createLinearGradient(width / 2 - 80, 0, width / 2 + 80, 0);
      textGrad.addColorStop(0, "#B8860B"); // Dark Goldenrod
      textGrad.addColorStop(0.5, "#D4AF37"); // Gold
      textGrad.addColorStop(1, "#AA7C11"); // Rich Gold

      // Text shading shadows
      ctx.shadowColor = "rgba(40, 37, 34, 0.25)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = textGrad;

      // Font sizing depending on tier count
      if (isDoubleTier) {
        ctx.font = "italic bold 18px 'Playfair Display', Georgia, serif";
        // Draw gold text curved/centered on bottom tier cylinder face
        ctx.fillText(message.slice(0, 18), width / 2, baseCakeY - 40);
        if (message.length > 18) {
          ctx.font = "italic bold 15px 'Playfair Display', Georgia, serif";
          ctx.fillText(message.slice(18, 36), width / 2, baseCakeY - 20);
        }
      } else {
        ctx.font = "italic bold 20px 'Playfair Display', Georgia, serif";
        ctx.fillText(message.slice(0, 20), width / 2, baseCakeY - 50);
        if (message.length > 20) {
          ctx.font = "italic bold 16px 'Playfair Display', Georgia, serif";
          ctx.fillText(message.slice(20, 40), width / 2, baseCakeY - 25);
        }
      }
      ctx.restore();
    }
  }, [flavor, size, cream, message]);

  // Utility to draw a shaded 3D cylinder tier
  function drawCakeTier(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    frostingColor: string
  ) {
    const rx = w / 2;
    const ry = 22; // ellipse perspective flattening

    // 1. Draw bottom curve contour
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI, false);
    ctx.lineTo(x - rx, y - h);
    ctx.ellipse(x, y - h, rx, ry, 0, Math.PI, 0, true);
    ctx.lineTo(x + rx, y);
    ctx.closePath();

    // Color gradient for 3D cylinder depth
    const faceGrad = ctx.createLinearGradient(x - rx, 0, x + rx, 0);
    faceGrad.addColorStop(0, darkenColor(frostingColor, 15));
    faceGrad.addColorStop(0.2, darkenColor(frostingColor, 5));
    faceGrad.addColorStop(0.5, frostingColor);
    faceGrad.addColorStop(0.85, darkenColor(frostingColor, 5));
    faceGrad.addColorStop(1, darkenColor(frostingColor, 22));
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // 2. Draw Top Cake Oval Face
    ctx.beginPath();
    ctx.ellipse(x, y - h, rx, ry, 0, 0, Math.PI * 2);
    const topGrad = ctx.createRadialGradient(x, y - h, 5, x, y - h, rx);
    topGrad.addColorStop(0, lightenColor(frostingColor, 10));
    topGrad.addColorStop(1, darkenColor(frostingColor, 8));
    ctx.fillStyle = topGrad;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.stroke();

    // 3. Draw premium piped frosting swirls on rim
    const swirlCount = 18;
    ctx.save();
    for (let i = 0; i < swirlCount; i++) {
      const angle = (i * Math.PI * 2) / swirlCount;
      const swirlX = x + Math.cos(angle) * rx;
      const swirlY = y - h + Math.sin(angle) * ry;

      ctx.beginPath();
      ctx.arc(swirlX, swirlY, 6, 0, Math.PI * 2);
      const swirlGrad = ctx.createRadialGradient(swirlX - 2, swirlY - 2, 1, swirlX, swirlY, 6);
      swirlGrad.addColorStop(0, "#FFFFFF");
      swirlGrad.addColorStop(0.4, frostingColor);
      swirlGrad.addColorStop(1, darkenColor(frostingColor, 12));
      ctx.fillStyle = swirlGrad;
      ctx.fill();
    }
    ctx.restore();

    // 4. Edible gold flakes sprinkles
    ctx.save();
    ctx.fillStyle = "rgba(212, 175, 55, 0.85)"; // Gold flakes
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (rx - 10);
      const spX = x + Math.cos(angle) * dist;
      const spY = y - h + Math.sin(angle) * (ry - 5) + (Math.random() * 4 - 2);

      ctx.beginPath();
      // Little gold random speck rectangles
      ctx.fillRect(spX, spY, 3, 2);
    }
    ctx.restore();
  }

  // Color modification helpers
  function darkenColor(hex: string, percent: number) {
    let num = parseInt(hex.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 +
        (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 +
        (B < 0 ? 0 : B > 255 ? 255 : B)
      )
        .toString(16)
        .slice(1)
    );
  }

  function lightenColor(hex: string, percent: number) {
    let num = parseInt(hex.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 0 ? 0 : R > 255 ? 255 : R) * 0x10000 +
        (G < 0 ? 0 : G > 255 ? 255 : G) * 0x100 +
        (B < 0 ? 0 : B > 255 ? 255 : B)
      )
        .toString(16)
        .slice(1)
    );
  }

  const downloadCertificate = () => {
    // 1. Create a high-res offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 2. Fill vintage parchment background
    ctx.fillStyle = "#FAF5EC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle parchment texture (soft random dust specs)
    ctx.fillStyle = "rgba(214, 165, 117, 0.05)";
    for (let i = 0; i < 500; i++) {
      ctx.fillRect(Math.random() * 800, Math.random() * 1000, 2, 2);
    }

    // 3. Draw elegant gold leaf double borders
    ctx.strokeStyle = "#D4AF37"; // Gold color
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 940);
    ctx.strokeStyle = "#AA7C11"; // Darker gold accent
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, 720, 920);

    // Corner flourishes (simple stylish triangles or scrolls)
    const corners = [
      { x: 40, y: 40, dx: 1, dy: 1 },
      { x: 760, y: 40, dx: -1, dy: 1 },
      { x: 40, y: 960, dx: 1, dy: -1 },
      { x: 760, y: 960, dx: -1, dy: -1 },
    ];
    corners.forEach((c) => {
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + c.dy * 30);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(c.x + c.dx * 30, c.y);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // 4. Draw Header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // "APRON STRINGS"
    ctx.fillStyle = "#2D2926"; // Rich charcoal
    ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
    ctx.fillText("APRON STRINGS", 400, 120);

    // Subheader
    ctx.fillStyle = "#AA7C11";
    ctx.font = "italic 14px 'Playfair Display', Georgia, serif";
    ctx.fillText("—   A R T I S A N   P A T I S S E R I E   —", 400, 175);

    // "Gourmet Recipe Certificate"
    ctx.fillStyle = "#8E6D38";
    ctx.font = "italic bold 32px 'Playfair Display', Georgia, serif";
    ctx.fillText("Gourmet Recipe Certificate", 400, 240);

    // Divider line
    ctx.beginPath();
    ctx.moveTo(250, 280);
    ctx.lineTo(550, 280);
    ctx.strokeStyle = "rgba(142, 109, 56, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Draw Certificate Text
    ctx.fillStyle = "#2D2926";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText("This certifies that a bespoke celebration masterpiece has been sculpted", 400, 330);
    ctx.fillText("to absolute perfection at our Normandy baking studio.", 400, 360);

    // Recipient message header
    ctx.fillStyle = "#8E6D38";
    ctx.font = "bold uppercase tracking-wider 12px sans-serif";
    ctx.fillText("SELECTED BESPOKE SPECIFICATIONS", 400, 420);

    // Specs box
    ctx.strokeStyle = "rgba(142, 109, 56, 0.2)";
    ctx.strokeRect(150, 450, 500, 320);
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(150, 450, 500, 320);

    // Draw parameters
    const specs = [
      { key: "Sponge Base:", value: flavor },
      { key: "Frosting Cream:", value: cream },
      { key: "Tiers & Size:", value: size },
      { key: "Gold Script Message:", value: message || "No custom message requested" },
      { key: "Normandy Quality Rank:", value: "Grade A Extra-Fined Premium" }
    ];

    ctx.textAlign = "left";
    specs.forEach((s, idx) => {
      const y = 490 + idx * 52;
      ctx.fillStyle = "#AA7C11";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(s.key, 180, y);

      ctx.fillStyle = "#2D2926";
      ctx.font = "italic 15px Georgia, serif";
      ctx.fillText(s.value, 330, y);
    });

    // 6. Draw Wax Seal (Normandy Stamp)
    const sealX = 250;
    const sealY = 880;

    // Wax shape
    ctx.beginPath();
    ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(sealX - 8, sealY - 8, 5, sealX, sealY, 40);
    sealGrad.addColorStop(0, "#D93636"); // Bright crimson
    sealGrad.addColorStop(0.8, "#B31C1C"); // Solid crimson
    sealGrad.addColorStop(1, "#801010"); // Dark wax edges
    ctx.fillStyle = sealGrad;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    // Wax seal inner ridge
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 32, 0, Math.PI * 2);
    ctx.strokeStyle = "#801010";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wax letter "A" in gold
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E6C687";
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText("A", sealX, sealY);

    // 7. Signature & Date
    const sigX = 550;
    const sigY = 870;

    ctx.textAlign = "center";
    ctx.fillStyle = "#2D2926";
    ctx.font = "italic 24px 'Playfair Display', Georgia, serif";
    ctx.fillText("Audrey Hepburn", sigX, sigY);

    // Under signature line
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

    // Customization Date
    ctx.fillStyle = "#2D2926";
    ctx.font = "11px Georgia, serif";
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillText(`Dated: ${dateStr}`, 400, 800);

    // 8. Convert to Data URL and trigger download
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Apron-Strings-Gourmet-Recipe-Certificate.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Certificate generation failed", err);
    }
  };

  const handleCreateCustomCake = () => {
    // Custom simulated MenuItem
    const customCakeItem: MenuItem = {
      id: `custom-cake-${Date.now()}`,
      name: `Custom ${flavor} Cake`,
      category: "Cakes",
      price: getSelectedPrice(),
      rating: 5.0,
      image: "/images/hero-cake.png", // standard showcase cake
      description: `A custom-crafted celebration cake tailored with a moist ${flavor} base, rich ${cream} coating, in a spacious ${size} sizing. Personal gold icing lettering: "${message || "None"}"`,
      ingredients: [flavor, cream, "Organic wheat flour", "Farm fresh eggs"],
      allergens: ["Wheat", "Dairy", "Eggs"],
    };

    addToCart(customCakeItem, 1, {
      flavor,
      size,
      cream,
      message,
    });

    setAddedToCartAlert(true);
    setTimeout(() => setAddedToCartAlert(false), 3000);

    // Reset customizations
    setMessage("");
  };

  return (
    <section id="cake-builder" className="py-24 px-6 md:px-12 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Headers */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 text-apron-caramel text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            <Cake className="w-4 h-4 text-apron-caramel animate-bounce" />
            Bespoke Celebration Studio
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-apron-charcoal mb-4">
            Design Your Custom Cake
          </h2>
          <p className="text-apron-charcoal/60 text-sm md:text-base max-w-xl mx-auto font-sans font-light">
            Sift, sculpt, and personalize. Choose gourmet flavors, delicate tiers, and watch our live 3D cake canvas paint your dream icing details in real-time.
          </p>
        </div>

        {/* Builder Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: HTML5 Canvas live preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic relative overflow-hidden">
            <div className="absolute top-4 left-4 py-1 px-3 rounded-full border border-apron-caramel/25 bg-apron-peach/60 text-[9px] uppercase tracking-wider font-bold text-apron-caramel">
              Live Rendering View
            </div>

            <canvas
              ref={canvasRef}
              className="max-w-full aspect-[40/42] w-[350px] pointer-events-none drop-shadow-lg"
            />
          </div>

          {/* Right panel: Custom Config panels */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Step 1: Select Flavor */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-3">
                1. Select Cake Sponge Flavor
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flavors.map((flv) => (
                  <button
                    key={flv.name}
                    onClick={() => setFlavor(flv.name)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      flavor === flv.name
                        ? "bg-apron-caramel border-apron-caramel text-white shadow-md shadow-apron-caramel/10"
                        : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/80"
                    }`}
                  >
                    <span className="block text-xs font-semibold uppercase tracking-wide">
                      {flv.name}
                    </span>
                    <span className={`block text-[10px] leading-snug mt-1 font-light ${flavor === flv.name ? "text-white/80" : "text-apron-charcoal/50"}`}>
                      {flv.desc}
                    </span>
                    {flv.price > 0 && (
                      <span className="block text-[10px] font-bold mt-2 text-right">
                        +{flv.price > 0 ? `₹${flv.price}` : ""}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Tier / Size */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-3">
                2. Choose Tiers & Size
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sizes.map((sz) => (
                  <button
                    key={sz.name}
                    onClick={() => setSize(sz.name)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[120px] ${
                      size === sz.name
                        ? "bg-apron-caramel border-apron-caramel text-white shadow-md shadow-apron-caramel/10"
                        : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/80"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wide">
                        {sz.name}
                      </span>
                      <span className={`block text-[9px] mt-1 font-light ${size === sz.name ? "text-white/85" : "text-apron-charcoal/50"}`}>
                        {sz.desc}
                      </span>
                    </div>
                    <span className="block text-xs font-bold mt-2">
                      ₹{sz.price} Base
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Pick Cream Type & Frosting color */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-3">
                3. Choose Frosting & Cream
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creams.map((crm) => (
                  <button
                    key={crm.name}
                    onClick={() => setCream(crm.name)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      cream === crm.name
                        ? "bg-apron-caramel border-apron-caramel text-white shadow-md"
                        : "bg-white border-white/80 text-apron-charcoal soft-neumorphic hover:bg-white/80"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-white/80 shrink-0 soft-neumorphic"
                      style={{ backgroundColor: crm.color }}
                    />
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide">
                        {crm.name}
                      </span>
                      <span className={`block text-[10px] font-light mt-0.5 ${cream === crm.name ? "text-white/85" : "text-apron-charcoal/50"}`}>
                        {crm.desc}
                      </span>
                      {crm.price > 0 && (
                        <span className="block text-[9px] font-bold mt-1">
                          +₹{crm.price} Cream surcharge
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Add Custom Message */}
            <div>
              <span className="block text-xs uppercase tracking-wider font-bold text-apron-caramel mb-3">
                4. Personal Golden Script Message
              </span>
              <div className="relative">
                <input
                  type="text"
                  maxLength={40}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Audrey (Max 40 chars)"
                  className="w-full py-4 px-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic text-sm font-sans focus:outline-none focus:border-apron-caramel/50 text-apron-charcoal placeholder-apron-charcoal/30"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-apron-caramel/70 bg-apron-peach/60 py-1 px-2.5 rounded-lg border border-white">
                  {message.length}/40
                </span>
              </div>
            </div>

            {/* Price and Cart Integration */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-apron-beige/45 gap-4">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-apron-caramel font-semibold">Total Customization Cost</span>
                <span className="font-serif text-3xl md:text-4xl font-bold text-apron-charcoal">
                  ₹{getSelectedPrice().toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={downloadCertificate}
                  className="w-full sm:w-auto py-4 px-6 rounded-full border border-apron-caramel text-apron-caramel font-medium text-xs tracking-wider uppercase hover:bg-apron-peach/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover-magnetic"
                >
                  <Sparkles className="w-4 h-4 text-apron-gold animate-pulse" />
                  Recipe Certificate
                </button>

                <button
                  onClick={handleCreateCustomCake}
                  className="w-full sm:w-auto btn-liquid py-4 px-8 rounded-full bg-apron-caramel text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 hover-magnetic cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add Custom Cake to Order
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating success cart alert */}
      <AnimatePresence>
        {addedToCartAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 py-3.5 px-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-3 glass-premium"
          >
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500">
              <Check className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-apron-charcoal">
                Masterpiece Booked!
              </span>
              <span className="block text-[10px] text-apron-caramel font-medium -mt-0.5">
                Your custom cake has been added to the order.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
