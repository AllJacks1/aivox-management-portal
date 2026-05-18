"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  FileText,
  Printer,
  Copy,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Barcode,
  Minus,
  X,
  Save,
  Send,
  RotateCcw,
  Eye,
  Edit3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  PurchaseOrder,
  POItem,
  POStatus,
  Product,
  Supplier,
  mockPurchaseOrders,
  mockProducts,
  mockSuppliers,
  formatPHP,
  formatDate,
  formatDateTime,
  getStatusColor,
  getPaymentStatusColor,
  generatePONumber,
} from "./types-and-mocks";

// ============================================================
// SUMMARY CARDS
// ============================================================
function POSummaryCards({ orders }: { orders: PurchaseOrder[] }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const draft = orders.filter((o) => o.status === "Draft").length;
    const ordered = orders.filter((o) => o.status === "Ordered").length;
    const partial = orders.filter(
      (o) => o.status === "Partially Delivered",
    ).length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const totalValue = orders.reduce(
      (sum, o) => sum + o.totalAmount + o.deliveryCost,
      0,
    );
    const unpaid = orders
      .filter((o) => o.paymentStatus !== "Paid" && o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.balanceDue, 0);
    return {
      total,
      draft,
      ordered,
      partial,
      completed,
      cancelled,
      totalValue,
      unpaid,
    };
  }, [orders]);

  const cards = [
    {
      label: "Total POs",
      value: stats.total,
      icon: FileText,
      color: "text-[#2A3A9D]",
      bg: "bg-[#2A3A9D]/5",
    },
    {
      label: "Ordered",
      value: stats.ordered,
      icon: Truck,
      color: "text-[#2A3A9D]",
      bg: "bg-[#2A3A9D]/5",
    },
    {
      label: "Partial Delivery",
      value: stats.partial,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Draft",
      value: stats.draft,
      icon: AlertCircle,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      label: "Total Value",
      value: formatPHP(stats.totalValue),
      icon: TrendingUp,
      color: "text-[#04397C]",
      bg: "bg-[#04397C]/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", c.bg)}>
                <c.icon className={cn("w-5 h-5", c.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-lg font-bold text-slate-900">{c.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// PURCHASE ORDER TABLE
// ============================================================
function POTable({
  orders,
  onView,
  onEdit,
  onPrint,
  onDuplicate,
  onCancel,
  onReceive,
  loading,
}: {
  orders: PurchaseOrder[];
  onView: (po: PurchaseOrder) => void;
  onEdit: (po: PurchaseOrder) => void;
  onPrint: (po: PurchaseOrder) => void;
  onDuplicate: (po: PurchaseOrder) => void;
  onCancel: (po: PurchaseOrder) => void;
  onReceive: (po: PurchaseOrder) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <ShoppingCart className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          No purchase orders found
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new purchase order to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[120px]">PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Order Date</TableHead>
              <TableHead className="hidden md:table-cell">Expected</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Payment</TableHead>
              <TableHead className="hidden lg:table-cell">
                Last Updated
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((po) => (
              <TableRow
                key={po.id}
                className="group cursor-pointer"
                onClick={() => onView(po)}
              >
                <TableCell className="font-medium text-[#2A3A9D]">
                  {po.poNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{po.supplier}</p>
                    <p className="text-xs text-muted-foreground">
                      {po.totalItems} items
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {formatDate(po.orderDate)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {formatDate(po.expectedDelivery)}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {formatPHP(po.totalAmount + po.deliveryCost)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      getStatusColor(po.status),
                    )}
                  >
                    {po.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      getPaymentStatusColor(po.paymentStatus),
                    )}
                  >
                    {po.paymentStatus}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                  {formatDateTime(po.lastUpdated)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(po);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      {po.status === "Draft" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(po);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                      )}
                      {(po.status === "Ordered" ||
                        po.status === "Partially Delivered") && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onReceive(po);
                          }}
                        >
                          <Truck className="w-4 h-4 mr-2" /> Receive Delivery
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrint(po);
                        }}
                      >
                        <Printer className="w-4 h-4 mr-2" /> Print PO
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(po);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-[#CE2A28] focus:text-[#CE2A28]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(po);
                        }}
                        disabled={
                          po.status === "Cancelled" || po.status === "Completed"
                        }
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel PO
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ============================================================
// PO CREATION / EDIT FORM (POS CART STYLE)
// ============================================================
function POCartItemRow({
  item,
  onUpdateQty,
  onRemove,
  readOnly = false,
}: {
  item: POItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg group">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="secondary" className="text-[10px] h-5">
            {item.sku}
          </Badge>
          <span className="text-xs text-muted-foreground">{item.unit}</span>
        </div>
      </div>
      <div className="text-right min-w-[80px]">
        <p className="text-sm font-medium">{formatPHP(item.costPrice)}</p>
        <p className="text-xs text-muted-foreground">/ {item.unit}</p>
      </div>
      {!readOnly ? (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              onUpdateQty(item.id, Math.max(1, item.quantityOrdered - 1))
            }
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="number"
            min={1}
            value={item.quantityOrdered}
            onChange={(e) =>
              onUpdateQty(item.id, Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-14 h-7 text-center text-sm px-1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQty(item.id, item.quantityOrdered + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="text-sm font-medium w-14 text-center">
          {item.quantityOrdered}
        </div>
      )}
      <div className="text-right min-w-[90px]">
        <p className="text-sm font-semibold">{formatPHP(item.subtotal)}</p>
        {item.quantityReceived > 0 && (
          <p className="text-xs text-emerald-600">
            Received: {item.quantityReceived}
          </p>
        )}
      </div>
      {!readOnly && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-[#CE2A28]"
          onClick={() => onRemove(item.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

function POCreateForm({
  initialPO,
  onSave,
  onCancel,
}: {
  initialPO?: PurchaseOrder;
  onSave: (po: PurchaseOrder) => void;
  onCancel: () => void;
}) {
  const [poNumber, setPoNumber] = useState(
    initialPO?.poNumber || generatePONumber(),
  );
  const [supplierId, setSupplierId] = useState(initialPO?.supplierId || "");
  const [orderDate, setOrderDate] = useState(
    initialPO?.orderDate || new Date().toISOString().split("T")[0],
  );
  const [expectedDelivery, setExpectedDelivery] = useState(
    initialPO?.expectedDelivery || "",
  );
  const [notes, setNotes] = useState(initialPO?.notes || "");
  const [items, setItems] = useState<POItem[]>(initialPO?.items || []);
  const [productSearch, setProductSearch] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(
    initialPO?.deliveryCost || 0,
  );
  const [tax, setTax] = useState(initialPO?.tax || 0);
  const [showProductList, setShowProductList] = useState(false);

  const selectedSupplier = mockSuppliers.find((s) => s.id === supplierId);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q),
    );
  }, [productSearch]);

  const addProduct = (product: Product) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      updateQty(existing.id, existing.quantityOrdered + 1);
    } else {
      const newItem: POItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        unit: product.unit,
        costPrice: product.costPrice,
        quantityOrdered: 1,
        quantityReceived: 0,
        subtotal: product.costPrice,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setProductSearch("");
    setShowProductList(false);
  };

  const updateQty = (itemId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, quantityOrdered: qty, subtotal: qty * i.costPrice }
          : i,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalAmount = subtotal + tax + deliveryCost;

  const handleSave = (status: POStatus) => {
    const po: PurchaseOrder = {
      id: initialPO?.id || `po-${Date.now()}`,
      poNumber,
      supplier: selectedSupplier?.name || "Unknown Supplier",
      supplierId,
      orderDate,
      expectedDelivery,
      notes,
      createdBy: initialPO?.createdBy || "Current User",
      lastUpdated: new Date().toISOString(),
      items,
      totalAmount: subtotal,
      totalItems: items.reduce((sum, i) => sum + i.quantityOrdered, 0),
      tax,
      deliveryCost,
      balanceDue: totalAmount,
      paymentStatus: "Unpaid",
      status,
    };
    onSave(po);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* LEFT: Product Search & Cart */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#2A3A9D]" />
              Add Products
            </CardTitle>
            <CardDescription>Search by name, SKU, or barcode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductList(true);
                }}
                onFocus={() => setShowProductList(true)}
              />
              {showProductList && filteredProducts.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b last:border-0"
                      onClick={() => addProduct(product)}
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku} · Stock: {product.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPHP(product.costPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.unit}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {showProductList &&
                productSearch &&
                filteredProducts.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
            </div>

            {/* Low stock suggestions */}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Low Stock Suggestions
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mockProducts
                  .filter((p) => p.stock < 20)
                  .map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addProduct(product)}
                      className="flex-shrink-0 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-left hover:bg-amber-100 transition-colors"
                    >
                      <p className="text-xs font-medium truncate max-w-[140px]">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-amber-700">
                        Stock: {product.stock} · {formatPHP(product.costPrice)}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Order Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No items added yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Search and add products above
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <POCartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Supplier & Totals Sidebar */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6 space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">PO Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  PO Number
                </label>
                <Input
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Supplier
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full mt-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="">Select supplier...</option>
                  {mockSuppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {selectedSupplier && (
                  <div className="mt-2 p-2 bg-slate-50 rounded text-xs space-y-1">
                    <p>{selectedSupplier.contact}</p>
                    <p className="text-muted-foreground">
                      {selectedSupplier.email}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Order Date
                  </label>
                  <Input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Expected Delivery
                  </label>
                  <Input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Notes
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPHP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <Input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  className="w-24 h-7 text-right text-sm"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Cost</span>
                <Input
                  type="number"
                  value={deliveryCost}
                  onChange={(e) =>
                    setDeliveryCost(parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-7 text-right text-sm"
                />
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-[#2A3A9D]">
                  {formatPHP(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Balance Due</span>
                <span>{formatPHP(totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full bg-[#2A3A9D] hover:bg-[#04397C] text-white"
              onClick={() => handleSave("Ordered")}
              disabled={items.length === 0 || !supplierId}
            >
              <Send className="w-4 h-4 mr-2" />
              Place Order
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSave("Draft")}
              disabled={items.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button variant="ghost" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PO DETAIL VIEW
// ============================================================
function PODetailView({
  po,
  onClose,
  onEdit,
  onPrint,
  onReceive,
  onCancel,
}: {
  po: PurchaseOrder;
  onClose: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onReceive: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{po.poNumber}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Created by {po.createdBy} · {formatDateTime(po.lastUpdated)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-sm px-3 py-1", getStatusColor(po.status))}
          >
            {po.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Supplier</p>
            <p className="font-semibold">{po.supplier}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Order Date</p>
            <p className="font-semibold">{formatDate(po.orderDate)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Expected Delivery
            </p>
            <p className="font-semibold">{formatDate(po.expectedDelivery)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {po.items.map((item) => (
              <POCartItemRow
                key={item.id}
                item={item}
                onUpdateQty={() => {}}
                onRemove={() => {}}
                readOnly
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPHP(po.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPHP(po.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span>{formatPHP(po.deliveryCost)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#2A3A9D]">
                {formatPHP(po.totalAmount + po.tax + po.deliveryCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Status</span>
              <span
                className={cn(
                  "font-medium",
                  getPaymentStatusColor(po.paymentStatus),
                )}
              >
                {po.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance Due</span>
              <span className="font-medium">{formatPHP(po.balanceDue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {po.notes && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{po.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {po.status === "Draft" && (
          <Button onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
        {(po.status === "Ordered" || po.status === "Partially Delivered") && (
          <Button
            onClick={onReceive}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Truck className="w-4 h-4 mr-2" /> Receive Delivery
          </Button>
        )}
        <Button variant="outline" onClick={onPrint}>
          <Printer className="w-4 h-4 mr-2" /> Print
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        {po.status !== "Cancelled" && po.status !== "Completed" && (
          <Button
            variant="ghost"
            className="text-[#CE2A28] hover:text-[#CE2A28] hover:bg-[#CE2A28]/5 ml-auto"
            onClick={onCancel}
          >
            <XCircle className="w-4 h-4 mr-2" /> Cancel PO
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// RECEIVE DELIVERY DIALOG
// ============================================================
function ReceiveDeliveryDialog({
  po,
  open,
  onClose,
  onConfirm,
}: {
  po: PurchaseOrder;
  open: boolean;
  onClose: () => void;
  onConfirm: (items: POItem[]) => void;
}) {
  const [items, setItems] = useState<POItem[]>(po.items);

  const updateReceived = (itemId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const max = i.quantityOrdered - i.quantityReceived;
        const newReceived = Math.max(0, Math.min(qty, max));
        return { ...i, quantityReceived: i.quantityReceived + newReceived };
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Receive Delivery</DialogTitle>
          <DialogDescription>
            {po.poNumber} · {po.supplier}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {items.map((item) => {
            const remaining = item.quantityOrdered - item.quantityReceived;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Ordered: {item.quantityOrdered} · Already received:{" "}
                    {item.quantityReceived}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Receive:
                  </span>
                  <Input
                    type="number"
                    min={0}
                    max={remaining}
                    defaultValue={0}
                    onChange={(e) =>
                      updateReceived(item.id, parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-16">
                    / {remaining} left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(items)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<POStatus | "All">("All");
  const [loading, setLoading] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.poNumber.toLowerCase().includes(q) ||
          o.supplier.toLowerCase().includes(q),
      );
    }
    return result.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    );
  }, [orders, statusFilter, searchQuery]);

  const handleCreate = () => {
    setSelectedPO(null);
    setView("create");
  };

  const handleSave = (po: PurchaseOrder) => {
    setOrders((prev) => {
      const exists = prev.find((o) => o.id === po.id);
      if (exists) {
        return prev.map((o) => (o.id === po.id ? po : o));
      }
      return [po, ...prev];
    });
    setView("list");
  };

  const handleView = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setView("detail");
  };

  const handleEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setView("create");
  };

  const handleDuplicate = (po: PurchaseOrder) => {
    const duplicated: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber: generatePONumber(),
      status: "Draft",
      paymentStatus: "Unpaid",
      orderDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
      items: po.items.map((i) => ({
        ...i,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quantityReceived: 0,
      })),
    };
    setOrders((prev) => [duplicated, ...prev]);
  };

  const handleCancel = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedPO) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedPO.id
          ? {
              ...o,
              status: "Cancelled" as POStatus,
              lastUpdated: new Date().toISOString(),
            }
          : o,
      ),
    );
    setCancelDialogOpen(false);
    setView("list");
  };

  const handleReceive = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setReceiveDialogOpen(true);
  };

  const confirmReceive = (updatedItems: POItem[]) => {
    if (!selectedPO) return;
    const allReceived = updatedItems.every(
      (i) => i.quantityReceived >= i.quantityOrdered,
    );
    const someReceived = updatedItems.some((i) => i.quantityReceived > 0);
    const newStatus: POStatus = allReceived
      ? "Completed"
      : someReceived
        ? "Partially Delivered"
        : selectedPO.status;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedPO.id
          ? {
              ...o,
              items: updatedItems,
              status: newStatus,
              lastUpdated: new Date().toISOString(),
            }
          : o,
      ),
    );
    setReceiveDialogOpen(false);
    setView("list");
  };

  const handlePrint = (po: PurchaseOrder) => {
    window.alert(`Printing ${po.poNumber}... (Print preview would open here)`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {view === "list" && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Purchase Orders
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage procurement and supplier orders
                </p>
              </div>
              <Button
                className="bg-[#2A3A9D] hover:bg-[#04397C] text-white"
                onClick={handleCreate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create PO
              </Button>
            </div>

            {/* Summary Cards */}
            <POSummaryCards orders={orders} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PO number or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as POStatus | "All")}
              >
                <TabsList className="bg-white border">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Draft">Draft</TabsTrigger>
                  <TabsTrigger value="Ordered">Ordered</TabsTrigger>
                  <TabsTrigger value="Partially Delivered">Partial</TabsTrigger>
                  <TabsTrigger value="Completed">Done</TabsTrigger>
                  <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Table */}
            <POTable
              orders={filteredOrders}
              onView={handleView}
              onEdit={handleEdit}
              onPrint={handlePrint}
              onDuplicate={handleDuplicate}
              onCancel={handleCancel}
              onReceive={handleReceive}
              loading={loading}
            />
          </>
        )}

        {view === "create" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => setView("list")}>
                <ChevronDown className="w-4 h-4 rotate-90 mr-1" /> Back
              </Button>
              <h1 className="text-2xl font-bold">
                {selectedPO
                  ? `Edit ${selectedPO.poNumber}`
                  : "Create Purchase Order"}
              </h1>
            </div>
            <POCreateForm
              initialPO={selectedPO || undefined}
              onSave={handleSave}
              onCancel={() => setView("list")}
            />
          </div>
        )}

        {view === "detail" && selectedPO && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => setView("list")}>
                <ChevronDown className="w-4 h-4 rotate-90 mr-1" /> Back to List
              </Button>
            </div>
            <PODetailView
              po={selectedPO}
              onClose={() => setView("list")}
              onEdit={() => handleEdit(selectedPO)}
              onPrint={() => handlePrint(selectedPO)}
              onReceive={() => handleReceive(selectedPO)}
              onCancel={() => handleCancel(selectedPO)}
            />
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {selectedPO?.poNumber}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep PO
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              className="bg-[#CE2A28] hover:bg-[#CE2A28]/90"
            >
              <XCircle className="w-4 h-4 mr-2" /> Cancel PO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Delivery Dialog */}
      {selectedPO && (
        <ReceiveDeliveryDialog
          po={selectedPO}
          open={receiveDialogOpen}
          onClose={() => setReceiveDialogOpen(false)}
          onConfirm={confirmReceive}
        />
      )}
    </div>
  );
}
