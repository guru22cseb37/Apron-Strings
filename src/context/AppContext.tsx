"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface MenuItem {
  id: string;
  name: string;
  category: "Cakes" | "Pastries" | "Cupcakes" | "Cookies" | "Brownies" | "Dessert Boxes";
  price: number;
  rating: number;
  image: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  customization?: {
    flavor?: string;
    size?: string;
    cream?: string;
    message?: string;
    customImage?: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "Pending" | "Baking" | "Out for Delivery" | "Delivered";
  createdAt: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

interface AppContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  couponApplied: boolean;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  ambientAudio: boolean;
  setAmbientAudio: (val: boolean) => void;
  aromaVisual: boolean;
  setAromaVisual: (val: boolean) => void;
  aromaProfile: "Vanilla" | "Caramel" | "Chocolate";
  setAromaProfile: (val: "Vanilla" | "Caramel" | "Chocolate") => void;
  audioTrack: "Bells" | "Waltz" | "Lofi" | "None";
  setAudioTrack: (val: "Bells" | "Waltz" | "Lofi" | "None") => void;
  addToCart: (product: MenuItem, quantity?: number, customization?: CartItem["customization"]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (name: string, email: string, address: string, deliveryDate?: string, deliveryTime?: string) => Order;
  addProduct: (product: Omit<MenuItem, "id" | "rating">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  deleteProduct: (productId: string) => void;
  updateProductPrice: (productId: string, price: number) => void;
  isAdminAuthed: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const defaultMenu: MenuItem[] = [
  {
    id: "1",
    name: "Signature Floral Tiered Cake",
    category: "Cakes",
    price: 125.0,
    rating: 4.9,
    image: "/images/hero-cake.png",
    description: "An elegant, multi-layered celebration masterpiece frosted with soft vanilla buttercream, embellished with organic edible gold flakes and delicate handcrafted pastel blossoms.",
    ingredients: ["Organic wheat flour", "Swiss vanilla bean extract", "French cultured butter", "Organic cane sugar", "Edible gold flakes"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    isFeatured: true,
  },
  {
    id: "2",
    name: "Raspberry Chocolate Truffle",
    category: "Pastries",
    price: 8.5,
    rating: 4.8,
    image: "/images/menu-chocolate-cake.png",
    description: "Decadent Valrhona dark chocolate mousse layered with fresh organic raspberry coulis and crispy hazelnut praline, glazed to mirror perfection.",
    ingredients: ["Valrhona cocoa 70%", "Organic fresh raspberries", "Roasted Piedmont hazelnuts", "Grass-fed dairy cream"],
    allergens: ["Dairy", "Tree Nuts"],
    isFeatured: true,
  },
  {
    id: "3",
    name: "French Strawberry Glacé Tart",
    category: "Pastries",
    price: 7.9,
    rating: 4.9,
    image: "/images/menu-strawberry-pastry.png",
    description: "Crisp almond sweetcrust pastry filled with velvety Madagascar vanilla bean crème pâtissière, piled high with fresh, juicy strawberries and light glaze.",
    ingredients: ["Almond flour", "Madagascar bourbon vanilla bean", "Fresh glazed strawberries", "Organic butter"],
    allergens: ["Wheat", "Dairy", "Eggs", "Almonds"],
    isFeatured: true,
  },
  {
    id: "4",
    name: "Swirled Red Velvet Gold Cupcake",
    category: "Cupcakes",
    price: 4.5,
    rating: 4.7,
    image: "/images/menu-red-cupcake.png",
    description: "Fluffy, light cocoa-infused red velvet cake topped with a generous swirl of rich cream cheese frosting and a pinch of shimmering gold dust.",
    ingredients: ["Dutch cocoa powder", "Cultured buttermilk", "Madagascar vanilla extract", "Cream cheese", "Edible gold dust"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    isFeatured: false,
  },
  {
    id: "5",
    name: "Gooey Sea-Salt Triple Cookie",
    category: "Cookies",
    price: 3.8,
    rating: 4.9,
    image: "/images/menu-sea-cookie.png",
    description: "Crisp golden outer shell with a molten gooey center packed with milk, dark, and white Belgian chocolate chunks, topped with hand-harvested Maldon sea salt flakes.",
    ingredients: ["Belgian dark, milk, & white chocolate", "Maldon sea salt flakes", "Brown sugar", "Cultured butter"],
    allergens: ["Wheat", "Dairy", "Eggs", "Soy"],
    isFeatured: true,
  },
  {
    id: "6",
    name: "Warm Caramel Fudge Brownie",
    category: "Brownies",
    price: 5.5,
    rating: 4.8,
    image: "/images/menu-fudge-brownie.png",
    description: "Intensely fudgy double chocolate brownie swirled with rich homemade salted caramel cream and baked to chewy perfection.",
    ingredients: ["Callebaut dark chocolate", "Homemade salted butter caramel", "Farm-fresh eggs", "Vanilla bean paste"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    isFeatured: false,
  },
  {
    id: "7",
    name: "Artisan Grand Celebration Hamper",
    category: "Dessert Boxes",
    price: 95.0,
    rating: 5.0,
    image: "/images/menu-gift-hamper.png",
    description: "A luxury curation of our finest hand-made treats: including artisan pastel macarons, white chocolate truffles, organic cookies, and gourmet chocolate spreads.",
    ingredients: ["Almond meal", "Fine sugar", "French butter", "Assorted premium chocolate fillings", "Assorted berries"],
    allergens: ["Wheat", "Dairy", "Eggs", "Almonds", "Soy"],
    isFeatured: true,
  },
];

const defaultOrders: Order[] = [
  {
    id: "ORD-8942",
    customerName: "Audrey Hepburn",
    customerEmail: "audrey@elegance.com",
    address: "7 Fifth Avenue, New York, NY",
    items: [
      {
        id: "ord-item-1",
        product: defaultMenu[0],
        quantity: 1,
        customization: {
          flavor: "Swiss Vanilla & Rose",
          size: "8\" Classic",
          cream: "Swiss Meringue Buttercream",
          message: "Happy Birthday Audrey",
        },
      },
    ],
    subtotal: 125.0,
    discount: 12.5,
    total: 112.5,
    status: "Baking",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
  },
  {
    id: "ORD-3051",
    customerName: "Christian Dior",
    customerEmail: "dior@fashion.com",
    address: "30 Avenue Montaigne, Paris",
    items: [
      {
        id: "ord-item-2",
        product: defaultMenu[1],
        quantity: 4,
      },
      {
        id: "ord-item-3",
        product: defaultMenu[2],
        quantity: 2,
      },
    ],
    subtotal: 49.8,
    discount: 0,
    total: 49.8,
    status: "Pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12m ago
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenu);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [aromaVisual, setAromaVisual] = useState(true);
  const [aromaProfile, setAromaProfile] = useState<"Vanilla" | "Caramel" | "Chocolate">("Vanilla");
  const [audioTrack, setAudioTrack] = useState<"Bells" | "Waltz" | "Lofi" | "None">("None");
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  // Load auth state from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("apron_strings_admin_authed");
      if (saved === "true") {
        setIsAdminAuthed(true);
      }
    }
  }, []);

  const loginAdmin = (password: string): boolean => {
    // Elegant client passcode verification
    if (password === "apronadmin2026") {
      setIsAdminAuthed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("apron_strings_admin_authed", "true");
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthed(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("apron_strings_admin_authed");
    }
  };

  // Synchronize ambientAudio state with the selected track
  useEffect(() => {
    if (audioTrack === "None") {
      setAmbientAudio(false);
    } else {
      setAmbientAudio(true);
    }
  }, [audioTrack]);

  // Backward compatible wrapper
  const handleSetAmbientAudio = (val: boolean) => {
    setAmbientAudio(val);
    if (!val) {
      setAudioTrack("None");
    } else if (audioTrack === "None") {
      setAudioTrack("Bells");
    }
  };

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("apron_strings_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart", e);
      }
    }
  }, []);

  // Sync cart to LocalStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("apron_strings_cart", JSON.stringify(newCart));
  };

  const applyCoupon = (code: string): boolean => {
    if (code.trim().toUpperCase() === "SWEETAPRON10") {
      setCouponApplied(true);
      setCouponCode("SWEETAPRON10");
      return true;
    }
    return false;
  };

  const addToCart = (product: MenuItem, quantity = 1, customization?: CartItem["customization"]) => {
    const cartItemId = customization 
      ? `${product.id}-${JSON.stringify(customization)}`
      : product.id;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { id: cartItemId, product, quantity, customization }]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    saveCart(cart.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      saveCart(
        cart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    saveCart([]);
    setCouponApplied(false);
    setCouponCode("");
  };

  const createOrder = (name: string, email: string, address: string, deliveryDate?: string, deliveryTime?: string): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = couponApplied ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: email,
      address: address,
      items: [...cart],
      subtotal,
      discount,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
      deliveryDate,
      deliveryTime,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    clearCart();
    return newOrder;
  };

  const addProduct = (product: Omit<MenuItem, "id" | "rating">) => {
    const nextId = menuItems.length > 0 
      ? (Math.max(...menuItems.map(m => parseInt(m.id) || 0)) + 1).toString()
      : "1";
    const newProduct: MenuItem = {
      ...product,
      id: nextId,
      rating: 4.8 + Math.random() * 0.2, // Generates 4.8 to 5.0
    };
    setMenuItems([...menuItems, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== productId));
  };

  const updateProductPrice = (productId: string, price: number) => {
    setMenuItems(prevItems =>
      prevItems.map((item) => (item.id === productId ? { ...item, price } : item))
    );
    setCart(prevCart =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, price } }
          : item
      )
    );
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        couponApplied,
        couponCode,
        applyCoupon,
        ambientAudio,
        setAmbientAudio: handleSetAmbientAudio,
        aromaVisual,
        setAromaVisual,
        aromaProfile,
        setAromaProfile,
        audioTrack,
        setAudioTrack,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        addProduct,
        updateOrderStatus,
        deleteProduct,
        updateProductPrice,
        isAdminAuthed,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
