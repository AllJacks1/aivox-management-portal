"use client";

import { useState } from "react";
import {
  Monitor,
  Package,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Filter,
  MapPin,
  RefreshCw,
  Boxes,
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
import { COLORS } from "@/styles/colors";

// ─── Types ───────────────────────────────────────────────────────
interface DisplayItem {
  id: string;
  product: string;
  sku: string;
  location: string;
  locationType: "shelf" | "kiosk" | "showroom" | "selling-area";
  displayQty: number;
  minQty: number;
  warehouseQty: number;
  status: "full" | "low" | "empty";
  lastRestocked: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const displayInventory: DisplayItem[] = [
  {
    id: "1",
    product: "Coca-Cola 500ml",
    sku: "CC-500",
    location: "Aisle 3 - Shelf B",
    locationType: "shelf",
    displayQty: 12,
    minQty: 10,
    warehouseQty: 450,
    status: "full",
    lastRestocked: "2026-05-13T08:00:00",
  },
  {
    id: "2",
    product: "Instant Noodles",
    sku: "NOOD-001",
    location: "Aisle 1 - Shelf A",
    locationType: "shelf",
    displayQty: 8,
    minQty: 15,
    warehouseQty: 85,
    status: "low",
    lastRestocked: "2026-05-12T14:00:00",
  },
  {
    id: "3",
    product: "Rice Bags 5kg",
    sku: "RICE-5K",
    location: "Aisle 2 - Shelf C",
    locationType: "shelf",
    displayQty: 3,
    minQty: 8,
    warehouseQty: 12,
    status: "low",
    lastRestocked: "2026-05-11T10:00:00",
  },
  {
    id: "4",
    product: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    location: "Showroom - Tire Section",
    locationType: "showroom",
    displayQty: 0,
    minQty: 4,
    warehouseQty: 0,
    status: "empty",
    lastRestocked: "2026-05-10T09:00:00",
  },
  {
    id: "5",
    product: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    location: "Kiosk - Electronics",
    locationType: "kiosk",
    displayQty: 2,
    minQty: 3,
    warehouseQty: 8,
    status: "low",
    lastRestocked: "2026-05-12T16:00:00",
  },
  {
    id: "6",
    product: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    location: "Showroom - Tire Section",
    locationType: "showroom",
    displayQty: 6,
    minQty: 4,
    warehouseQty: 30,
    status: "full",
    lastRestocked: "2026-05-13T07:30:00",
  },
  {
    id: "7",
    product: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    location: "Selling Area - Premium",
    locationType: "selling-area",
    displayQty: 4,
    minQty: 5,
    warehouseQty: 25,
    status: "low",
    lastRestocked: "2026-05-12T11:00:00",
  },
  {
    id: "8",
    product: "Goodyear Eagle F1",
    sku: "GOOD-F1A-235",
    location: "Aisle 4 - Shelf D",
    locationType: "shelf",
    displayQty: 18,
    minQty: 10,
    warehouseQty: 120,
    status: "full",
    lastRestocked: "2026-05-13T09:00:00",
  },
];

// ─── Status Config ──────────────────────────────────────────────
const statusConfig = {
  full: {
    label: "Full",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: Package,
    barColor: "#10B981",
  },
  low: {
    label: "Running Low",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: AlertTriangle,
    barColor: "#F59E0B",
  },
  empty: {
    label: "Empty",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
    barColor: "#EF4444",
  },
};

const locationTypeLabels: Record<string, string> = {
  shelf: "Store Shelf",
  kiosk: "Kiosk",
  showroom: "Showroom",
  "selling-area": "Selling Area",
};

// ─── Visual Stock Bar ───────────────────────────────────────────
function StockBar({ current, minimum }: { current: number; minimum: number }) {
  const percentage = Math.min((current / minimum) * 100, 100);
  const status = current === 0 ? "empty" : current < minimum ? "low" : "full";
  const color = statusConfig[status].barColor;

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between text-[10px] mb-1"
        style={{ color: COLORS.textMuted }}
      >
        <span>
          {current} / {minimum} min
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            opacity: current === 0 ? 0.3 : 1,
          }}
        />
      </div>
    </div>
  );
}

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

