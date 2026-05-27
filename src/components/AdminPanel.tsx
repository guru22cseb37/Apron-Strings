"use client";

import { useState } from "react";
import { useApp, MenuItem, Order } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, BarChart3, Package, ClipboardList, Plus, Trash2, ArrowUpRight, TrendingUp, Sparkles, Check } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { menuItems, orders, addProduct, deleteProduct, updateOrderStatus, updateProductPrice } = useApp();
  const [tab, setTab] = useState<"analytics" | "products" | "orders">("analytics");
  const [addedItemSuccess, setAddedItemSuccess] = useState(false);

  // New product form states
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<MenuItem["category"]>("Cakes");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductImg, setNewProductImg] = useState("/images/menu-chocolate-cake.png"); // fallback

  const revenue = orders.reduce((acc, o) => acc + o.total, 0) + 4200; // include baseline
  const activeOrdersCount = orders.filter((o) => o.status !== "Delivered").length;
  const inventoryAlertsCount = 2; // custom alert

  // Simulated chart data
  const chartSales = [
    { day: "Mon", sales: 480, height: "45%" },
    { day: "Tue", sales: 590, height: "55%" },
    { day: "Wed", sales: 820, height: "78%" },
    { day: "Thu", sales: 710, height: "68%" },
    { day: "Fri", sales: 950, height: "92%" },
    { day: "Sat", sales: 1100, height: "100%" },
  ];

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductDesc) return;

    addProduct({
      name: newProductName,
      category: newProductCategory,
      price: parseFloat(newProductPrice),
      image: newProductImg,
      description: newProductDesc,
      ingredients: ["Organic fine flour", "Swiss vanilla", "Natural cane sugars"],
      allergens: ["Wheat", "Dairy"],
    });

    // Reset Form
    setNewProductName("");
    setNewProductPrice("");
    setNewProductDesc("");
    
    setAddedItemSuccess(true);
    setTimeout(() => setAddedItemSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-apron-charcoal/45 backdrop-blur-sm"
      />

      {/* Admin Window Frame */}
      <div className="relative w-full max-w-5xl bg-apron-cream/95 backdrop-blur-md rounded-3xl overflow-hidden border border-white shadow-2xl z-10 max-h-[92vh] flex flex-col h-[650px] text-left">
        
        {/* Header bar */}
        <div className="p-6 border-b border-apron-beige/35 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-apron-peach flex items-center justify-center border border-white text-apron-caramel soft-neumorphic shadow-3xs">
              <ChefHat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-apron-charcoal">Strings Command Center</h2>
              <span className="block text-[9px] uppercase tracking-wider text-apron-caramel font-semibold">Apron Strings Bakery Admin</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/60 bg-white/40 soft-neumorphic hover:text-apron-caramel cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Body Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT: Sidebar Navigation tabs */}
          <div className="w-48 bg-white/20 border-r border-apron-beige/25 p-4 flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setTab("analytics")}
              className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 cursor-pointer transition-all ${
                tab === "analytics"
                  ? "bg-apron-caramel text-white shadow-xs"
                  : "text-apron-charcoal/60 hover:bg-white/40 hover:text-apron-caramel"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>

            <button
              onClick={() => setTab("products")}
              className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 cursor-pointer transition-all ${
                tab === "products"
                  ? "bg-apron-caramel text-white shadow-xs"
                  : "text-apron-charcoal/60 hover:bg-white/40 hover:text-apron-caramel"
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>

            <button
              onClick={() => setTab("orders")}
              className={`p-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 cursor-pointer transition-all ${
                tab === "orders"
                  ? "bg-apron-caramel text-white shadow-xs"
                  : "text-apron-charcoal/60 hover:bg-white/40 hover:text-apron-caramel"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Orders
              {activeOrdersCount > 0 && (
                <span className="ml-auto w-4.5 h-4.5 rounded-full bg-apron-pink border border-white text-apron-caramel font-bold text-[9px] flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </div>

          {/* RIGHT: Content Viewboards */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white/10">
            
            {/* VIEW 1: ANALYTICS & REVENUE CHARTS */}
            {tab === "analytics" && (
              <div className="space-y-6">
                
                {/* Metric cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-white bg-white/45 soft-neumorphic text-left">
                    <span className="text-[9px] uppercase tracking-wider text-apron-caramel font-bold block mb-1">Gross Revenue</span>
                    <h3 className="font-serif text-2xl font-bold text-apron-charcoal flex items-center gap-1.5">
                      ₹{revenue.toFixed(2)}
                      <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-sans font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +12%
                      </span>
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl border border-white bg-white/45 soft-neumorphic text-left">
                    <span className="text-[9px] uppercase tracking-wider text-apron-caramel font-bold block mb-1">Active Baking Orders</span>
                    <h3 className="font-serif text-2xl font-bold text-apron-charcoal">
                      {activeOrdersCount} slips
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl border border-white bg-white/45 soft-neumorphic text-left">
                    <span className="text-[9px] uppercase tracking-wider text-red-500 font-bold block mb-1">Inventory Warnings</span>
                    <h3 className="font-serif text-2xl font-bold text-red-600">
                      {inventoryAlertsCount} alerts
                    </h3>
                  </div>
                </div>

                {/* Sales dynamic chart */}
                <div className="p-6 rounded-3xl border border-white bg-white/45 soft-neumorphic text-left">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-apron-charcoal">Weekly Sales Overview</h4>
                      <span className="text-[9px] text-apron-caramel font-semibold">Simulated real-time tracking</span>
                    </div>
                    <span className="text-xs text-apron-caramel font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> High Performance Season
                    </span>
                  </div>

                  {/* HTML/CSS Bar tracks */}
                  <div className="flex items-end justify-between h-44 border-b border-apron-beige/40 pb-2 mb-2">
                    {chartSales.map((c) => (
                      <div key={c.day} className="flex flex-col items-center flex-1">
                        <div className="w-8 sm:w-12 bg-gradient-to-t from-apron-peach via-apron-caramel to-apron-caramel/90 rounded-t-xl relative group shadow-sm" style={{ height: c.height }}>
                          {/* Hover tooltip digits */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 py-1 px-2 rounded bg-apron-charcoal text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            ₹{c.sales}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-apron-charcoal/50 mt-2">{c.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 2: PRODUCT CATALOG EDITOR */}
            {tab === "products" && (
              <div className="space-y-8">
                
                {/* Form to add products */}
                <form onSubmit={handleCreateProduct} className="p-6 rounded-3xl border border-white bg-white/45 soft-neumorphic text-left space-y-4">
                  <h4 className="font-serif text-lg font-bold text-apron-charcoal pb-2 border-b border-apron-beige/25">Add New Dessert Item</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-apron-caramel">Product Name</label>
                      <input
                        type="text"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="e.g. Roasted Matcha Praline Cupcake"
                        className="w-full p-3 rounded-xl border border-white/60 bg-white/50 text-xs focus:outline-none focus:border-apron-caramel/40 text-apron-charcoal"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-apron-caramel">Category</label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as MenuItem["category"])}
                        className="w-full p-3 rounded-xl border border-white/60 bg-white/50 text-xs focus:outline-none focus:border-apron-caramel/40 text-apron-charcoal cursor-pointer"
                      >
                        <option value="Cakes">Cakes</option>
                        <option value="Pastries">Pastries</option>
                        <option value="Cupcakes">Cupcakes</option>
                        <option value="Cookies">Cookies</option>
                        <option value="Brownies">Brownies</option>
                        <option value="Dessert Boxes">Dessert Boxes</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-apron-caramel">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        placeholder="450.00"
                        className="w-full p-3 rounded-xl border border-white/60 bg-white/50 text-xs focus:outline-none focus:border-apron-caramel/40 text-apron-charcoal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-apron-caramel">Item Description</label>
                    <textarea
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      placeholder="Enter detailed gourmet dessert text..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-white/60 bg-white/50 text-xs focus:outline-none focus:border-apron-caramel/40 text-apron-charcoal"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-apron-charcoal/50">Simulated Upload Preset:</span>
                      <select
                        value={newProductImg}
                        onChange={(e) => setNewProductImg(e.target.value)}
                        className="p-1.5 rounded-lg border border-white bg-white text-[10px] font-sans text-apron-caramel font-semibold cursor-pointer"
                      >
                        <option value="/images/menu-chocolate-cake.png">Decadent Chocolate Cake</option>
                        <option value="/images/menu-strawberry-pastry.png">Strawberry Pastry</option>
                        <option value="/images/menu-red-cupcake.png">Red Velvet Cupcake</option>
                        <option value="/images/menu-sea-cookie.png">Gooey Sea Cookie</option>
                        <option value="/images/menu-fudge-brownie.png">Warm Brownie</option>
                        <option value="/images/menu-gift-hamper.png">Celebration Hamper</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-apron-caramel text-white text-xs font-semibold uppercase tracking-wider shadow-xs hover-magnetic cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Product to Menu
                    </button>
                  </div>
                </form>

                {/* Catalog Listing */}
                <div className="space-y-3">
                  <h5 className="font-serif text-base font-bold text-apron-charcoal">Current Menu Listings ({menuItems.length})</h5>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-white/60 bg-white/30 backdrop-blur-3xs text-xs font-sans text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-3xs shrink-0 bg-apron-cream">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="block font-serif font-bold text-apron-charcoal leading-snug">{item.name}</span>
                            <span className="block text-[9px] text-apron-caramel font-semibold uppercase tracking-wider">{item.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white/40 border border-white/60 rounded-xl px-2.5 py-1.5 soft-neumorphic w-24 shrink-0 focus-within:border-apron-caramel/40 transition-colors">
                            <span className="text-[10px] font-sans font-bold text-apron-caramel mr-1 select-none">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateProductPrice(item.id, isNaN(val) ? 0 : val);
                              }}
                              className="w-full bg-transparent font-serif font-bold text-apron-charcoal text-xs focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          
                          <button
                            onClick={() => deleteProduct(item.id)}
                            className="p-1.5 rounded-full hover:bg-red-50 text-apron-charcoal/30 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 3: ACTIVE CUSTOMER ORDERS DISPATCH PANEL */}
            {tab === "orders" && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-apron-charcoal mb-4">Active Orders Management Desk</h4>
                
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-apron-charcoal/50 font-sans font-light">
                      No customer orders placed yet.
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md soft-neumorphic space-y-4 text-left"
                      >
                        {/* Header details */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-apron-beige/35 pb-2.5">
                          <div>
                            <span className="font-serif font-bold text-sm text-apron-charcoal">{ord.id}</span>
                            <span className="block text-[9px] text-apron-charcoal/50 font-sans mt-0.5">
                              Placed: {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Status pill toggler */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-apron-caramel/60 font-bold uppercase tracking-wider">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order["status"])}
                              className={`p-1.5 rounded-lg border text-[10px] font-sans font-bold cursor-pointer focus:outline-none ${
                                ord.status === "Pending"
                                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                  : ord.status === "Baking"
                                  ? "bg-orange-50 border-orange-200 text-orange-700 animate-pulse"
                                  : ord.status === "Out for Delivery"
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : "bg-green-50 border-green-200 text-green-700"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Baking">Baking</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer block info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-apron-charcoal/65 font-sans leading-relaxed">
                          <div>
                            <span className="block font-bold uppercase text-apron-caramel/80">Customer</span>
                            <span className="font-semibold text-apron-charcoal">{ord.customerName}</span>
                          </div>
                          <div>
                            <span className="block font-bold uppercase text-apron-caramel/80">Contact Email</span>
                            <span className="font-semibold text-apron-charcoal">{ord.customerEmail}</span>
                          </div>
                          <div>
                            <span className="block font-bold uppercase text-apron-caramel/80">Location Address</span>
                            <span className="font-semibold text-apron-charcoal line-clamp-1">{ord.address}</span>
                          </div>
                        </div>

                        {/* Items recap lists */}
                        <div className="p-3.5 rounded-xl border border-white bg-white/70 backdrop-blur-sm space-y-2">
                          <span className="block text-[8px] uppercase tracking-wider font-bold text-apron-caramel">Items Ordered:</span>
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] font-sans">
                              <div>
                                <span className="font-serif font-bold text-apron-charcoal">{it.product.name}</span>
                                <span className="text-apron-caramel font-semibold ml-2">x{it.quantity}</span>
                                
                                {it.customization && (
                                  <span className="block text-[8px] text-apron-caramel font-semibold mt-0.5 bg-apron-peach/45 p-1 rounded">
                                    Cream: {it.customization.cream} | Cursive lettering: "{it.customization.message || "None"}"
                                  </span>
                                )}
                              </div>
                              <span className="font-serif font-semibold text-apron-charcoal">
                                ₹{(it.product.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating success popup for added items */}
      <AnimatePresence>
        {addedItemSuccess && (
          <div className="fixed bottom-6 right-6 z-55 py-3.5 px-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-3 glass-premium">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 text-green-500">
              <Check className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-apron-charcoal">
                Item Created!
              </span>
              <span className="block text-[10px] text-apron-caramel font-medium -mt-0.5">
                Successfully published to the menu catalog.
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
