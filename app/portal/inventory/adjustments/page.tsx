"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Edit3,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COLORS } from "@/styles/colors";
import Pagination from "@/components/sections/Pagination";

// ─── Types ───────────────────────────────────────────────────────
type AdjustmentType = "add" | "remove" | "set";

interface AdjustmentLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: AdjustmentType;
  quantityBefore: number;
  quantityAfter: number;
  difference: number;
  reason: string;
  adjustedBy: string;
  date: string;
  notes?: string;
}

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
}

// ─── Mock Data ──────────────────────────────────────────────────
const productOptions: ProductOption[] = [
  { id: "1", name: "Michelin Pilot Sport 4", sku: "MICH-PS4-225", currentStock: 45 },
  { id: "2", name: "Bridgestone Potenza RE-71R", sku: "BRID-RE71-245", currentStock: 8 },
  { id: "3", name: "Goodyear Eagle F1 Asymmetric", sku: "GOOD-F1A-235", currentStock: 0 },
  { id: "4", name: "Pirelli P Zero", sku: "PIRE-PZ-255", currentStock: 23 },
  { id: "5", name: "Continental SportContact 7", sku: "CONT-SC7-245", currentStock: 0 },
  { id: "6", name: "Yokohama Advan Neova AD09", sku: "YOKO-AD09-225", currentStock: 67 },
];

const initialLogs: AdjustmentLog[] = [
  {
    id: "ADJ-001",
    productId: "1",
    productName: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    type: "add",
    quantityBefore: 40,
    quantityAfter: 45,
    difference: 5,
    reason: "Restocking from supplier",
    adjustedBy: "Admin User",
    date: "2026-05-12T09:30:00",
    notes: "Regular monthly restock",
  },
  {
    id: "ADJ-002",
    productId: "2",
    productName: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    type: "remove",
    quantityBefore: 12,
    quantityAfter: 8,
    difference: -4,
    reason: "Damaged items",
    adjustedBy: "Admin User",
    date: "2026-05-11T14:15:00",
    notes: "Water damage from warehouse leak",
  },
  {
    id: "ADJ-003",
    productId: "3",
    productName: "Goodyear Eagle F1 Asymmetric",
    sku: "GOOD-F1A-235",
    type: "set",
    quantityBefore: 5,
    quantityAfter: 0,
    difference: -5,
    reason: "Inventory correction",
    adjustedBy: "Admin User",
    date: "2026-05-10T11:00:00",
    notes: "Physical count mismatch",
  },
  {
    id: "ADJ-004",
    productId: "6",
    productName: "Yokohama Advan Neova AD09",
    sku: "YOKO-AD09-225",
    type: "add",
    quantityBefore: 60,
    quantityAfter: 67,
    difference: 7,
    reason: "Customer return",
    adjustedBy: "Admin User",
    date: "2026-05-09T16:45:00",
    notes: "Unopened box returned within 30 days",
  },
  {
    id: "ADJ-005",
    productId: "4",
    productName: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    type: "remove",
    quantityBefore: 25,
    quantityAfter: 23,
    difference: -2,
    reason: "Missing items",
    adjustedBy: "Admin User",
    date: "2026-05-08T10:20:00",
    notes: "Unable to locate 2 units during audit",
  },
];

const adjustmentReasons = [
  "Restocking from supplier",
  "Damaged items",
  "Missing items",
  "Inventory correction",
  "Customer return",
  "Expired items",
  "Theft/loss",
  "Other",
];

// ─── Type Config ────────────────────────────────────────────────
const typeConfig = {
  add: {
    label: "Add Stock",
    icon: ArrowUpCircle,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    diffPrefix: "+",
    diffColor: "text-emerald-600",
  },
  remove: {
    label: "Remove Stock",
    icon: ArrowDownCircle,
    badge: "bg-red-50 text-red-700 border-red-200",
    diffPrefix: "",
    diffColor: "text-red-600",
  },
  set: {
    label: "Set Quantity",
    icon: RotateCcw,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    diffPrefix: "",
    diffColor: "text-blue-600",
  },
};

