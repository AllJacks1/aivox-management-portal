"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/styles/colors";
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Clock,
  ScanLine,
  X,
  ArrowRight,
  Percent,
  Tag,
  Package,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  discount: number; // flat amount discount
}

interface HeldSale {
  id: string;
  items: CartItem[];
  createdAt: string;
  total: number;
}

type PaymentMethod = "cash" | "gcash" | "card" | "bank_transfer";

// ─── Mock Data ─────────────────────────────────────────────────────

const CATEGORIES = ["All", "Beverages", "Tires", "Auto Parts", "Snacks", "Oil"];

const PRODUCTS: Product[] = [
  {
    id: "P001",
    sku: "CC-500",
    name: "Coca-Cola 500ml",
    category: "Beverages",
    price: 45.0,
    stock: 120,
    barcode: "480001",
  },
  {
    id: "P002",
    sku: "SPR-330",
    name: "Sprite 330ml",
    category: "Beverages",
    price: 35.0,
    stock: 85,
    barcode: "480002",
  },
  {
    id: "P003",
    sku: "MPS4-17",
    name: "Michelin Pilot Sport 4",
    category: "Tires",
    price: 8500.0,
    stock: 12,
    barcode: "352870",
  },
  {
    id: "P004",
    sku: "PPZ-18",
    name: "Pirelli P Zero",
    category: "Tires",
    price: 9200.0,
    stock: 8,
    barcode: "801922",
  },
  {
    id: "P005",
    sku: "BOSCH-WP",
    name: 'Bosch Wiper Blade 18"',
    category: "Auto Parts",
    price: 450.0,
    stock: 30,
    barcode: "316514",
  },
  {
    id: "P006",
    sku: "CHIPS-BBQ",
    name: "Lays BBQ Chips",
    category: "Snacks",
    price: 55.0,
    stock: 60,
    barcode: "284001",
  },
  {
    id: "P007",
    sku: "CASTROL-5W30",
    name: "Castrol GTX 5W-30 4L",
    category: "Oil",
    price: 1850.0,
    stock: 20,
    barcode: "590103",
  },
  {
    id: "P008",
    sku: "MOBIL-10W40",
    name: "Mobil 1 10W-40 4L",
    category: "Oil",
    price: 2100.0,
    stock: 15,
    barcode: "194001",
  },
  {
    id: "P009",
    sku: "FANTA-500",
    name: "Fanta Orange 500ml",
    category: "Beverages",
    price: 42.0,
    stock: 90,
    barcode: "480003",
  },
  {
    id: "P010",
    sku: "BRIDGEST-16",
    name: 'Bridgestone Potenza 16"',
    category: "Tires",
    price: 6200.0,
    stock: 6,
    barcode: "328634",
  },
];

const TAX_RATE = 0.12; // 12% VAT

// ─── Helpers ───────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const generateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}`;

// ─── Component ───────────────────────────────────────────────────────

