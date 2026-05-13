"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  CircleDashed,
  Plus,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { COLORS } from "@/styles/colors";
import Pagination from "@/components/sections/Pagination";

// ─── Types ───────────────────────────────────────────────────────
type IncomingStatus = "draft" | "received";

interface IncomingItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
}

interface IncomingStock {
  id: string;
  referenceNo: string;
  supplier: string;
  dateReceived: string;
  receivedBy: string;
  items: IncomingItem[];
  status: IncomingStatus;
  notes?: string;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialIncoming: IncomingStock[] = [
  {
    id: "1",
    referenceNo: "PO-2026-0542",
    supplier: "Michelin Corp",
    dateReceived: "2026-05-13",
    receivedBy: "Admin User",
    items: [
      {
        productId: "1",
        productName: "Michelin Pilot Sport 4",
        sku: "MICH-PS4-225",
        quantity: 50,
        unit: "pcs",
      },
      {
        productId: "2",
        productName: "Michelin Pilot Sport 4S",
        sku: "MICH-PS4S-255",
        quantity: 30,
        unit: "pcs",
      },
    ],
    status: "received",
    notes: "Regular monthly delivery. All items verified.",
    createdAt: "2026-05-13T09:00:00",
  },
  {
    id: "2",
    referenceNo: "PO-2026-0543",
    supplier: "Bridgestone Inc",
    dateReceived: "2026-05-13",
    receivedBy: "Admin User",
    items: [
      {
        productId: "3",
        productName: "Bridgestone Potenza RE-71R",
        sku: "BRID-RE71-245",
        quantity: 25,
        unit: "pcs",
      },
    ],
    status: "draft",
    notes: "Waiting for warehouse verification",
    createdAt: "2026-05-13T11:30:00",
  },
  {
    id: "3",
    referenceNo: "RTN-2026-0089",
    supplier: "Customer Returns",
    dateReceived: "2026-05-12",
    receivedBy: "Admin User",
    items: [
      {
        productId: "4",
        productName: "Goodyear Eagle F1 Asymmetric",
        sku: "GOOD-F1A-235",
        quantity: 2,
        unit: "pcs",
      },
    ],
    status: "received",
    notes: "Unopened box, customer changed mind. Restocked.",
    createdAt: "2026-05-12T14:15:00",
  },
  {
    id: "4",
    referenceNo: "PO-2026-0540",
    supplier: "Pirelli & C",
    dateReceived: "2026-05-11",
    receivedBy: "Admin User",
    items: [
      {
        productId: "5",
        productName: "Pirelli P Zero",
        sku: "PIRE-PZ-255",
        quantity: 40,
        unit: "pcs",
      },
      {
        productId: "6",
        productName: "Pirelli P Zero Corsa",
        sku: "PIRE-PZC-265",
        quantity: 20,
        unit: "pcs",
      },
    ],
    status: "received",
    notes: "",
    createdAt: "2026-05-11T10:00:00",
  },
  {
    id: "5",
    referenceNo: "PO-2026-0541",
    supplier: "Continental AG",
    dateReceived: "2026-05-10",
    receivedBy: "Admin User",
    items: [
      {
        productId: "7",
        productName: "Continental SportContact 7",
        sku: "CONT-SC7-245",
        quantity: 35,
        unit: "pcs",
      },
    ],
    status: "draft",
    notes: "Partial delivery — 15 more units expected next week",
    createdAt: "2026-05-10T08:45:00",
  },
  {
    id: "6",
    referenceNo: "TRF-2026-0012",
    supplier: "Branch Returns — Downtown",
    dateReceived: "2026-05-09",
    receivedBy: "Admin User",
    items: [
      {
        productId: "8",
        productName: "Yokohama Advan Neova AD09",
        sku: "YOKO-AD09-225",
        quantity: 12,
        unit: "pcs",
      },
      {
        productId: "9",
        productName: "Yokohama Advan Fleva",
        sku: "YOKO-AF-235",
        quantity: 8,
        unit: "pcs",
      },
    ],
    status: "received",
    notes: "Excess stock from downtown branch",
    createdAt: "2026-05-09T16:00:00",
  },
];

const suppliers = [
  "Michelin Corp",
  "Bridgestone Inc",
  "Goodyear Tires",
  "Pirelli & C",
  "Continental AG",
  "Yokohama Rubber",
  "Customer Returns",
  "Branch Returns — Downtown",
  "Branch Returns — Uptown",
];

const productCatalog = [
  { id: "1", name: "Michelin Pilot Sport 4", sku: "MICH-PS4-225", unit: "pcs" },
  {
    id: "2",
    name: "Michelin Pilot Sport 4S",
    sku: "MICH-PS4S-255",
    unit: "pcs",
  },
  {
    id: "3",
    name: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    unit: "pcs",
  },
  {
    id: "4",
    name: "Goodyear Eagle F1 Asymmetric",
    sku: "GOOD-F1A-235",
    unit: "pcs",
  },
  { id: "5", name: "Pirelli P Zero", sku: "PIRE-PZ-255", unit: "pcs" },
  { id: "6", name: "Pirelli P Zero Corsa", sku: "PIRE-PZC-265", unit: "pcs" },
  {
    id: "7",
    name: "Continental SportContact 7",
    sku: "CONT-SC7-245",
    unit: "pcs",
  },
  {
    id: "8",
    name: "Yokohama Advan Neova AD09",
    sku: "YOKO-AD09-225",
    unit: "pcs",
  },
  { id: "9", name: "Yokohama Advan Fleva", sku: "YOKO-AF-235", unit: "pcs" },
];

// ─── Status Config ──────────────────────────────────────────────
const statusConfig = {
  draft: {
    label: "Draft",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: CircleDashed,
    iconColor: "text-gray-400",
  },
  received: {
    label: "Received",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
};

// ─── Incoming Form ──────────────────────────────────────────────
function IncomingForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<IncomingStock, "id" | "createdAt" | "status">) => void;
  onCancel: () => void;
}) {
  const [referenceNo, setReferenceNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [dateReceived, setDateReceived] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [receivedBy, setReceivedBy] = useState("Admin User");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: string }[]>(
    [{ productId: "", quantity: "" }],
  );

  const addItem = () => setItems([...items, { productId: "", quantity: "" }]);
  const removeItem = (idx: number) =>
    setItems(items.filter((_, i) => i !== idx));
  const updateItem = (
    idx: number,
    field: "productId" | "quantity",
    value: string,
  ) => {
    const next = [...items];
    next[idx][field] = value;
    setItems(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items
      .filter((i) => i.productId && i.quantity)
      .map((i) => {
        const product = productCatalog.find((p) => p.id === i.productId)!;
        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: parseInt(i.quantity),
          unit: product.unit,
        };
      });

    onSave({
      referenceNo,
      supplier,
      dateReceived,
      receivedBy,
      items: validItems,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ref">Reference No. *</Label>
          <Input
            id="ref"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            className="bg-gray-50 border-gray-200"
            placeholder="e.g. PO-2026-0544"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Select value={supplier} onValueChange={setSupplier} required>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date Received *</Label>
          <Input
            id="date"
            type="date"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receivedBy">Received By *</Label>
          <Input
            id="receivedBy"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Product List *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </Button>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <Select
              value={item.productId}
              onValueChange={(v) => updateItem(idx, "productId", v)}
            >
              <SelectTrigger className="flex-1 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {productCatalog.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="1"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
              className="w-24 bg-gray-50 border-gray-200"
              required
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(idx)}
                className="h-10 w-10 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-50 border-gray-200 min-h-[60px]"
          placeholder="Optional details..."
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          style={{ backgroundColor: COLORS.primary }}
          className="hover:opacity-90 text-white"
        >
          Save as Draft
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Expandable Row ─────────────────────────────────────────────
function IncomingRow({
  incoming,
  onMarkReceived,
}: {
  incoming: IncomingStock;
  onMarkReceived: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[incoming.status];
  const StatusIcon = config.icon;
  const totalQty = incoming.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <tr
        className={cn(
          "hover:bg-gray-50/50 transition-colors",
          incoming.status === "draft" && "bg-amber-50/20",
        )}
      >
        <td className="py-3.5 px-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {incoming.referenceNo}
              </p>
              <p className="text-xs text-gray-400">
                {incoming.items.length} item
                {incoming.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </button>
        </td>
        <td className="py-3.5 px-4">
          <p className="text-sm text-gray-700">{incoming.supplier}</p>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">
            {incoming.items.length}
          </span>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">{totalQty}</span>
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(incoming.dateReceived).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </td>
        <td className="py-3.5 px-4">
          <Badge variant="outline" className={cn("font-medium", config.badge)}>
            <StatusIcon className={cn("w-3 h-3 mr-1", config.iconColor)} />
            {config.label}
          </Badge>
        </td>
        <td className="py-3.5 px-4 text-right">
          {incoming.status === "draft" ? (
            <Button
              size="sm"
              className="gap-1.5 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => onMarkReceived(incoming.id)}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Received
            </Button>
          ) : (
            <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
              <User className="w-3 h-3" />
              {incoming.receivedBy}
            </span>
          )}
        </td>
      </tr>

      {/* Expanded Detail */}
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 pb-4">
            <div className="ml-6 rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Line Items
                </p>
                {incoming.notes && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {incoming.notes}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {incoming.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-white border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-400">{item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        +{item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {incoming.status === "draft" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <p className="text-sm text-amber-700">
                    This receipt is in draft. Click "Mark Received" to confirm
                    and update inventory.
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Incoming Stocks Page ──────────────────────────────────
export default function IncomingStocksPage() {
  const [incoming, setIncoming] = useState<IncomingStock[]>(initialIncoming);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stats
  const today = new Date("2026-05-13").toISOString().split("T")[0];
  const todayDeliveries = incoming.filter(
    (i) => i.dateReceived === today,
  ).length;
  const pendingReceipts = incoming.filter((i) => i.status === "draft").length;
  const thisWeekTotal = incoming
    .filter((i) => {
      const date = new Date(i.dateReceived);
      const weekAgo = new Date("2026-05-13");
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    })
    .reduce(
      (sum, i) => sum + i.items.reduce((s, item) => s + item.quantity, 0),
      0,
    );

  // Filter
  const filtered = incoming.filter((i) => {
    const matchesSearch =
      i.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = (
    data: Omit<IncomingStock, "id" | "createdAt" | "status">,
  ) => {
    const newIncoming: IncomingStock = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setIncoming([newIncoming, ...incoming]);
    setIsAddDialogOpen(false);
    setCurrentPage(1);
  };

  const handleMarkReceived = (id: string) => {
    setIncoming(
      incoming.map((i) =>
        i.id === id ? { ...i, status: "received" as const } : i,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Incoming Stocks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track products entering the warehouse
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              Record Incoming
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2A3A9D]" />
                Record Incoming Stock
              </DialogTitle>
            </DialogHeader>
            <IncomingForm
              onSave={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Today's Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayDeliveries}
              </p>
              <p className="text-xs text-gray-400">Receipts recorded today</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Pending Receipts</p>
              <p className="text-2xl font-bold text-amber-600">
                {pendingReceipts}
              </p>
              <p className="text-xs text-gray-400">
                Draft — awaiting confirmation
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Incoming This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekTotal}
              </p>
              <p className="text-xs text-gray-400">Total units received</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by reference or supplier..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[150px] bg-white border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="received">Received</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                  Items
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No incoming stock found
                    </p>
                    <p className="text-sm text-gray-400">
                      Record your first delivery to get started
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <IncomingRow
                    key={item.id}
                    incoming={item}
                    onMarkReceived={handleMarkReceived}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
