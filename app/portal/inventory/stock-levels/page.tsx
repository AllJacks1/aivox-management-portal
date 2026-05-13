"use client";

import { useState, useMemo } from "react";
import {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { COLORS } from "@/styles/colors";
import Pagination from "@/components/sections/Pagination";

// ─── Types ───────────────────────────────────────────────────────
interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
}

// ─── Mock Data ──────────────────────────────────────────────────
const stockData: StockItem[] = [
  { id: "1", name: "Michelin Pilot Sport 4", sku: "MICH-PS4-225", category: "Summer Tires", currentStock: 45, minimumStock: 10, unit: "pcs", unitCost: 180 },
  { id: "2", name: "Bridgestone Potenza RE-71R", sku: "BRID-RE71-245", category: "Performance Tires", currentStock: 8, minimumStock: 12, unit: "pcs", unitCost: 220 },
  { id: "3", name: "Goodyear Eagle F1 Asymmetric", sku: "GOOD-F1A-235", category: "Summer Tires", currentStock: 0, minimumStock: 8, unit: "pcs", unitCost: 195 },
  { id: "4", name: "Pirelli P Zero", sku: "PIRE-PZ-255", category: "Performance Tires", currentStock: 23, minimumStock: 15, unit: "pcs", unitCost: 250 },
  { id: "5", name: "Continental SportContact 7", sku: "CONT-SC7-245", category: "Ultra High Performance", currentStock: 0, minimumStock: 5, unit: "pcs", unitCost: 210 },
  { id: "6", name: "Yokohama Advan Neova AD09", sku: "YOKO-AD09-225", category: "Track Tires", currentStock: 67, minimumStock: 20, unit: "pcs", unitCost: 175 },
  { id: "7", name: "Hankook Ventus V12 Evo2", sku: "HANK-V12-235", category: "Summer Tires", currentStock: 34, minimumStock: 10, unit: "pcs", unitCost: 145 },
  { id: "8", name: "Toyo Proxes R888R", sku: "TOYO-R888-255", category: "Track Tires", currentStock: 5, minimumStock: 8, unit: "pcs", unitCost: 280 },
  { id: "9", name: "Nitto NT05", sku: "NITT-NT05-245", category: "Performance Tires", currentStock: 0, minimumStock: 6, unit: "pcs", unitCost: 230 },
  { id: "10", name: "BFGoodrich g-Force Sport", sku: "BFG-GFS-225", category: "Summer Tires", currentStock: 52, minimumStock: 15, unit: "pcs", unitCost: 160 },
  { id: "11", name: "Falken Azenis RT615K+", sku: "FALK-RT61-255", category: "Track Tires", currentStock: 3, minimumStock: 10, unit: "pcs", unitCost: 190 },
  { id: "12", name: "Kumho Ecsta PS91", sku: "KUMH-PS91-245", category: "Ultra High Performance", currentStock: 19, minimumStock: 8, unit: "pcs", unitCost: 170 },
];

// ─── Status Logic ─────────────────────────────────────────────
type StockStatus = "healthy" | "low" | "critical";

function getStockStatus(current: number, minimum: number): StockStatus {
  if (current === 0) return "critical";
  if (current <= minimum) return "low";
  return "healthy";
}

const statusConfig = {
  healthy: {
    label: "Healthy",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  low: {
    label: "Low Stock",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  critical: {
    label: "Out of Stock",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
};

// ─── Components ─────────────────────────────────────────────────
function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : TrendingUp;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          <div className="flex items-center gap-1.5">
            {trend && (
              <span className={cn(
                "inline-flex items-center text-xs font-medium",
                trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-500"
              )}>
                <TrendIcon className="w-3.5 h-3.5 mr-0.5" />
                {subtext}
              </span>
            )}
            {!trend && <span className="text-xs text-gray-400">{subtext}</span>}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

function StockBar({ current, minimum }: { current: number; minimum: number }) {
  const max = Math.max(current, minimum * 2, 10);
  const percentage = Math.min((current / max) * 100, 100);
  const status = getStockStatus(current, minimum);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-600 font-medium">{current} / {minimum} min</span>
        <span className={cn("font-medium", status === "healthy" ? "text-emerald-600" : status === "low" ? "text-amber-600" : "text-red-600")}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", statusConfig[status].bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Stock Levels Page ─────────────────────────────────────
export default function StockLevelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when filters change
  useState(() => setCurrentPage(1));

  // Filter logic
  const filteredItems = useMemo(() => {
    let result = [...stockData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (item) => getStockStatus(item.currentStock, item.minimumStock) === statusFilter
      );
    }

    return result;
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const totalProducts = stockData.length;
    const totalValue = stockData.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
    const lowStock = stockData.filter((item) => getStockStatus(item.currentStock, item.minimumStock) === "low").length;
    const outOfStock = stockData.filter((item) => getStockStatus(item.currentStock, item.minimumStock) === "critical").length;

    return { totalProducts, totalValue, lowStock, outOfStock };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stock Levels</h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time visibility into your inventory health
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          subtext="Active SKUs tracked"
          icon={Package}
          iconBg="#EFF6FF"
          iconColor="#1E3A8A"
        />
        <StatCard
          title="Inventory Value"
          value={`$${(stats.totalValue / 1000).toFixed(1)}k`}
          subtext={`$${stats.totalValue.toLocaleString()} total`}
          icon={DollarSign}
          iconBg="#F0FDF4"
          iconColor="#10B981"
          trend="up"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock.toString()}
          subtext="Below minimum threshold"
          icon={AlertTriangle}
          iconBg="#FFFBEB"
          iconColor="#D97706"
          trend={stats.lowStock > 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock.toString()}
          subtext="Require immediate restock"
          icon={XCircle}
          iconBg="#FEF2F2"
          iconColor="#DC2626"
          trend={stats.outOfStock > 0 ? "down" : "neutral"}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by product, SKU, or category..."
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
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="critical">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                  Stock Level
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No items found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const status = getStockStatus(item.currentStock, item.minimumStock);
                  const config = statusConfig[status];

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        status === "critical" && "bg-red-50/30"
                      )}
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.currentStock} {item.unit} in warehouse
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {item.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StockBar current={item.currentStock} minimum={item.minimumStock} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className={cn("font-medium", config.badge)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.dot)} />
                          {config.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}