// ─── Adjustment Form ────────────────────────────────────────────
function AdjustmentForm({
  onSave,
  onCancel,
}: {
  onSave: (log: Omit<AdjustmentLog, "id" | "date" | "adjustedBy">) => void;
  onCancel: () => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [type, setType] = useState<AdjustmentType>("add");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const product = productOptions.find((p) => p.id === selectedProduct);
  const currentStock = product?.currentStock ?? 0;

  const calculatedAfter = (() => {
    const qty = parseInt(quantity) || 0;
    if (type === "add") return currentStock + qty;
    if (type === "remove") return Math.max(0, currentStock - qty);
    return qty; // set
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const qty = parseInt(quantity) || 0;
    const diff = type === "add" ? qty : type === "remove" ? -qty : calculatedAfter - currentStock;

    onSave({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type,
      quantityBefore: currentStock,
      quantityAfter: calculatedAfter,
      difference: diff,
      reason,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product Selection */}
      <div className="space-y-2">
        <Label htmlFor="product">Product *</Label>
        <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
          <SelectTrigger className="bg-gray-50 border-gray-200">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {productOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-400 ml-2">({p.sku}) — {p.currentStock} in stock</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Adjustment Type */}
      <div className="space-y-2">
        <Label>Adjustment Type *</Label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(typeConfig) as AdjustmentType[]).map((t) => {
            const config = typeConfig[t];
            const Icon = config.icon;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  type === t
                    ? "border-[#2A3A9D] bg-[#2A3A9D]/5 text-[#2A3A9D]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            {type === "set" ? "New Quantity *" : "Quantity *"}
          </Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-gray-50 border-gray-200"
            placeholder={type === "set" ? "Enter exact amount" : "Enter amount"}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Result Preview</Label>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-500">{currentStock}</span>
            <span className="text-gray-400">→</span>
            <span className={cn("text-sm font-bold", calculatedAfter < currentStock ? "text-red-600" : calculatedAfter > currentStock ? "text-emerald-600" : "text-gray-900")}>
              {calculatedAfter}
            </span>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason *</Label>
        <Select value={reason} onValueChange={setReason} required>
          <SelectTrigger className="bg-gray-50 border-gray-200">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            {adjustmentReasons.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-50 border-gray-200 min-h-[80px]"
          placeholder="Optional details about this adjustment..."
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
          disabled={!selectedProduct || !quantity || !reason}
        >
          Record Adjustment
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Log Detail View ────────────────────────────────────────────
function LogDetail({ log, onClose }: { log: AdjustmentLog; onClose: () => void }) {
  const config = typeConfig[log.type];
  const TypeIcon = config.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", log.type === "add" ? "bg-emerald-100" : log.type === "remove" ? "bg-red-100" : "bg-blue-100")}>
          <TypeIcon className={cn("w-5 h-5", log.type === "add" ? "text-emerald-600" : log.type === "remove" ? "text-red-600" : "text-blue-600")} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{config.label}</p>
          <p className="text-xs text-gray-500">{log.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-gray-500">Product</p>
          <p className="font-medium text-gray-900">{log.productName}</p>
          <p className="text-xs text-gray-400">{log.sku}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Adjusted By</p>
          <p className="font-medium text-gray-900">{log.adjustedBy}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Date</p>
          <p className="font-medium text-gray-900">
            {new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Reason</p>
          <p className="font-medium text-gray-900">{log.reason}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quantity Change</p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{log.quantityBefore}</p>
            <p className="text-xs text-gray-500">Before</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold", config.diffColor)}>
              {config.diffPrefix}{log.difference}
            </span>
            <ArrowUpCircle className={cn("w-5 h-5", log.difference > 0 ? "text-emerald-500" : "text-red-500 rotate-180")} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{log.quantityAfter}</p>
            <p className="text-xs text-gray-500">After</p>
          </div>
        </div>
      </div>

      {log.notes && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{log.notes}</p>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

// ─── Main Stock Adjustments Page ─────────────────────────────────
export default function StockAdjustmentsPage() {
  const [logs, setLogs] = useState<AdjustmentLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingLog, setViewingLog] = useState<AdjustmentLog | null>(null);
  const itemsPerPage = 6;

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = (data: Omit<AdjustmentLog, "id" | "date" | "adjustedBy">) => {
    const newLog: AdjustmentLog = {
      ...data,
      id: `ADJ-${String(logs.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString(),
      adjustedBy: "Admin User",
    };
    setLogs([newLog, ...logs]);
    setIsAddDialogOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manual inventory corrections with full audit trail
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              New Adjustment
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-lg max-w-xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2A3A9D]" />
                Record Stock Adjustment
              </DialogTitle>
            </DialogHeader>
            <AdjustmentForm
              onSave={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Important</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Every adjustment is permanently logged. Always provide a clear reason. 
            When in doubt, use "Inventory correction" and add detailed notes.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by product, SKU, reason, or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] bg-white border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="add">Add Stock</SelectItem>
            <SelectItem value="remove">Remove Stock</SelectItem>
            <SelectItem value="set">Set Quantity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  Adjustment
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  Product
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 text-center">
                  Change
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  Reason
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  Adjusted By
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No adjustments found</p>
                    <p className="text-sm text-gray-400">
                      {searchQuery ? "Try a different search" : "Record your first adjustment"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => {
                  const config = typeConfig[log.type];
                  const TypeIcon = config.icon;

                  return (
                    <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", log.type === "add" ? "bg-emerald-100" : log.type === "remove" ? "bg-red-100" : "bg-blue-100")}>
                            <TypeIcon className={cn("w-4 h-4", log.type === "add" ? "text-emerald-600" : log.type === "remove" ? "text-red-600" : "text-blue-600")} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{config.label}</p>
                            <p className="text-xs text-gray-400">{log.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="text-sm font-medium text-gray-900">{log.productName}</p>
                        <p className="text-xs text-gray-400">{log.sku}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={cn("text-sm font-bold", config.diffColor)}>
                            {config.diffPrefix}{log.difference}
                          </span>
                          <span className="text-xs text-gray-400">
                            {log.quantityBefore} → {log.quantityAfter}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="text-sm text-gray-700">{log.reason}</p>
                        {log.notes && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{log.notes}</p>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#2A3A9D]/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-[#2A3A9D]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{log.adjustedBy}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(log.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingLog(log)}
                          className="text-[#2A3A9D] hover:text-[#252f7a] hover:bg-[#2A3A9D]/5"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* View Detail Dialog */}
      <Dialog
        open={!!viewingLog}
        onOpenChange={(open) => !open && setViewingLog(null)}
      >
        <DialogContent className="min-w-md max-w-lg">
          <DialogHeader>
            <DialogTitle>Adjustment Details</DialogTitle>
          </DialogHeader>
          {viewingLog && (
            <LogDetail log={viewingLog} onClose={() => setViewingLog(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}