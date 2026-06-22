"use client";

import { useState } from "react";
import { Barcode, Plus, Minus, Trash2, Pause, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRIMARY_COLOR = "#20B757";

export default function NewTransactionPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tenderedAmount, setTenderedAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountType, setDiscountType] = useState<
    "percent" | "fixed" | "senior" | "pwd"
  >("percent");
  const [discountValue, setDiscountValue] = useState(10);

  // Sample Products
  const products: Product[] = [
    { id: 1, name: "Coca-Cola 1.5L", price: 95, sku: "CKE150" },
    { id: 2, name: "Potato Chips", price: 40, sku: "CHP001" },
    { id: 3, name: "Bread Loaf", price: 65, sku: "BRD001" },
    { id: 4, name: "Mineral Water 1L", price: 25, sku: "WTR001" },
  ];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.12;
  const grandTotal = subtotal + tax - discount;
  const change = tenderedAmount ? parseFloat(tenderedAmount) - grandTotal : 0;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.findIndex((item) => item.id === product.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyDiscount = () => {
    let calculatedDiscount = 0;
    if (
      discountType === "percent" ||
      discountType === "senior" ||
      discountType === "pwd"
    ) {
      const rate =
        discountType === "senior" || discountType === "pwd"
          ? 0.2
          : discountValue / 100;
      calculatedDiscount = subtotal * rate;
    } else {
      calculatedDiscount = discountValue;
    }
    setDiscount(Math.max(0, calculatedDiscount));
    setIsDiscountOpen(false);
  };

  const completeSale = () => {
    if (cart.length === 0) return alert("Cart is empty");
    alert(
      `✅ Transaction completed successfully!\nTotal: ₱${grandTotal.toFixed(2)}`,
    );
    setCart([]);
    setDiscount(0);
    setTenderedAmount("");
    setCustomerName("");
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Products */}
        <div className="w-96 border-r border-zinc-200 bg-white flex flex-col">
          <div className="p-6 border-b border-zinc-200">
            <div className="flex justify-between items-start">
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: PRIMARY_COLOR }}
                >
                  POS
                </h1>
                <p className="text-emerald-600 font-medium">New Transaction</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-zinc-600">
                  TX-20250622-4782
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date().toLocaleString("en-PH")}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-zinc-500 mb-1">Cashier</p>
                <div className="bg-zinc-100 px-4 py-3 rounded-2xl flex items-center gap-3">
                  <User className="text-emerald-600" size={20} />
                  <span className="font-medium">Alex Rivera</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Terminal</p>
                <div className="bg-zinc-100 px-4 py-3 rounded-2xl font-mono">
                  POS-01
                </div>
              </div>
            </div>
          </div>

          {/* Scanner */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center gap-4 bg-zinc-100 border border-dashed border-emerald-600 rounded-2xl p-4 hover:border-emerald-500 transition-colors">
              <Barcode className="text-emerald-600" size={32} />
              <Input
                placeholder="Scan barcode or type SKU..."
                className="bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-emerald-500 text-lg font-mono placeholder:text-zinc-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    const found = products.find(
                      (p) =>
                        p.sku.toLowerCase() ===
                        e.currentTarget.value.toLowerCase(),
                    );
                    if (found) addToCart(found);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Products */}
          <div className="flex-1 p-6 overflow-auto">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Quick Add
            </p>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border-zinc-200 hover:border-emerald-500"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-emerald-600 text-xl font-semibold mt-2">
                      ₱{product.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className="p-6 border-t border-zinc-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const name = prompt("Enter customer name:");
                if (name) setCustomerName(name);
              }}
            >
              <User size={18} className="mr-2" />
              {customerName || "Add Customer"}
            </Button>
          </div>
        </div>

        {/* Main Cart Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                Current Cart
                {cart.length > 0 && (
                  <Badge variant="secondary">{cart.length} items</Badge>
                )}
              </h2>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setCart([])}>
                <Trash2 size={18} className="mr-2" /> Clear
              </Button>
              <Button variant="ghost">
                <Pause size={18} className="mr-2" /> Hold
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-8 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <div className="text-6xl mb-6">🛒</div>
                <p className="text-xl text-zinc-600">Cart is empty</p>
                <p className="text-sm mt-2">
                  Add products to begin transaction
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-zinc-200 rounded-3xl p-6"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.sku}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={18} />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={18} />
                      </Button>
                    </div>

                    <p className="font-semibold text-lg w-28 text-right">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div className="bg-white border-t border-zinc-200 p-8">
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">VAT (12%)</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Discount</span>
                  <span>-₱{discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-3xl font-bold pt-2">
                <span>Total</span>
                <span style={{ color: PRIMARY_COLOR }}>
                  ₱{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Payment */}
        <div className="w-96 border-l border-zinc-200 bg-white flex flex-col">
          <div className="p-6">
            <Button
              onClick={() => setIsDiscountOpen(true)}
              className="w-full py-6 text-lg"
              variant="outline"
            >
              <Tag className="mr-3" /> Apply Discount
            </Button>
          </div>

          <div className="flex-1 p-6">
            <p className="text-sm text-zinc-500 mb-4">Payment Method</p>

            <div className="grid grid-cols-2 gap-4">
              {["Cash", "GCash", "Card", "Maya"].map((method) => (
                <Button
                  key={method}
                  variant="outline"
                  className="h-20 text-base hover:border-emerald-500 hover:text-emerald-600"
                >
                  {method}
                </Button>
              ))}
            </div>

            <div className="mt-10">
              <Label>Amount Tendered</Label>
              <div className="mt-2 flex">
                <div className="bg-zinc-100 px-6 flex items-center text-2xl font-medium rounded-l-2xl border border-r-0 border-zinc-200">
                  ₱
                </div>
                <Input
                  type="number"
                  value={tenderedAmount}
                  onChange={(e) => setTenderedAmount(e.target.value)}
                  className="text-4xl font-semibold h-20 rounded-l-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-8 bg-zinc-100 rounded-3xl p-8">
              <div className="text-sm text-zinc-500">Change</div>
              <div
                className="text-5xl font-bold mt-2"
                style={{ color: change >= 0 ? PRIMARY_COLOR : "#ef4444" }}
              >
                ₱{Math.max(0, change).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-6 mt-auto border-t border-zinc-200">
            <Button
              onClick={completeSale}
              size="lg"
              className="w-full h-20 text-xl font-semibold"
              style={{ backgroundColor: PRIMARY_COLOR, color: "white" }}
            >
              COMPLETE SALE
            </Button>
          </div>
        </div>
      </div>

      {/* Discount Dialog */}
      <Dialog open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(v: any) => setDiscountType(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="senior">Senior Citizen (20%)</SelectItem>
                  <SelectItem value="pwd">PWD (20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="text-4xl h-16"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyDiscount}>Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
