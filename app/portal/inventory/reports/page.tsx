"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Clock,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  ShoppingCart,
  Archive,
  MoveRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "@/styles/colors";

// ─── Types ───────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  unitCost: number;
  sellingPrice: number;
  totalSold: number;
  lastSoldDate?: string;
  movement: {
    additions: number;
    deductions: number;
    adjustments: number;
    transfers: number;
  };
}

// ─── Mock Data ──────────────────────────────────────────────────
const products: Product[] = [
  {
    id: "1",
    name: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    category: "Summer Tires",
    currentStock: 45,
    unitCost: 180,
    sellingPrice: 299.99,
    totalSold: 142,
    lastSoldDate: "2026-05-12",
    movement: { additions: 200, deductions: 155, adjustments: -5, transfers: 0 },
  },
  {
    id: "2",
    name: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    category: "Performance Tires",
    currentStock: 8,
    unitCost: 220,
    sellingPrice: 349.99,
    totalSold: 98,
    lastSoldDate: "2026-05-11",
    movement: { additions: 150, deductions: 142, adjustments: -4, transfers: 0 },
  },
  {
    id: "3",
    name: "Goodyear Eagle F1 Asymmetric",
    sku: "GOOD-F1A-235",
    category: "Summer Tires",
    currentStock: 0,
    unitCost: 195,
    sellingPrice: 319.99,
    totalSold: 87,
    lastSoldDate: "2026-05-10",
    movement: { additions: 120, deductions: 107, adjustments: -5, transfers: 0 },
  },
  {
    id: "4",
    name: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    category: "Performance Tires",
    currentStock: 23,
    unitCost: 250,
    sellingPrice: 399.99,
    totalSold: 76,
    lastSoldDate: "2026-05-09",
    movement: { additions: 110, deductions: 87, adjustments: 0, transfers: 0 },
  },
  {
    id: "5",
    name: "Continental SportContact 7",
    sku: "CONT-SC7-245",
    category: "Ultra High Performance",
    currentStock: 0,
    unitCost: 210,
    sellingPrice: 359.99,
    totalSold: 65,
    lastSoldDate: "2026-05-08",
    movement: { additions: 90, deductions: 85, adjustments: -5, transfers: 0 },
  },
  {
    id: "6",
    name: "Yokohama Advan Neova AD09",
    sku: "YOKO-AD09-225",
    category: "Track Tires",
    currentStock: 67,
    unitCost: 175,
    sellingPrice: 279.99,
    totalSold: 45,
    lastSoldDate: "2026-04-20",
    movement: { additions: 100, deductions: 45, adjustments: 0, transfers: 0 },
  },
  {
    id: "7",
    name: "Hankook Ventus V12 Evo2",
    sku: "HANK-V12-235",
    category: "Summer Tires",
    currentStock: 34,
    unitCost: 145,
    sellingPrice: 239.99,
    totalSold: 112,
    lastSoldDate: "2026-05-12",
    movement: { additions: 180, deductions: 146, adjustments: 0, transfers: 0 },
  },
  {
    id: "8",
    name: "Toyo Proxes R888R",
    sku: "TOYO-R888-255",
    category: "Track Tires",
    currentStock: 5,
    unitCost: 280,
    sellingPrice: 449.99,
    totalSold: 23,
    lastSoldDate: "2026-04-15",
    movement: { additions: 50, deductions: 23, adjustments: 0, transfers: 0 },
  },
  {
    id: "9",
    name: "Nitto NT05",
    sku: "NITT-NT05-245",
    category: "Performance Tires",
    currentStock: 0,
    unitCost: 230,
    sellingPrice: 379.99,
    totalSold: 34,
    lastSoldDate: "2026-03-28",
    movement: { additions: 60, deductions: 34, adjustments: -5, transfers: 0 },
  },
  {
    id: "10",
    name: "BFGoodrich g-Force Sport",
    sku: "BFG-GFS-225",
    category: "Summer Tires",
    currentStock: 52,
    unitCost: 160,
    sellingPrice: 259.99,
    totalSold: 89,
    lastSoldDate: "2026-05-11",
    movement: { additions: 160, deductions: 89, adjustments: 0, transfers: 0 },
  },
  {
    id: "11",
    name: "Falken Azenis RT615K+",
    sku: "FALK-RT61-255",
    category: "Track Tires",
    currentStock: 3,
    unitCost: 190,
    sellingPrice: 329.99,
    totalSold: 12,
    lastSoldDate: "2026-02-14",
    movement: { additions: 30, deductions: 12, adjustments: 0, transfers: 0 },
  },
  {
    id: "12",
    name: "Kumho Ecsta PS91",
    sku: "KUMH-PS91-245",
    category: "Ultra High Performance",
    currentStock: 19,
    unitCost: 170,
    sellingPrice: 289.99,
    totalSold: 56,
    lastSoldDate: "2026-05-05",
    movement: { additions: 90, deductions: 56, adjustments: 0, transfers: 0 },
  },
];