export default function NewSalePage() {
  // ── State ────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showHeldSales, setShowHeldSales] = useState(false);
  const [cartDiscount, setCartDiscount] = useState(0); // global cart discount

  const barcodeRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Derived Values ───────────────────────────────────────────────
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemDiscounts = cart.reduce((sum, item) => sum + item.discount, 0);
  const totalDiscount = itemDiscounts + cartDiscount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const tax = taxableAmount * TAX_RATE;
  const grandTotal = taxableAmount + tax;
  const change = Math.max(0, parseFloat(cashReceived || "0") - grandTotal);

  // ── Filtered Products ──────────────────────────────────────────
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode?.includes(q);
    return matchesCategory && matchesSearch;
  });

  // ── Cart Actions ────────────────────────────────────────────────
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          discount: 0,
        },
      ];
    });
  }, []);

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, qty: Math.max(1, i.qty + delta) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const setItemDiscount = (productId: string, discount: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, discount: Math.max(0, discount) }
          : i,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setCashReceived("");
    setCartDiscount(0);
    setShowCheckout(false);
  };

  // ── Barcode Scan ────────────────────────────────────────────────
  const handleBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    const product = PRODUCTS.find((p) => p.barcode === code);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
      barcodeRef.current?.focus();
    } else {
      alert("Product not found for barcode: " + code);
      setBarcodeInput("");
    }
  };

  // ── Hold / Resume Sale ──────────────────────────────────────────
  const holdSale = () => {
    if (cart.length === 0) return;
    const held: HeldSale = {
      id: generateId("HLD"),
      items: [...cart],
      createdAt: new Date().toISOString(),
      total: grandTotal,
    };
    setHeldSales((prev) => [held, ...prev]);
    clearCart();
    setShowHeldSales(false);
  };

  const resumeSale = (sale: HeldSale) => {
    setCart(sale.items);
    setHeldSales((prev) => prev.filter((s) => s.id !== sale.id));
    setShowHeldSales(false);
  };

  const deleteHeldSale = (id: string) => {
    setHeldSales((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Checkout ────────────────────────────────────────────────────
  const confirmSale = () => {
    if (cart.length === 0) return;
    if (
      paymentMethod === "cash" &&
      parseFloat(cashReceived || "0") < grandTotal
    ) {
      alert("Insufficient cash received.");
      return;
    }
    // TODO: send to API, print receipt, etc.
    alert(
      `Sale completed!\nTotal: ${formatCurrency(grandTotal)}\nPayment: ${paymentMethod.toUpperCase()}`,
    );
    clearCart();
  };

  // ── Keyboard Shortcuts ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      switch (e.key) {
        case "F1":
          e.preventDefault();
          searchRef.current?.focus();
          break;
        case "F2":
          e.preventDefault();
          if (cart.length > 0) setShowCheckout(true);
          break;
        case "F3":
          e.preventDefault();
          if (cart.length > 0) holdSale();
          break;
        case "Escape":
          setShowCheckout(false);
          setShowHeldSales(false);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cart.length]);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDE — Products (scrollable)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            Products
          </h2>
          <Badge
            variant="outline"
            className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
          >
            {filteredProducts.length}
          </Badge>
        </div>

        {/* Search + Barcode */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={searchRef}
              placeholder="Search products (F1)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <form onSubmit={handleBarcode} className="relative sm:w-56">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={barcodeRef}
              placeholder="Scan barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="pl-9 h-10"
            />
          </form>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "bg-[#2A3A9D] text-white hover:bg-[#252f7a]"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="pr-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-12 h-12 mb-2 opacity-30" />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="text-left p-3 rounded-xl border border-gray-100 bg-white hover:border-[#2A3A9D]/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-gray-100 text-gray-600"
                    >
                      {product.sku}
                    </Badge>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        product.stock <= 10
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-[#2A3A9D]">
                    {product.name}
                  </p>
                  <p
                    className="text-base font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatCurrency(product.price)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE — Sticky Cart
         ═══════════════════════════════════════════════════════════════ */}
      <div className="lg:w-[420px] lg:self-start lg:sticky lg:top-4 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[calc(100vh-2rem)]">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart
              className="w-5 h-5"
              style={{ color: COLORS.primary }}
            />
            <h3 className="font-semibold text-gray-900">Current Sale</h3>
            <Badge variant="outline" className="text-xs">
              {cart.reduce((s, i) => s + i.qty, 0)} items
            </Badge>
          </div>
          <div className="flex gap-1">
            {cart.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={holdSale}
                  className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Hold (F3)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              </>
            )}
            {heldSales.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHeldSales(true)}
                className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Clock className="w-3.5 h-3.5 mr-1" />
                Held ({heldSales.length})
              </Button>
            )}
          </div>
        </div>

        {/* Cart Items — scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-300">
              <ShoppingCart className="w-16 h-16 mb-3 opacity-20" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click a product or scan a barcode</p>
            </div>
          ) : (
            cart.map((item) => (
              <Card
                key={item.productId}
                className="p-3 border-gray-100 bg-gray-50/50 hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Qty Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQty(item.productId, -1)}
                      className="h-7 w-7 p-0 border-gray-200"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.qty}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQty(item.productId, 1)}
                      className="h-7 w-7 p-0 border-gray-200"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Discount + Subtotal */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Disc"
                        value={item.discount || ""}
                        onChange={(e) =>
                          setItemDiscount(
                            item.productId,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="h-6 w-20 text-xs text-right px-1 py-0 border-gray-200"
                      />
                    </div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {formatCurrency(item.price * item.qty - item.discount)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Totals Section — fixed at bottom */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-2 shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-red-500 flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Discounts
              </span>
              <span className="font-medium text-red-500">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Tax ({(TAX_RATE * 100).toFixed(0)}%)
            </span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>

          {/* Global Cart Discount */}
          <div className="flex items-center gap-2 pt-1">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">Cart discount:</span>
            <Input
              type="number"
              placeholder="0.00"
              value={cartDiscount || ""}
              onChange={(e) => setCartDiscount(parseFloat(e.target.value) || 0)}
              className="h-7 w-28 text-xs border-gray-200"
            />
          </div>

          <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">
              Grand Total
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: COLORS.primary }}
            >
              {formatCurrency(grandTotal)}
            </span>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(
              [
                { key: "cash", icon: Banknote, label: "Cash" },
                { key: "gcash", icon: Smartphone, label: "GCash" },
                { key: "card", icon: CreditCard, label: "Card" },
                { key: "bank_transfer", icon: Landmark, label: "Bank" },
              ] as const
            ).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setPaymentMethod(key)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                  paymentMethod === key
                    ? "border-[#2A3A9D] bg-[#2A3A9D]/5 text-[#2A3A9D]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Cash Input (only for cash payment) */}
          {paymentMethod === "cash" && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Cash:
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="h-9 border-gray-200"
              />
              {change > 0 && (
                <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                  Change: {formatCurrency(change)}
                </span>
              )}
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className="w-full h-12 text-base font-semibold bg-[#2A3A9D] hover:bg-[#252f7a] text-white disabled:opacity-50"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Checkout (F2) — {formatCurrency(grandTotal)}
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Checkout Confirmation
         ═══════════════════════════════════════════════════════════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Sale</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="font-medium">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Discounts</span>
                  <span>-{formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span style={{ color: COLORS.primary }}>
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cash Received</span>
                    <span>
                      {formatCurrency(parseFloat(cashReceived || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600">
                    <span>Change</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium capitalize">
                  {paymentMethod.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSale}
                className="flex-1 h-11 bg-[#2A3A9D] hover:bg-[#252f7a] text-white font-semibold"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Confirm & Print
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Held Sales
         ═══════════════════════════════════════════════════════════════ */}
      {showHeldSales && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg p-6 bg-white max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Held Sales</h3>
              <button
                onClick={() => setShowHeldSales(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {heldSales.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No held sales.</p>
              ) : (
                heldSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sale.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sale.items.length} items ·{" "}
                        {new Date(sale.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(sale.total)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => resumeSale(sale)}
                        className="h-8 bg-[#2A3A9D] text-white hover:bg-[#252f7a]"
                      >
                        Resume
                      </Button>
                      <button
                        onClick={() => deleteHeldSale(sale.id)}
                        className="text-gray-300 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
