"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
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
type OutgoingStatus = "pending" | "released" | "cancelled";

interface OutgoingItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
}

interface OutgoingStock {
  id: string;
  referenceNo: string;
  destination: string;
  reason: string;
  dateReleased: string;
  releasedBy: string;
  items: OutgoingItem[];
  status: OutgoingStatus;
  notes?: string;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialOutgoing: OutgoingStock[] = [
  {
    id: "1",
    referenceNo: "DO-2026-0124",
    destination: "Downtown Branch",
    reason: "Branch Restock",
    dateReleased: "2026-05-13",
    releasedBy: "Admin User",
    items: [
      {
        productId: "1",
        productName: "Michelin Pilot Sport 4",
        sku: "MICH-PS4-225",
        quantity: 12,
        unit: "pcs",
      },
      {
        productId: "7",
        productName: "Hankook Ventus V12 Evo2",
        sku: "HANK-V12-235",
        quantity: 8,
        unit: "pcs",
      },
    ],
    status: "released",
    notes: "Monthly branch allocation",
    createdAt: "2026-05-13T08:00:00",
  },
  {
    id: "2",
    referenceNo: "DO-2026-0125",
    destination: "Customer Order #45892",
    reason: "Customer Order",
    dateReleased: "2026-05-13",
    releasedBy: "Admin User",
    items: [
      {
        productId: "4",
        productName: "Pirelli P Zero",
        sku: "PIRE-PZ-255",
        quantity: 4,
        unit: "pcs",
      },
    ],
    status: "pending",
    notes: "Waiting for payment confirmation",
    createdAt: "2026-05-13T10:30:00",
  },
  {
    id: "3",
    referenceNo: "ADJ-2026-0045",
    destination: "Waste/Disposal",
    reason: "Damaged Pullout",
    dateReleased: "2026-05-12",
    releasedBy: "Admin User",
    items: [
      {
        productId: "2",
        productName: "Bridgestone Potenza RE-71R",
        sku: "BRID-RE71-245",
        quantity: 3,
        unit: "pcs",
      },
    ],
    status: "released",
    notes: "Water damage from warehouse leak",
    createdAt: "2026-05-12T14:00:00",
  },
  {
    id: "4",
    referenceNo: "TRF-2026-0033",
    destination: "Display Floor",
    reason: "Transfer to Display",
    dateReleased: "2026-05-12",
    releasedBy: "Admin User",
    items: [
      {
        productId: "6",
        productName: "Yokohama Advan Neova AD09",
        sku: "YOKO-AD09-225",
        quantity: 6,
        unit: "pcs",
      },
      {
        productId: "8",
        productName: "Toyo Proxes R888R",
        sku: "TOYO-R888-255",
        quantity: 4,
        unit: "pcs",
      },
    ],
    status: "pending",
    notes: "Weekend display setup",
    createdAt: "2026-05-12T09:15:00",
  },
  {
    id: "5",
    referenceNo: "DO-2026-0123",
    destination: "Uptown Branch",
    reason: "Branch Restock",
    dateReleased: "2026-05-11",
    releasedBy: "Admin User",
    items: [
      {
        productId: "10",
        productName: "BFGoodrich g-Force Sport",
        sku: "BFG-GFS-225",
        quantity: 15,
        unit: "pcs",
      },
    ],
    status: "cancelled",
    notes: "Branch requested to hold — overstock",
    createdAt: "2026-05-11T11:00:00",
  },
];

const destinations = [
  "Downtown Branch",
  "Uptown Branch",
  "Display Floor",
  "Waste/Disposal",
  "Customer Order",
];

const reasons = [
  "Branch Restock",
  "Customer Order",
  "Damaged Pullout",
  "Transfer to Display",
  "Internal Use",
  "Other",
];

const productCatalog = [
  { id: "1", name: "Michelin Pilot Sport 4", sku: "MICH-PS4-225", unit: "pcs" },
  {
    id: "2",
    name: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    unit: "pcs",
  },
  { id: "4", name: "Pirelli P Zero", sku: "PIRE-PZ-255", unit: "pcs" },
  {
    id: "6",
    name: "Yokohama Advan Neova AD09",
    sku: "YOKO-AD09-225",
    unit: "pcs",
  },
  {
    id: "7",
    name: "Hankook Ventus V12 Evo2",
    sku: "HANK-V12-235",
    unit: "pcs",
  },
  { id: "8", name: "Toyo Proxes R888R", sku: "TOYO-R888-255", unit: "pcs" },
  {
    id: "10",
    name: "BFGoodrich g-Force Sport",
    sku: "BFG-GFS-225",
    unit: "pcs",
  },
];

// ─── Status Config ──────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    iconColor: "text-amber-500",
  },
  released: {
    label: "Released",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
    iconColor: "text-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: XCircle,
    iconColor: "text-gray-400",
  },
};