// ─── Report Components ──────────────────────────────────────────

function InventoryValuation() {
  const totalValue = products.reduce((sum, p) => sum + p.currentStock * p.unitCost, 0);
  const totalRetail = products.reduce((sum, p) => sum + p.currentStock * p.sellingPrice, 0);
  const potentialProfit = totalRetail - totalValue;

  const byCategory = useMemo(() => {
    const map = new Map<string, { value: number; count: number }>();
    products.forEach((p) => {
      const existing = map.get(p.category) || { value: 0, count: 0 };
      map.set(p.category, {
        value: existing.value + p.currentStock * p.unitCost,
        count: existing.count + 1,
      });
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.value - a.value);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2A3A9D]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#2A3A9D]" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Inventory Valuation</CardTitle>
              <p className="text-xs text-gray-500">Current stock at cost price</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Cost Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">${totalValue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Retail Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">${totalRetail.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase tracking-wider">Potential Profit</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">${potentialProfit.toLocaleString()}</p>
          </div>
        </div>

        {/* By Category */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Value by Category</h4>
          <div className="space-y-3">
            {byCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{cat.name}</span>
                    <span className="text-sm font-medium text-gray-900">${cat.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2A3A9D] rounded-full"
                      style={{ width: `${(cat.value / totalValue) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">{cat.count} SKUs</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LowStockReport() {
  const lowStock = products.filter((p) => p.currentStock <= 10 && p.currentStock > 0);
  const outOfStock = products.filter((p) => p.currentStock === 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Low Stock Report</CardTitle>
              <p className="text-xs text-gray-500">Replenishment needs</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {outOfStock.length} Out of Stock
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {lowStock.length} Low Stock
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Out of Stock */}
          {outOfStock.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Critical — Out of Stock
              </h4>
              <div className="space-y-2">
                {outOfStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-100">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">0 units</p>
                      <p className="text-xs text-gray-500">Last sold {p.lastSoldDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock */}
          {lowStock.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Warning — Low Stock
              </h4>
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50/30 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">{p.currentStock} units</p>
                      <p className="text-xs text-gray-500">Sold {p.totalSold} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StockMovementReport() {
  const [movementType, setMovementType] = useState("all");

  const totals = useMemo(() => {
    return products.reduce(
      (acc, p) => ({
        additions: acc.additions + p.movement.additions,
        deductions: acc.deductions + p.movement.deductions,
        adjustments: acc.adjustments + p.movement.adjustments,
        transfers: acc.transfers + p.movement.transfers,
      }),
      { additions: 0, deductions: 0, adjustments: 0, transfers: 0 }
    );
  }, []);

  const movementTypes = [
    { key: "additions", label: "Additions", icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "deductions", label: "Deductions", icon: ArrowDownRight, color: "text-red-600", bg: "bg-red-50" },
    { key: "adjustments", label: "Adjustments", icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50" },
    { key: "transfers", label: "Transfers", icon: MoveRight, color: "text-purple-600", bg: "bg-purple-50" },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Stock Movement</CardTitle>
              <p className="text-xs text-gray-500">Additions, deductions, adjustments, transfers</p>
            </div>
          </div>
          <Select value={movementType} onValueChange={setMovementType}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <Filter className="w-3 h-3 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="additions">Additions</SelectItem>
              <SelectItem value="deductions">Deductions</SelectItem>
              <SelectItem value="adjustments">Adjustments</SelectItem>
              <SelectItem value="transfers">Transfers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          {movementTypes.map((type) => {
            const Icon = type.icon;
            const value = totals[type.key];
            return (
              <div key={type.key} className={cn("p-3 rounded-lg border", type.bg, type.color.replace("text-", "border-").replace("600", "200"))}>
                <Icon className={cn("w-4 h-4 mb-2", type.color)} />
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{type.label}</p>
              </div>
            );
          })}
        </div>

        {/* Detail Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase text-emerald-600">In</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase text-red-600">Out</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase text-blue-600">Adj</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase text-purple-600">Xfer</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products
                .filter((p) => movementType === "all" || p.movement[movementType as keyof typeof p.movement] !== 0)
                .map((p) => {
                  const net = p.movement.additions - p.movement.deductions + p.movement.adjustments;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3">
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm text-emerald-600 font-medium">+{p.movement.additions}</td>
                      <td className="py-2.5 px-3 text-right text-sm text-red-600 font-medium">-{p.movement.deductions}</td>
                      <td className="py-2.5 px-3 text-right text-sm text-blue-600 font-medium">
                        {p.movement.adjustments > 0 ? "+" : ""}{p.movement.adjustments}
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm text-purple-600 font-medium">{p.movement.transfers}</td>
                      <td className={cn("py-2.5 px-3 text-right text-sm font-bold", net >= 0 ? "text-gray-900" : "text-red-600")}>
                        {net >= 0 ? "+" : ""}{net}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function FastMovingProducts() {
  const fastMoving = [...products]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const totalSoldAll = products.reduce((sum, p) => sum + p.totalSold, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Fast Moving Products</CardTitle>
              <p className="text-xs text-gray-500">Top sellers by volume</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {totalSoldAll} total sold
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fastMoving.map((p, idx) => {
            const percentage = (p.totalSold / totalSoldAll) * 100;
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
                    <span className="text-sm font-bold text-gray-900 ml-2">{p.totalSold} sold</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${percentage * 3}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {p.category} • ${p.sellingPrice} • {p.currentStock} in stock
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DeadStockReport() {
  const thirtyDaysAgo = new Date("2026-05-13");
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const deadStock = products.filter((p) => {
    if (!p.lastSoldDate) return true;
    return new Date(p.lastSoldDate) < thirtyDaysAgo;
  }).sort((a, b) => (a.lastSoldDate ? new Date(a.lastSoldDate).getTime() : 0) - (b.lastSoldDate ? new Date(b.lastSoldDate).getTime() : 0));

  const deadValue = deadStock.reduce((sum, p) => sum + p.currentStock * p.unitCost, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Archive className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Dead Stock</CardTitle>
              <p className="text-xs text-gray-500">Not sold in 30+ days</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            ${deadValue.toLocaleString()} tied up
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {deadStock.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No dead stock — everything is moving!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deadStock.map((p) => {
              const daysSince = p.lastSoldDate
                ? Math.floor((new Date("2026-05-13").getTime() - new Date(p.lastSoldDate).getTime()) / (1000 * 60 * 60 * 24))
                : 999;
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.sku} • {p.currentStock} in stock</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-red-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">
                        {daysSince === 999 ? "Never sold" : `${daysSince} days`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Value: ${(p.currentStock * p.unitCost).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Inventory Reports Page ─────────────────────────────────
export default function InventoryReportsPage() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Decision-focused insights for owners and managers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] bg-white border-gray-200">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export All
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <InventoryValuation />
        <LowStockReport />
        <StockMovementReport />
        <FastMovingProducts />
        <DeadStockReport />
      </div>
    </div>
  );
}