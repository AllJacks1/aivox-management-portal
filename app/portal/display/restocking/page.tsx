"use client";

import { useState } from "react";
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Package,
  Warehouse,
  Monitor,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
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
type RestockStatus = "pending" | "completed" | "cancelled";

interface RestockRequest {
  id: string;
  product: string;
  sku: string;
  quantityRequested: number;
  quantityReleased: number;
  sourceWarehouse: string;
  destinationDisplay: string;
  requestedBy: string;
  date: string;
  status: RestockStatus;
  completedAt?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialRestocks: RestockRequest[] = [
  {
    id: "RS-2026-0101",
    product: "Instant Noodles",
    sku: "NOOD-001",
    quantityRequested: 20,
    quantityReleased: 20,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Aisle 1 - Shelf A",
    requestedBy: "John Staff",
    date: "2026-05-13T09:00:00",
    status: "completed",
    completedAt: "2026-05-13T09:15:00",
  },
  {
    id: "RS-2026-0102",
    product: "Rice Bags 5kg",
    sku: "RICE-5K",
    quantityRequested: 15,
    quantityReleased: 0,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Aisle 2 - Shelf C",
    requestedBy: "Sarah Staff",
    date: "2026-05-13T10:30:00",
    status: "pending",
  },
  {
    id: "RS-2026-0103",
    product: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    quantityRequested: 4,
    quantityReleased: 0,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Showroom - Tire Section",
    requestedBy: "Mike Staff",
    date: "2026-05-13T11:00:00",
    status: "pending",
  },
  {
    id: "RS-2026-0104",
    product: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    quantityRequested: 3,
    quantityReleased: 3,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Kiosk - Electronics",
    requestedBy: "Lisa Staff",
    date: "2026-05-12T14:00:00",
    status: "completed",
    completedAt: "2026-05-12T14:10:00",
  },
  {
    id: "RS-2026-0105",
    product: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    quantityRequested: 6,
    quantityReleased: 0,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Selling Area - Premium",
    requestedBy: "Tom Staff",
    date: "2026-05-12T16:00:00",
    status: "cancelled",
  },
  {
    id: "RS-2026-0106",
    product: "Coca-Cola 500ml",
    sku: "CC-500",
    quantityRequested: 50,
    quantityReleased: 50,
    sourceWarehouse: "Main Warehouse",
    destinationDisplay: "Aisle 3 - Shelf B",
    requestedBy: "John Staff",
    date: "2026-05-12T08:00:00",
    status: "completed",
    completedAt: "2026-05-12T08:05:00",
  },
];

const lowStockItems = [
  {
    product: "Instant Noodles",
    sku: "NOOD-001",
    displayQty: 8,
    minQty: 15,
    warehouseQty: 85,
    location: "Aisle 1 - Shelf A",
  },
  {
    product: "Rice Bags 5kg",
    sku: "RICE-5K",
    displayQty: 3,
    minQty: 8,
    warehouseQty: 12,
    location: "Aisle 2 - Shelf C",
  },
  {
    product: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    displayQty: 0,
    minQty: 4,
    warehouseQty: 0,
    location: "Showroom - Tire Section",
  },
  {
    product: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    displayQty: 2,
    minQty: 3,
    warehouseQty: 8,
    location: "Kiosk - Electronics",
  },
  {
    product: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    displayQty: 4,
    minQty: 5,
    warehouseQty: 25,
    location: "Selling Area - Premium",
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
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-gray-50 text-gray-500 border-gray-200",
    icon: XCircle,
    iconColor: "text-gray-400",
  },
};

// ─── KPI Cards ──────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  subtext,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <Card
      className="border-gray-100 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              {label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              {value}
            </p>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              {subtext}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor, color }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick Restock Dialog ─────────────────────────────────────