// ─── Outgoing Form ──────────────────────────────────────────────
function OutgoingForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<OutgoingStock, "id" | "createdAt" | "status">) => void;
  onCancel: () => void;
}) {
  const [referenceNo, setReferenceNo] = useState("");
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [dateReleased, setDateReleased] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [releasedBy, setReleasedBy] = useState("Admin User");
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
      destination,
      reason,
      dateReleased,
      releasedBy,
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
            placeholder="e.g. DO-2026-0126"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination *</Label>
          <Select value={destination} onValueChange={setDestination} required>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Where is it going?" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason *</Label>
          <Select value={reason} onValueChange={setReason} required>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Why is it leaving?" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date Released *</Label>
          <Input
            id="date"
            type="date"
            value={dateReleased}
            onChange={(e) => setDateReleased(e.target.value)}
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="releasedBy">Released By *</Label>
        <Input
          id="releasedBy"
          value={releasedBy}
          onChange={(e) => setReleasedBy(e.target.value)}
          className="bg-gray-50 border-gray-200"
          required
        />
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
          placeholder="Optional context..."
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
          Create as Pending
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Expandable Row ─────────────────────────────────────────────
function OutgoingRow({
  outgoing,
  onRelease,
  onCancel,
}: {
  outgoing: OutgoingStock;
  onRelease: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[outgoing.status];
  const StatusIcon = config.icon;
  const totalQty = outgoing.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <tr
        className={cn(
          "hover:bg-gray-50/50 transition-colors",
          outgoing.status === "pending" && "bg-amber-50/20",
          outgoing.status === "cancelled" && "opacity-50",
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
                {outgoing.referenceNo}
              </p>
              <p className="text-xs text-gray-400">
                {outgoing.items.length} item
                {outgoing.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </button>
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-sm text-gray-700">{outgoing.destination}</p>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{outgoing.reason}</p>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">
            {outgoing.items.length}
          </span>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">{totalQty}</span>
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(outgoing.dateReleased).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
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
          {outgoing.status === "pending" && (
            <div className="flex items-center justify-end gap-1">
              <Button
                size="sm"
                className="gap-1.5 text-white hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
                onClick={() => onRelease(outgoing.id)}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Release
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel(outgoing.id)}
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                title="Cancel"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
          {outgoing.status === "released" && (
            <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
              <User className="w-3 h-3" />
              {outgoing.releasedBy}
            </span>
          )}
          {outgoing.status === "cancelled" && (
            <span className="text-xs text-gray-400">Cancelled</span>
          )}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 pb-4">
            <div className="ml-6 rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Line Items
                </p>
                {outgoing.notes && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {outgoing.notes}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {outgoing.items.map((item) => (
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
                      <p className="text-sm font-bold text-red-600">
                        -{item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {outgoing.status === "pending" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-sm text-amber-700">
                    Pending release. Stock will be deducted from warehouse upon
                    release.
                  </p>
                </div>
              )}
              {outgoing.status === "released" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-blue-700">
                    Released on {outgoing.dateReleased}. Stock deducted and
                    movement log generated.
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

// ─── Main Outgoing Stocks Page ──────────────────────────────────
export default function OutgoingStocksPage() {
  const [outgoing, setOutgoing] = useState<OutgoingStock[]>(initialOutgoing);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stats
  const today = "2026-05-13";
  const todayOutgoing = outgoing.filter(
    (o) => o.dateReleased === today && o.status === "released",
  ).length;
  const pendingCount = outgoing.filter((o) => o.status === "pending").length;
  const thisWeekTotal = outgoing
    .filter((o) => o.status === "released")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Filter
  const filtered = outgoing.filter((o) => {
    const matchesSearch =
      o.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = (
    data: Omit<OutgoingStock, "id" | "createdAt" | "status">,
  ) => {
    const newOutgoing: OutgoingStock = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOutgoing([newOutgoing, ...outgoing]);
    setIsAddDialogOpen(false);
    setCurrentPage(1);
  };

  const handleRelease = (id: string) => {
    // In real app: deduct stock, generate movement log
    setOutgoing(
      outgoing.map((o) =>
        o.id === id ? { ...o, status: "released" as const } : o,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setOutgoing(
      outgoing.map((o) =>
        o.id === id ? { ...o, status: "cancelled" as const } : o,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Outgoing Stocks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track products leaving the warehouse
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              Record Outgoing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-[#2A3A9D]" />
                Record Outgoing Stock
              </DialogTitle>
            </DialogHeader>
            <OutgoingForm
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
              <p className="text-sm text-gray-500">Released Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayOutgoing}
              </p>
              <p className="text-xs text-gray-400">Shipments completed</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Pending Release</p>
              <p className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </p>
              <p className="text-xs text-gray-400">Awaiting confirmation</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Released This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekTotal}
              </p>
              <p className="text-xs text-gray-400">Total units shipped</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by reference, destination, or reason..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="released">Released</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  Destination
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
                      No outgoing stock found
                    </p>
                    <p className="text-sm text-gray-400">
                      Record your first shipment to get started
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <OutgoingRow
                    key={item.id}
                    outgoing={item}
                    onRelease={handleRelease}
                    onCancel={handleCancel}
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