// ─── Main Page ──────────────────────────────────────────────────
export default function DisplayInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Stats
  const onDisplay = displayInventory.length;
  const lowStock = displayInventory.filter((i) => i.status === "low").length;
  const outOfDisplay = displayInventory.filter(
    (i) => i.status === "empty",
  ).length;
  const restockNeeded = displayInventory.filter(
    (i) => i.displayQty < i.minQty,
  ).length;

  // Filter
  const filtered = displayInventory.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesLocation =
      locationFilter === "all" || item.locationType === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

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
            Display Inventory
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
            Tracks what products are currently displayed in store shelves,
            kiosks, showrooms, and selling areas.
          </p>
        </div>
        <Button
          className="gap-2 text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4" />
          Add to Display
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Products on Display"
          value={onDisplay.toString()}
          subtext="Active display locations"
          icon={<Monitor className="w-5 h-5" />}
          color={COLORS.primary}
          bgColor={`${COLORS.primary}15`}
        />
        <KpiCard
          label="Low Display Stocks"
          value={lowStock.toString()}
          subtext="Below minimum threshold"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="#F59E0B"
          bgColor="#F59E0B15"
        />
        <KpiCard
          label="Out of Display"
          value={outOfDisplay.toString()}
          subtext="Empty shelves need restock"
          icon={<XCircle className="w-5 h-5" />}
          color="#EF4444"
          bgColor="#EF444415"
        />
        <KpiCard
          label="Restock Requests"
          value={restockNeeded.toString()}
          subtext="Items below minimum qty"
          icon={<RefreshCw className="w-5 h-5" />}
          color="#8B5CF6"
          bgColor="#8B5CF615"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by product, SKU, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200"
            style={{ borderColor: "#E2E8F0", color: COLORS.textPrimary }}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className=" sm:w-[160px] bg-white border-gray-200"
            style={{ borderColor: "#E2E8F0" }}
          >
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="low">Running Low</SelectItem>
            <SelectItem value="empty">Empty</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger
            className="sm:w-[180px] bg-white border-gray-200"
            style={{ borderColor: "#E2E8F0" }}
          >
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="shelf">Store Shelf</SelectItem>
            <SelectItem value="kiosk">Kiosk</SelectItem>
            <SelectItem value="showroom">Showroom</SelectItem>
            <SelectItem value="selling-area">Selling Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card
        className="border-gray-100 shadow-sm overflow-hidden"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                  Stock Level
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Display Qty
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Min Qty
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p
                      className="font-medium"
                      style={{ color: COLORS.textSecondary }}
                    >
                      No display items found
                    </p>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const config = statusConfig[item.status];
                  const StatusIcon = config.icon;
                  const needsRestock = item.displayQty < item.minQty;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: needsRestock
                                ? "#EF444415"
                                : "#10B98115",
                              color: needsRestock ? "#EF4444" : "#10B981",
                            }}
                          >
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: COLORS.textPrimary }}
                            >
                              {item.product}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: COLORS.textMuted }}
                            >
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <div>
                            <p
                              className="text-sm"
                              style={{ color: COLORS.textPrimary }}
                            >
                              {item.location}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: COLORS.textMuted }}
                            >
                              {locationTypeLabels[item.locationType]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StockBar
                          current={item.displayQty}
                          minimum={item.minQty}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className="text-sm font-bold"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {item.displayQty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className="text-sm"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {item.minQty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={cn("font-medium", config.badge)}
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mr-1.5",
                              config.dot,
                            )}
                          />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {needsRestock ? (
                          <Button
                            size="sm"
                            className="gap-1.5 text-white hover:opacity-90"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Restock
                          </Button>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: COLORS.textMuted }}
                          >
                            Warehouse: {item.warehouseQty}
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
    </div>
  );
}
