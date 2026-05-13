"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  MapPin,
  User,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  MoveRight,
  Warehouse,
  Store,
  Monitor,
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
type MovementType = "transfer";
type MovementStatus = "pending" | "completed" | "cancelled";

interface MovementItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
}

interface Movement {
  id: string;
  referenceNo: string;
  movementType: MovementType;
  sourceLocation: string;
  destinationLocation: string;
  items: MovementItem[];
  status: MovementStatus;
  handledBy: string;
  movementDate: string;
  notes?: string;
  createdAt: string;
}

// ─── Unified Movement Engine ────────────────────────────────────
// All inventory movements use this same structure
// Types: IN | OUT | TRANSFER | ADJUSTMENT
// This page filters to show only TRANSFER type

// ─── Mock Data ──────────────────────────────────────────────────
const locations = [
  "Main Warehouse",
  "Downtown Store",
  "Uptown Store",
  "Display Floor",
  "Back Storage",
  "Returns Area",
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
  {
    id: "10",
    name: "BFGoodrich g-Force Sport",
    sku: "BFG-GFS-225",
    unit: "pcs",
  },
];

const initialMovements: Movement[] = [
  {
    id: "1",
    referenceNo: "TRF-2026-0089",
    movementType: "transfer",
    sourceLocation: "Main Warehouse",
    destinationLocation: "Downtown Store",
    items: [
      {
        productId: "1",
        productName: "Michelin Pilot Sport 4",
        sku: "MICH-PS4-225",
        quantity: 20,
        unit: "pcs",
      },
      {
        productId: "7",
        productName: "Hankook Ventus V12 Evo2",
        sku: "HANK-V12-235",
        quantity: 15,
        unit: "pcs",
      },
    ],
    status: "completed",
    handledBy: "Admin User",
    movementDate: "2026-05-13",
    notes: "Weekly restock to downtown",
    createdAt: "2026-05-13T08:00:00",
  },
  {
    id: "2",
    referenceNo: "TRF-2026-0090",
    movementType: "transfer",
    sourceLocation: "Main Warehouse",
    destinationLocation: "Display Floor",
    items: [
      {
        productId: "6",
        productName: "Yokohama Advan Neova AD09",
        sku: "YOKO-AD09-225",
        quantity: 8,
        unit: "pcs",
      },
    ],
    status: "pending",
    handledBy: "Admin User",
    movementDate: "2026-05-13",
    notes: "Weekend promotion setup",
    createdAt: "2026-05-13T10:30:00",
  },
  {
    id: "3",
    referenceNo: "TRF-2026-0088",
    movementType: "transfer",
    sourceLocation: "Back Storage",
    destinationLocation: "Main Warehouse",
    items: [
      {
        productId: "2",
        productName: "Bridgestone Potenza RE-71R",
        sku: "BRID-RE71-245",
        quantity: 30,
        unit: "pcs",
      },
      {
        productId: "4",
        productName: "Pirelli P Zero",
        sku: "PIRE-PZ-255",
        quantity: 25,
        unit: "pcs",
      },
    ],
    status: "completed",
    handledBy: "Admin User",
    movementDate: "2026-05-12",
    notes: "Consolidating stock for easier access",
    createdAt: "2026-05-12T14:00:00",
  },
  {
    id: "4",
    referenceNo: "TRF-2026-0087",
    movementType: "transfer",
    sourceLocation: "Main Warehouse",
    destinationLocation: "Uptown Store",
    items: [
      {
        productId: "10",
        productName: "BFGoodrich g-Force Sport",
        sku: "BFG-GFS-225",
        quantity: 18,
        unit: "pcs",
      },
    ],
    status: "cancelled",
    handledBy: "Admin User",
    movementDate: "2026-05-11",
    notes: "Uptown store overstocked — cancelled",
    createdAt: "2026-05-11T09:15:00",
  },
  {
    id: "5",
    referenceNo: "TRF-2026-0091",
    movementType: "transfer",
    sourceLocation: "Returns Area",
    destinationLocation: "Main Warehouse",
    items: [
      {
        productId: "1",
        productName: "Michelin Pilot Sport 4",
        sku: "MICH-PS4-225",
        quantity: 3,
        unit: "pcs",
      },
    ],
    status: "pending",
    handledBy: "Admin User",
    movementDate: "2026-05-13",
    notes: "Good condition returns — restockable",
    createdAt: "2026-05-13T11:00:00",
  },
];

// ─── Status Config ────────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    iconColor: "text-amber-500",
  },
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: XCircle,
    iconColor: "text-gray-400",
  },
};

// ─── Location Icon Helper ───────────────────────────────────────
function LocationIcon({ location }: { location: string }) {
  if (location.includes("Store")) return <Store className="w-4 h-4" />;
  if (location.includes("Display")) return <Monitor className="w-4 h-4" />;
  return <Warehouse className="w-4 h-4" />;
}

