"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Package,
  Monitor,
  Warehouse,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { COLORS } from "@/styles/colors";

// ─── Types ───────────────────────────────────────────────────────
type PulloutStatus = "pending" | "completed" | "cancelled";
type PulloutReason = "damaged" | "expired" | "phase-out" | "replacement" | "overstock" | "return-to-warehouse";
type Destination = "disposal" | "warehouse";

interface PulloutRequest {
  id: string;
  product: string;
  sku: string;
  quantity: number;
  reason: PulloutReason;
  destination: Destination;
  displayLocation: string;
  processedBy: string;
  date: string;
  status: PulloutStatus;
  completedAt?: string;
  notes?: string;
}

interface StockMovementLog {
  id: string;
  pulloutId: string;
  product: string;
  quantity: number;
  from: string;
  to: string;
  type: "pullout";
  timestamp: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialPullouts: PulloutRequest[] = [
  {
    id: "PO-2026-0042",
    product: "Coca-Cola 500ml",
    sku: "CC-500",
    quantity: 12,
    reason: "expired",
    destination: "disposal",
    displayLocation: "Aisle 3 - Shelf B",
    processedBy: "John Staff",
    date: "2026-05-13T10:00:00",
    status: "completed",
    completedAt: "2026-05-13T10:15:00",
    notes: "Batch expired May 10, 2026",
  },
  {
    id: "PO-2026-0043",
    product: "Instant Noodles",
    sku: "NOOD-001",
    quantity: 5,
    reason: "damaged",
    destination: "disposal",
    displayLocation: "Aisle 1 - Shelf A",
    processedBy: "Sarah Staff",
    date: "2026-05-13T11:30:00",
    status: "pending",
    notes: "Crushed packaging from shelf collapse",
  },
  {
    id: "PO-2026-0044",
    product: "Rice Bags 5kg",
    sku: "RICE-5K",
    quantity: 8,
    reason: "overstock",
    destination: "warehouse",
    displayLocation: "Aisle 2 - Shelf C",
    processedBy: "Mike Staff",
    date: "2026-05-13T13:00:00",
    status: "pending",
  },
  {
    id: "PO-2026-0045",
    product: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    quantity: 2,
    reason: "replacement",
    destination: "warehouse",
    displayLocation: "Showroom - Tire Section",
    processedBy: "Lisa Staff",
    date: "2026-05-12T09:00:00",
    status: "completed",
    completedAt: "2026-05-12T09:10:00",
    notes: "Replacing with newer model",
  },
  {
    id: "PO-2026-0046",
    product: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    quantity: 1,
    reason: "phase-out",
    destination: "warehouse",
    displayLocation: "Kiosk - Electronics",
    processedBy: "Tom Staff",
    date: "2026-05-12T14:00:00",
    status: "cancelled",
    notes: "Decision reversed — keep on display",
  },
  {
    id: "PO-2026-0047",
    product: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    quantity: 3,
    reason: "return-to-warehouse",
    destination: "warehouse",
    displayLocation: "Selling Area - Premium",
    processedBy: "John Staff",
    date: "2026-05-11T10:00:00",
    status: "completed",
    completedAt: "2026-05-11T10:05:00",
  },
];

// ─── Config ─────────────────────────────────────────────────────
const reasonConfig: Record<PulloutReason, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  damaged: { label: "Damaged", color: "#EF4444", bgColor: "#EF444415", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  expired: { label: "Expired", color: "#F59E0B", bgColor: "#F59E0B15", icon: <Clock className="w-3.5 h-3.5" /> },
  "phase-out": { label: "Phase-out", color: "#8B5CF6", bgColor: "#8B5CF615", icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  replacement: { label: "Replacement", color: "#3B82F6", bgColor: "#3B82F615", icon: <RotateCcw className="w-3.5 h-3.5" /> },
  overstock: { label: "Overstock", color: "#64748B", bgColor: "#64748B15", icon: <Package className="w-3.5 h-3.5" /> },
  "return-to-warehouse": { label: "Return to WH", color: "#10B981", bgColor: "#10B98115", icon: <Warehouse className="w-3.5 h-3.5" /> },
};

const destinationConfig: Record<Destination, { label: string; icon: React.ReactNode; color: string }> = {
  disposal: { label: "Disposal", icon: <Trash2 className="w-4 h-4" />, color: "#EF4444" },
  warehouse: { label: "Warehouse", icon: <Warehouse className="w-4 h-4" />, color: "#3B82F6" },
};

const statusConfig = {
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, iconColor: "text-amber-500" },
  completed: { label: "Completed", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, iconColor: "text-emerald-500" },
  cancelled: { label: "Cancelled", badge: "bg-gray-50 text-gray-500 border-gray-200", icon: XCircle, iconColor: "text-gray-400" },
};

// ─── KPI Cards ──────────────────────────────────────────────────
function KpiCard({ label, value, subtext, icon, color, bgColor }: { label: string; value: string; subtext: string; icon: React.ReactNode; color: string; bgColor: string }) {
  return (
    <Card className="border-gray-100 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: COLORS.cardBg }}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>{value}</p>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>{subtext}</p>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bgColor, color }}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── New Pullout Dialog ─────────────────────────────────────────
function NewPulloutDialog({ onCreate }: { onCreate: (data: Omit<PulloutRequest, "id" | "date" | "status" | "completedAt">) => void }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState<PulloutReason>("damaged");
  const [destination, setDestination] = useState<Destination>("disposal");
  const [displayLocation, setDisplayLocation] = useState("");
  const [processedBy, setProcessedBy] = useState("Staff User");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onCreate({ product, sku, quantity, reason, destination, displayLocation, processedBy, notes });
    setOpen(false);
    setProduct(""); setSku(""); setQuantity(1); setReason("damaged"); setDestination("disposal"); setDisplayLocation(""); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-white hover:opacity-90" style={{ backgroundColor: COLORS.primary }}>
          <Plus className="w-4 h-4" /> New Pullout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" style={{ color: COLORS.primary }} />
            Create Pullout Request
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product *</Label>
              <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Coca-Cola 500ml" />
            </div>
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. CC-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Display Location *</Label>
              <Input value={displayLocation} onChange={(e) => setDisplayLocation(e.target.value)} placeholder="e.g. Aisle 3 - Shelf B" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reason *</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as PulloutReason)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="phase-out">Phase-out</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                  <SelectItem value="return-to-warehouse">Return to Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination *</Label>
              <Select value={destination} onValueChange={(v) => setDestination(v as Destination)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="disposal">Disposal</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Processed By *</Label>
            <Input value={processedBy} onChange={(e) => setProcessedBy(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional context..." />
          </div>
          <div className="p-3 rounded-md bg-red-50 border border-red-100">
            <p className="text-sm text-red-700"><strong>Important:</strong> This will create a stock movement log. Display inventory will decrease. Every pullout is tracked.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="gap-2 text-white hover:opacity-90" style={{ backgroundColor: COLORS.primary }}>
            <ArrowUpRight className="w-4 h-4" /> Create Pullout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function PulloutsPage() {
  const [pullouts, setPullouts] = useState<PulloutRequest[]>(initialPullouts);
  const [logs, setLogs] = useState<StockMovementLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");

  // Stats
  const pendingCount = pullouts.filter((p) => p.status === "pending").length;
  const completedToday = pullouts.filter((p) => p.status === "completed" && p.completedAt?.startsWith("2026-05-13")).length;
  const toDisposal = pullouts.filter((p) => p.status === "completed" && p.destination === "disposal").reduce((sum, p) => sum + p.quantity, 0);
  const toWarehouse = pullouts.filter((p) => p.status === "completed" && p.destination === "warehouse").reduce((sum, p) => sum + p.quantity, 0);

  // Filter
  const filtered = pullouts.filter((p) => {
    const matchesSearch = p.product.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesReason = reasonFilter === "all" || p.reason === reasonFilter;
    const matchesDestination = destinationFilter === "all" || p.destination === destinationFilter;
    return matchesSearch && matchesStatus && matchesReason && matchesDestination;
  });

  const handleCreate = (data: Omit<PulloutRequest, "id" | "date" | "status" | "completedAt">) => {
    const newPullout: PulloutRequest = {
      ...data,
      id: `PO-2026-${String(pullouts.length + 48).padStart(4, "0")}`,
      date: new Date().toISOString(),
      status: "pending",
    };
    setPullouts([newPullout, ...pullouts]);
  };

  const handleComplete = (id: string) => {
    const pullout = pullouts.find((p) => p.id === id);
    if (!pullout) return;

    setPullouts(pullouts.map((p) => p.id === id ? { ...p, status: "completed" as const, completedAt: new Date().toISOString() } : p));

    // Create movement log — NEVER let stock change without a log
    const newLog: StockMovementLog = {
      id: `MOV-${String(logs.length + 4).padStart(3, "0")}`,
      pulloutId: id,
      product: pullout.product,
      quantity: pullout.quantity,
      from: pullout.displayLocation,
      to: pullout.destination === "disposal" ? "Disposal" : "Main Warehouse",
      type: "pullout",
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
  };

  const handleCancel = (id: string) => {
    setPullouts(pullouts.map((p) => p.id === id ? { ...p, status: "cancelled" as const } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-screen" style={{ backgroundColor: COLORS.bgMain }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.textPrimary }}>Pullouts</h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>Remove products from display. Every decrease creates a stock movement log.</p>
        </div>
        <NewPulloutDialog onCreate={handleCreate} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Pending" value={pendingCount.toString()} subtext="Awaiting processing" icon={<Clock className="w-5 h-5" />} color="#F59E0B" bgColor="#F59E0B15" />
        <KpiCard label="Completed Today" value={completedToday.toString()} subtext="Pullouts processed" icon={<CheckCircle2 className="w-5 h-5" />} color="#10B981" bgColor="#10B98115" />
        <KpiCard label="To Disposal" value={toDisposal.toString()} subtext="Units discarded" icon={<Trash2 className="w-5 h-5" />} color="#EF4444" bgColor="#EF444415" />
        <KpiCard label="To Warehouse" value={toWarehouse.toString()} subtext="Units returned" icon={<Warehouse className="w-5 h-5" />} color="#3B82F6" bgColor="#3B82F615" />
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by product, SKU, or reference..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white border-gray-200" style={{ borderColor: "#E2E8F0", color: COLORS.textPrimary }} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="lg:w-[140px] bg-white border-gray-200" style={{ borderColor: "#E2E8F0" }}>
            <Filter className="w-4 h-4 mr-2 text-gray-500" /><SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={reasonFilter} onValueChange={setReasonFilter}>
          <SelectTrigger className="lg:w-[160px] bg-white border-gray-200" style={{ borderColor: "#E2E8F0" }}>
            <FileText className="w-4 h-4 mr-2 text-gray-500" /><SelectValue placeholder="Reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reasons</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="phase-out">Phase-out</SelectItem>
            <SelectItem value="replacement">Replacement</SelectItem>
            <SelectItem value="overstock">Overstock</SelectItem>
            <SelectItem value="return-to-warehouse">Return to WH</SelectItem>
          </SelectContent>
        </Select>
        <Select value={destinationFilter} onValueChange={setDestinationFilter}>
          <SelectTrigger className="lg:w-[160px] bg-white border-gray-200" style={{ borderColor: "#E2E8F0" }}>
            <ArrowRight className="w-4 h-4 mr-2 text-gray-500" /><SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            <SelectItem value="disposal">Disposal</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pullouts Table */}
      <Card className="border-gray-100 shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.cardBg }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Qty</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">From → To</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">By</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <ArrowUpRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium" style={{ color: COLORS.textSecondary }}>No pullouts found</p>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>Create a new pullout request</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const config = statusConfig[p.status];
                  const StatusIcon = config.icon;
                  const reasonCfg = reasonConfig[p.reason];
                  const destCfg = destinationConfig[p.destination];

                  return (
                    <tr key={p.id} className={cn("hover:bg-gray-50/50 transition-colors", p.status === "pending" && "bg-amber-50/20")}>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{p.id}</p>
                        <p className="text-xs" style={{ color: COLORS.textMuted }}>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{p.product}</p>
                            <p className="text-xs" style={{ color: COLORS.textMuted }}>{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>{p.quantity}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: reasonCfg.bgColor, color: reasonCfg.color }}>
                            {reasonCfg.icon}
                          </div>
                          <span className="text-xs font-medium" style={{ color: reasonCfg.color }}>{reasonCfg.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Monitor className="w-3.5 h-3.5 text-gray-400" />
                          <span style={{ color: COLORS.textSecondary }}>{p.displayLocation}</span>
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                          <span className="flex items-center gap-1" style={{ color: destCfg.color }}>
                            {destCfg.icon}
                            {destCfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm" style={{ color: COLORS.textSecondary }}>{p.processedBy}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className={cn("font-medium", config.badge)}>
                          <StatusIcon className={cn("w-3 h-3 mr-1", config.iconColor)} />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" className="gap-1.5 text-white hover:opacity-90" style={{ backgroundColor: COLORS.primary }} onClick={() => handleComplete(p.id)}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCancel(p.id)} className="h-8 w-8 text-gray-400 hover:text-red-500">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : p.status === "completed" ? (
                          <span className="text-xs" style={{ color: COLORS.textMuted }}>
                            Done {p.completedAt && new Date(p.completedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: COLORS.textMuted }}>Cancelled</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}