function QuickRestockDialog({
  item,
  onRestock,
}: {
  item: (typeof lowStockItems)[0];
  onRestock: (data: { quantity: number; requestedBy: string }) => void;
}) {
  const [quantity, setQuantity] = useState(
    Math.min(item.minQty - item.displayQty + 5, item.warehouseQty),
  );
  const [requestedBy, setRequestedBy] = useState("Staff User");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onRestock({ quantity, requestedBy });
    setOpen(false);
  };
  const maxQty = item.warehouseQty;
  const suggestedQty = item.minQty - item.displayQty + 5;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5 text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Zap className="w-3.5 h-3.5" /> Restock
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" style={{ color: COLORS.primary }} />
            Quick Restock: {item.product}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Flow visualization */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-1">
                <Warehouse className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-xs font-medium text-gray-700">
                {item.warehouseQty} in Warehouse
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex-1 text-center">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <Monitor
                  className="w-5 h-5"
                  style={{ color: COLORS.primary }}
                />
              </div>
              <p className="text-xs font-medium text-gray-700">
                {item.displayQty} on Display
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quantity to Move</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={maxQty}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(parseInt(e.target.value) || 0, maxQty))
                }
                className="text-center font-bold"
              />
              <div className="text-xs text-gray-500 whitespace-nowrap">
                Suggested: {suggestedQty}
                <br />
                Max: {maxQty}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requested By</Label>
            <Input
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Staff name"
            />
          </div>

          <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
            <p className="text-sm text-amber-700">
              <strong>Fast workflow:</strong> This creates a restock request and
              immediately completes it. Warehouse stock decreases, display stock
              increases.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 text-white hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            <RefreshCw className="w-4 h-4" /> Complete Restock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function RestockingPage() {
  const [restocks, setRestocks] = useState<RestockRequest[]>(initialRestocks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Stats
  const pendingCount = restocks.filter((r) => r.status === "pending").length;
  const completedToday = restocks.filter(
    (r) => r.status === "completed" && r.completedAt?.startsWith("2026-05-13"),
  ).length;
  const totalMoved = restocks
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.quantityReleased, 0);
  const cancelledCount = restocks.filter(
    (r) => r.status === "cancelled",
  ).length;

  // Filter
  const filtered = restocks.filter((r) => {
    const matchesSearch =
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destinationDisplay.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleComplete = (id: string) => {
    setRestocks(
      restocks.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "completed" as const,
              quantityReleased: r.quantityRequested,
              completedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setRestocks(
      restocks.map((r) =>
        r.id === id ? { ...r, status: "cancelled" as const } : r,
      ),
    );
  };

  const handleQuickRestock = (
    item: (typeof lowStockItems)[0],
    data: { quantity: number; requestedBy: string },
  ) => {
    const newRestock: RestockRequest = {
      id: `RS-2026-${String(restocks.length + 101).padStart(4, "0")}`,
      product: item.product,
      sku: item.sku,
      quantityRequested: data.quantity,
      quantityReleased: data.quantity,
      sourceWarehouse: "Main Warehouse",
      destinationDisplay: item.location,
      requestedBy: data.requestedBy,
      date: new Date().toISOString(),
      status: "completed",
      completedAt: new Date().toISOString(),
    };
    setRestocks([newRestock, ...restocks]);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-screen"
      style={{ backgroundColor: COLORS.bgMain }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Restocking
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
            Move products from warehouse → display area. Fast workflow, no
            approvals.
          </p>
        </div>
        <Button
          className="gap-2 text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" /> New Restock Request
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Pending"
          value={pendingCount.toString()}
          subtext="Awaiting completion"
          icon={<Clock className="w-5 h-5" />}
          color="#F59E0B"
          bgColor="#F59E0B15"
        />
        <KpiCard
          label="Completed Today"
          value={completedToday.toString()}
          subtext="Restocks finished"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="#10B981"
          bgColor="#10B98115"
        />
        <KpiCard
          label="Total Moved"
          value={totalMoved.toString()}
          subtext="Units restocked"
          icon={<ArrowRight className="w-5 h-5" />}
          color={COLORS.primary}
          bgColor={`${COLORS.primary}15`}
        />
        <KpiCard
          label="Cancelled"
          value={cancelledCount.toString()}
          subtext="Aborted restocks"
          icon={<XCircle className="w-5 h-5" />}
          color="#94A3B8"
          bgColor="#F1F5F9"
        />
      </div>

      {/* Quick Restock Section — Low Stock Items */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            Quick Restock — Low Display Items
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {lowStockItems.map((item) => (
            <Card
              key={item.sku}
              className="border-gray-100 shadow-sm transition-all hover:shadow-md"
              style={{ backgroundColor: COLORS.cardBg }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                  >
                    Low Stock
                  </Badge>
                </div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: COLORS.textPrimary }}
                >
                  {item.product}
                </p>
                <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>
                  {item.sku}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: COLORS.textSecondary }}>Display</span>
                    <span className="font-bold text-amber-600">
                      {item.displayQty} / {item.minQty} min
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${Math.min((item.displayQty / item.minQty) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: COLORS.textSecondary }}>
                      Warehouse
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {item.warehouseQty} available
                    </span>
                  </div>
                </div>

                <QuickRestockDialog
                  item={item}
                  onRestock={(data) => handleQuickRestock(item, data)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Restock History Table */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            Restock History
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search restocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-gray-200"
                style={{ borderColor: "#E2E8F0", color: COLORS.textPrimary }}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full sm:w-[160px] bg-white border-gray-200"
                style={{ borderColor: "#E2E8F0" }}
              >
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
        </div>

        <Card
          className="border-gray-100 shadow-sm overflow-hidden"
          style={{ backgroundColor: COLORS.cardBg }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                    Requested
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                    Released
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    From → To
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    By
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p
                        className="font-medium"
                        style={{ color: COLORS.textSecondary }}
                      >
                        No restocks found
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        Create a quick restock from the cards above
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const config = statusConfig[r.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr
                        key={r.id}
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors",
                          r.status === "pending" && "bg-amber-50/20",
                        )}
                      >
                        <td className="py-3.5 px-4">
                          <p
                            className="text-sm font-medium"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {r.id}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: COLORS.textMuted }}
                          >
                            {new Date(r.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: COLORS.textPrimary }}
                              >
                                {r.product}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: COLORS.textMuted }}
                              >
                                {r.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className="text-sm font-bold"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {r.quantityRequested}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              r.quantityReleased > 0
                                ? "text-emerald-600"
                                : "text-gray-400",
                            )}
                          >
                            {r.quantityReleased > 0 ? r.quantityReleased : "—"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Warehouse className="w-3.5 h-3.5 text-gray-400" />
                            <span style={{ color: COLORS.textSecondary }}>
                              {r.sourceWarehouse}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-300" />
                            <Monitor className="w-3.5 h-3.5 text-gray-400" />
                            <span style={{ color: COLORS.textSecondary }}>
                              {r.destinationDisplay}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className="text-sm"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {r.requestedBy}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={cn("font-medium", config.badge)}
                          >
                            <StatusIcon
                              className={cn("w-3 h-3 mr-1", config.iconColor)}
                            />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {r.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                className="gap-1.5 text-white hover:opacity-90"
                                style={{ backgroundColor: COLORS.primary }}
                                onClick={() => handleComplete(r.id)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                Complete
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCancel(r.id)}
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : r.status === "completed" ? (
                            <span
                              className="text-xs"
                              style={{ color: COLORS.textMuted }}
                            >
                              Done{" "}
                              {r.completedAt &&
                                new Date(r.completedAt).toLocaleTimeString(
                                  "en-US",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                            </span>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: COLORS.textMuted }}
                            >
                              Cancelled
                            </span>
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
      </section>
    </div>
  );
}