// ─── Transfer Form ──────────────────────────────────────────────
function TransferForm({
  onSave,
  onCancel,
}: {
  onSave: (
    data: Omit<Movement, "id" | "createdAt" | "status" | "movementType">,
  ) => void;
  onCancel: () => void;
}) {
  const [referenceNo, setReferenceNo] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [handledBy, setHandledBy] = useState("Admin User");
  const [movementDate, setMovementDate] = useState(
    new Date().toISOString().split("T")[0],
  );
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
      sourceLocation,
      destinationLocation,
      items: validItems,
      handledBy,
      movementDate,
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
            placeholder="e.g. TRF-2026-0092"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Transfer Date *</Label>
          <Input
            id="date"
            type="date"
            value={movementDate}
            onChange={(e) => setMovementDate(e.target.value)}
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source Location *</Label>
          <Select
            value={sourceLocation}
            onValueChange={setSourceLocation}
            required
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="From where?" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dest">Destination Location *</Label>
          <Select
            value={destinationLocation}
            onValueChange={setDestinationLocation}
            required
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="To where?" />
            </SelectTrigger>
            <SelectContent>
              {locations
                .filter((l) => l !== sourceLocation)
                .map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="handledBy">Handled By *</Label>
        <Input
          id="handledBy"
          value={handledBy}
          onChange={(e) => setHandledBy(e.target.value)}
          className="bg-gray-50 border-gray-200"
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Products to Transfer *</Label>
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
          Create Transfer
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Expandable Row ─────────────────────────────────────────────
function TransferRow({
  movement,
  onComplete,
  onCancel,
}: {
  movement: Movement;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[movement.status];
  const StatusIcon = config.icon;
  const totalQty = movement.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <tr
        className={cn(
          "hover:bg-gray-50/50 transition-colors",
          movement.status === "pending" && "bg-amber-50/20",
          movement.status === "cancelled" && "opacity-50",
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
                {movement.referenceNo}
              </p>
              <p className="text-xs text-gray-400">
                {movement.items.length} item
                {movement.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </button>
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <LocationIcon location={movement.sourceLocation} />
              <span className="truncate max-w-[100px]">
                {movement.sourceLocation}
              </span>
            </div>
            <MoveRight className="w-4 h-4 text-gray-300" />
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <LocationIcon location={movement.destinationLocation} />
              <span className="truncate max-w-[100px]">
                {movement.destinationLocation}
              </span>
            </div>
          </div>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">
            {movement.items.length}
          </span>
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className="text-sm font-medium text-gray-900">{totalQty}</span>
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(movement.movementDate).toLocaleDateString("en-US", {
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
          {movement.status === "pending" && (
            <div className="flex items-center justify-end gap-1">
              <Button
                size="sm"
                className="gap-1.5 text-white hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
                onClick={() => onComplete(movement.id)}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel(movement.id)}
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                title="Cancel"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
          {movement.status === "completed" && (
            <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
              <User className="w-3 h-3" />
              {movement.handledBy}
            </span>
          )}
          {movement.status === "cancelled" && (
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
                  Transfer Details
                </p>
                {movement.notes && (
                  <p className="text-xs text-gray-500">{movement.notes}</p>
                )}
              </div>

              {/* Route Visualization */}
              <div className="flex items-center gap-3 p-3 rounded-md bg-white border border-gray-100">
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-1">
                    <LocationIcon location={movement.sourceLocation} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">
                    {movement.sourceLocation}
                  </p>
                  <p className="text-[10px] text-gray-400">Source</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <MoveRight className="w-5 h-5 text-[#2A3A9D]" />
                  <p className="text-[10px] text-gray-400">{totalQty} units</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-lg bg-[#2A3A9D]/10 flex items-center justify-center mx-auto mb-1">
                    <LocationIcon location={movement.destinationLocation} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">
                    {movement.destinationLocation}
                  </p>
                  <p className="text-[10px] text-gray-400">Destination</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                {movement.items.map((item) => (
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
                      <p className="text-sm font-bold text-[#2A3A9D]">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {movement.status === "pending" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <p className="text-sm text-amber-700">
                    Pending completion. Stock will move from source to
                    destination upon confirmation.
                  </p>
                </div>
              )}
              {movement.status === "completed" && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm text-emerald-700">
                    Transfer completed. Stock deducted from source and added to
                    destination.
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

// ─── Main Transfers Page ────────────────────────────────────────
export default function TransfersPage() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stats
  const today = "2026-05-13";
  const todayTransfers = movements.filter(
    (m) => m.movementDate === today && m.status === "completed",
  ).length;
  const pendingCount = movements.filter((m) => m.status === "pending").length;
  const thisWeekTotal = movements
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Filter
  const filtered = movements.filter((m) => {
    const matchesSearch =
      m.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sourceLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAdd = (
    data: Omit<Movement, "id" | "createdAt" | "status" | "movementType">,
  ) => {
    const newMovement: Movement = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      movementType: "transfer",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setMovements([newMovement, ...movements]);
    setIsAddDialogOpen(false);
    setCurrentPage(1);
  };

  const handleComplete = (id: string) => {
    // In real app: deduct from source, add to destination, log movement
    setMovements(
      movements.map((m) =>
        m.id === id ? { ...m, status: "completed" as const } : m,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setMovements(
      movements.map((m) =>
        m.id === id ? { ...m, status: "cancelled" as const } : m,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Transfers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Move stock between locations — one unified movement engine
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-[#2A3A9D]" />
                Record Transfer
              </DialogTitle>
            </DialogHeader>
            <TransferForm
              onSave={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Unified Engine Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[#2A3A9D]/5 border border-[#2A3A9D]/10">
        <ArrowLeftRight className="w-5 h-5 text-[#2A3A9D] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#2A3A9D]">
            Unified Movement Engine
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            All inventory movements (IN, OUT, TRANSFER, ADJUSTMENT) use the same
            underlying structure. This simplifies reporting, audit trails, and
            database design.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayTransfers}
              </p>
              <p className="text-xs text-gray-400">Transfers finalized</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </p>
              <p className="text-xs text-gray-400">Awaiting completion</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Moved This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekTotal}
              </p>
              <p className="text-xs text-gray-400">Total units transferred</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#2A3A9D]/10 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-[#2A3A9D]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by reference, source, or destination..."
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
            <SelectItem value="completed">Completed</SelectItem>
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
                  Route
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
                    <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No transfers found
                    </p>
                    <p className="text-sm text-gray-400">
                      Record your first transfer to get started
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <TransferRow
                    key={item.id}
                    movement={item}
                    onComplete={handleComplete}
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
