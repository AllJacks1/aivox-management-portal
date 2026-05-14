"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/styles/colors";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Receipt,
  PhilippinePeso,
  ShoppingBag,
  RotateCcw,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

type DateRange = "today" | "yesterday" | "this_week" | "this_month";

interface HourlyData {
  hour: string;
  sales: number;
  transactions: number;
}

interface PaymentData {
  name: string;
  value: number;
  color: string;
}

interface ProductData {
  name: string;
  qty: number;
  revenue: number;
}

interface CashierData {
  name: string;
  transactions: number;
  sales: number;
}

interface DailyData {
  date: string;
  sales: number;
  transactions: number;
}

interface ReportData {
  totalSales: number;
  totalTransactions: number;
  avgSale: number;
  totalRefunds: number;
  totalDiscounts: number;
  hourly: HourlyData[];
  payments: PaymentData[];
  topProducts: ProductData[];
  cashiers: CashierData[];
  dailyTrend: DailyData[];
}

// ─── Mock Data ─────────────────────────────────────────────────────

const REPORT_DATA: Record<DateRange, ReportData> = {
  today: {
    totalSales: 100000,
    totalTransactions: 145,
    avgSale: 689.66,
    totalRefunds: 2352.0,
    totalDiscounts: 4520.0,
    hourly: [
      { hour: "6AM", sales: 0, transactions: 0 },
      { hour: "7AM", sales: 1200, transactions: 3 },
      { hour: "8AM", sales: 2800, transactions: 7 },
      { hour: "9AM", sales: 4500, transactions: 11 },
      { hour: "10AM", sales: 6200, transactions: 15 },
      { hour: "11AM", sales: 7800, transactions: 19 },
      { hour: "12PM", sales: 9500, transactions: 23 },
      { hour: "1PM", sales: 11200, transactions: 27 },
      { hour: "2PM", sales: 12800, transactions: 31 },
      { hour: "3PM", sales: 14500, transactions: 35 },
      { hour: "4PM", sales: 15200, transactions: 37 },
      { hour: "5PM", sales: 13800, transactions: 33 },
      { hour: "6PM", sales: 12100, transactions: 29 },
      { hour: "7PM", sales: 10500, transactions: 25 },
      { hour: "8PM", sales: 8900, transactions: 21 },
      { hour: "9PM", sales: 7200, transactions: 17 },
    ],
    payments: [
      { name: "Cash", value: 45200, color: "#2A3A9D" },
      { name: "GCash", value: 28300, color: "#3B82F6" },
      { name: "Card", value: 19800, color: "#60A5FA" },
      { name: "Bank Transfer", value: 6700, color: "#93C5FD" },
    ],
    topProducts: [
      { name: "Coca-Cola 500ml", qty: 142, revenue: 6390 },
      { name: "Michelin Pilot Sport 4", qty: 38, revenue: 323000 },
      { name: "Castrol GTX 5W-30", qty: 45, revenue: 83250 },
      { name: "Pirelli P Zero", qty: 29, revenue: 266800 },
      { name: "Bosch Wiper Blade", qty: 67, revenue: 30150 },
      { name: "Lays BBQ Chips", qty: 89, revenue: 4895 },
      { name: "Mobil 1 10W-40", qty: 31, revenue: 65100 },
      { name: "Fanta Orange 500ml", qty: 98, revenue: 4116 },
    ],
    cashiers: [
      { name: "Juan Dela Cruz", transactions: 45, sales: 156800 },
      { name: "Maria Santos", transactions: 38, sales: 142300 },
      { name: "Pedro Reyes", transactions: 29, sales: 98700 },
      { name: "Ana Garcia", transactions: 33, sales: 112500 },
    ],
    dailyTrend: [
      { date: "May 8", sales: 78500, transactions: 112 },
      { date: "May 9", sales: 92300, transactions: 134 },
      { date: "May 10", sales: 67800, transactions: 98 },
      { date: "May 11", sales: 112400, transactions: 156 },
      { date: "May 12", sales: 89500, transactions: 128 },
      { date: "May 13", sales: 75600, transactions: 109 },
      { date: "May 14", sales: 100000, transactions: 145 },
    ],
  },
  yesterday: {
    totalSales: 75600,
    totalTransactions: 109,
    avgSale: 693.58,
    totalRefunds: 1200.0,
    totalDiscounts: 3200.0,
    hourly: [
      { hour: "6AM", sales: 0, transactions: 0 },
      { hour: "7AM", sales: 800, transactions: 2 },
      { hour: "8AM", sales: 2100, transactions: 5 },
      { hour: "9AM", sales: 3800, transactions: 9 },
      { hour: "10AM", sales: 5200, transactions: 13 },
      { hour: "11AM", sales: 6800, transactions: 17 },
      { hour: "12PM", sales: 8200, transactions: 21 },
      { hour: "1PM", sales: 9800, transactions: 25 },
      { hour: "2PM", sales: 10500, transactions: 27 },
      { hour: "3PM", sales: 11200, transactions: 29 },
      { hour: "4PM", sales: 10800, transactions: 28 },
      { hour: "5PM", sales: 9500, transactions: 24 },
      { hour: "6PM", sales: 7800, transactions: 20 },
      { hour: "7PM", sales: 6200, transactions: 16 },
      { hour: "8PM", sales: 4100, transactions: 10 },
      { hour: "9PM", sales: 2200, transactions: 5 },
    ],
    payments: [
      { name: "Cash", value: 35200, color: "#2A3A9D" },
      { name: "GCash", value: 21300, color: "#3B82F6" },
      { name: "Card", value: 14800, color: "#60A5FA" },
      { name: "Bank Transfer", value: 4300, color: "#93C5FD" },
    ],
    topProducts: [
      { name: "Coca-Cola 500ml", qty: 98, revenue: 4410 },
      { name: "Michelin Pilot Sport 4", qty: 25, revenue: 212500 },
      { name: "Castrol GTX 5W-30", qty: 32, revenue: 59200 },
      { name: "Pirelli P Zero", qty: 18, revenue: 165600 },
      { name: "Bosch Wiper Blade", qty: 45, revenue: 20250 },
      { name: "Lays BBQ Chips", qty: 67, revenue: 3685 },
      { name: "Mobil 1 10W-40", qty: 22, revenue: 46200 },
      { name: "Fanta Orange 500ml", qty: 72, revenue: 3024 },
    ],
    cashiers: [
      { name: "Juan Dela Cruz", transactions: 32, sales: 112400 },
      { name: "Maria Santos", transactions: 28, sales: 98700 },
      { name: "Pedro Reyes", transactions: 24, sales: 76500 },
      { name: "Ana Garcia", transactions: 25, sales: 89000 },
    ],
    dailyTrend: [
      { date: "May 2", sales: 68200, transactions: 98 },
      { date: "May 3", sales: 74500, transactions: 108 },
      { date: "May 4", sales: 91200, transactions: 132 },
      { date: "May 5", sales: 67800, transactions: 97 },
      { date: "May 6", sales: 82300, transactions: 118 },
      { date: "May 7", sales: 75600, transactions: 109 },
      { date: "May 8", sales: 78500, transactions: 112 },
    ],
  },
  this_week: {
    totalSales: 623400,
    totalTransactions: 896,
    avgSale: 695.76,
    totalRefunds: 8900.0,
    totalDiscounts: 28400.0,
    hourly: [
      { hour: "6AM", sales: 1200, transactions: 3 },
      { hour: "7AM", sales: 5800, transactions: 14 },
      { hour: "8AM", sales: 12400, transactions: 31 },
      { hour: "9AM", sales: 19800, transactions: 49 },
      { hour: "10AM", sales: 27600, transactions: 68 },
      { hour: "11AM", sales: 35800, transactions: 88 },
      { hour: "12PM", sales: 44200, transactions: 108 },
      { hour: "1PM", sales: 52800, transactions: 129 },
      { hour: "2PM", sales: 61200, transactions: 149 },
      { hour: "3PM", sales: 69800, transactions: 170 },
      { hour: "4PM", sales: 72400, transactions: 176 },
      { hour: "5PM", sales: 68200, transactions: 166 },
      { hour: "6PM", sales: 59800, transactions: 145 },
      { hour: "7PM", sales: 51200, transactions: 124 },
      { hour: "8PM", sales: 39800, transactions: 96 },
      { hour: "9PM", sales: 23400, transactions: 56 },
    ],
    payments: [
      { name: "Cash", value: 281200, color: "#2A3A9D" },
      { name: "GCash", value: 176800, color: "#3B82F6" },
      { name: "Card", value: 123400, color: "#60A5FA" },
      { name: "Bank Transfer", value: 42000, color: "#93C5FD" },
    ],
    topProducts: [
      { name: "Coca-Cola 500ml", qty: 892, revenue: 40140 },
      { name: "Michelin Pilot Sport 4", qty: 234, revenue: 1989000 },
      { name: "Castrol GTX 5W-30", qty: 298, revenue: 551300 },
      { name: "Pirelli P Zero", qty: 178, revenue: 1637600 },
      { name: "Bosch Wiper Blade", qty: 412, revenue: 185400 },
      { name: "Lays BBQ Chips", qty: 534, revenue: 29370 },
      { name: "Mobil 1 10W-40", qty: 198, revenue: 415800 },
      { name: "Fanta Orange 500ml", qty: 612, revenue: 25704 },
    ],
    cashiers: [
      { name: "Juan Dela Cruz", transactions: 278, sales: 978500 },
      { name: "Maria Santos", transactions: 234, sales: 876200 },
      { name: "Pedro Reyes", transactions: 189, sales: 654300 },
      { name: "Ana Garcia", transactions: 195, sales: 712400 },
    ],
    dailyTrend: [
      { date: "Mon", sales: 78500, transactions: 112 },
      { date: "Tue", sales: 92300, transactions: 134 },
      { date: "Wed", sales: 67800, transactions: 98 },
      { date: "Thu", sales: 112400, transactions: 156 },
      { date: "Fri", sales: 89500, transactions: 128 },
      { date: "Sat", sales: 75600, transactions: 109 },
      { date: "Sun", sales: 100000, transactions: 145 },
    ],
  },
  this_month: {
    totalSales: 2456800,
    totalTransactions: 3521,
    avgSale: 697.76,
    totalRefunds: 32400.0,
    totalDiscounts: 112000.0,
    hourly: [
      { hour: "6AM", sales: 4800, transactions: 12 },
      { hour: "7AM", sales: 23200, transactions: 56 },
      { hour: "8AM", sales: 49600, transactions: 124 },
      { hour: "9AM", sales: 79200, transactions: 196 },
      { hour: "10AM", sales: 110400, transactions: 272 },
      { hour: "11AM", sales: 143200, transactions: 352 },
      { hour: "12PM", sales: 176800, transactions: 432 },
      { hour: "1PM", sales: 211200, transactions: 516 },
      { hour: "2PM", sales: 244800, transactions: 596 },
      { hour: "3PM", sales: 279200, transactions: 680 },
      { hour: "4PM", sales: 289600, transactions: 704 },
      { hour: "5PM", sales: 272800, transactions: 664 },
      { hour: "6PM", sales: 239200, transactions: 580 },
      { hour: "7PM", sales: 204800, transactions: 496 },
      { hour: "8PM", sales: 159200, transactions: 384 },
      { hour: "9PM", sales: 93600, transactions: 224 },
    ],
    payments: [
      { name: "Cash", value: 1108900, color: "#2A3A9D" },
      { name: "GCash", value: 696800, color: "#3B82F6" },
      { name: "Card", value: 486800, color: "#60A5FA" },
      { name: "Bank Transfer", value: 164300, color: "#93C5FD" },
    ],
    topProducts: [
      { name: "Coca-Cola 500ml", qty: 3568, revenue: 160560 },
      { name: "Michelin Pilot Sport 4", qty: 934, revenue: 7939000 },
      { name: "Castrol GTX 5W-30", qty: 1192, revenue: 2205200 },
      { name: "Pirelli P Zero", qty: 712, revenue: 6550400 },
      { name: "Bosch Wiper Blade", qty: 1648, revenue: 741600 },
      { name: "Lays BBQ Chips", qty: 2136, revenue: 117480 },
      { name: "Mobil 1 10W-40", qty: 792, revenue: 1663200 },
      { name: "Fanta Orange 500ml", qty: 2448, revenue: 102816 },
    ],
    cashiers: [
      { name: "Juan Dela Cruz", transactions: 1112, sales: 3914000 },
      { name: "Maria Santos", transactions: 936, sales: 3504800 },
      { name: "Pedro Reyes", transactions: 756, sales: 2617200 },
      { name: "Ana Garcia", transactions: 780, sales: 2849600 },
    ],
    dailyTrend: [
      { date: "Week 1", sales: 542000, transactions: 778 },
      { date: "Week 2", sales: 618000, transactions: 886 },
      { date: "Week 3", sales: 589000, transactions: 843 },
      { date: "Week 4", sales: 623400, transactions: 896 },
      { date: "Week 5", sales: 86400, transactions: 118 },
    ],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatCompact = (n: number) => {
  if (n >= 1000000) return `₱${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `₱${(n / 1000).toFixed(0)}K`;
  return `₱${n}`;
};

const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  this_month: "This Month",
};

const getPaymentIcon = (name: string) => {
  switch (name) {
    case "Cash": return Banknote;
    case "GCash": return Smartphone;
    case "Card": return CreditCard;
    case "Bank Transfer": return Landmark;
    default: return CreditCard;
  }
};

// ─── Chart Wrapper — FIXES ResponsiveContainer -1 issue ──────────────

function ChartBox({
  children,
  height = 260,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as any}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-gray-600">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: p.color }}
          />
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────

export default function DailySalesReportPage() {
  const [range, setRange] = useState<DateRange>("today");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  const data = useMemo(() => REPORT_DATA[range], [range]);

  const salesChange =
    range === "today"
      ? 12.5
      : range === "yesterday"
        ? -8.3
        : range === "this_week"
          ? 5.2
          : 3.8;

  const txnChange =
    range === "today"
      ? 8.2
      : range === "yesterday"
        ? -5.1
        : range === "this_week"
          ? 3.7
          : 2.1;

  return (
    <section className="space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h2 className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
            Daily Sales Report
          </h2>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowRangeDropdown(!showRangeDropdown)}
            className="h-9 border-gray-200 text-gray-700"
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            {RANGE_LABELS[range]}
            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          {showRangeDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRangeDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
                {(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRange(r);
                      setShowRangeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      range === r
                        ? "bg-blue-50 text-[#2A3A9D] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {RANGE_LABELS[r]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <h3 className="mt-2 text-2xl font-bold" style={{ color: COLORS.primary }}>
                {formatCurrency(data.totalSales)}
              </h3>
              <div className={`mt-2 flex items-center gap-1 text-xs ${salesChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                {salesChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{Math.abs(salesChange)}% vs previous</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <PhilippinePeso className="w-5 h-5 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {data.totalTransactions.toLocaleString()}
              </h3>
              <div className={`mt-2 flex items-center gap-1 text-xs ${txnChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                {txnChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{Math.abs(txnChange)}% vs previous</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Receipt className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Sale</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(data.avgSale)}
              </h3>
              <p className="mt-2 text-xs text-gray-400">Per transaction</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Refunds</p>
                <p className="font-bold text-red-500">{formatCurrency(data.totalRefunds)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Discounts</p>
                <p className="font-bold text-amber-600">{formatCurrency(data.totalDiscounts)}</p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Hourly Sales */}
        <Card className="min-w-0 border-gray-200 p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Hourly Sales</h3>
            <Badge variant="outline">
              {range === "this_month" ? "Monthly Aggregate" : "Hour of Day"}
            </Badge>
          </div>
          <ChartBox height={320}>
            <LineChart data={data.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="sales" name="Sales" stroke="#2A3A9D" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartBox>
        </Card>

        {/* Payment Breakdown */}
        <Card className="min-w-0 border-gray-200 p-5">
          <h3 className="mb-5 text-sm font-semibold text-gray-900">Payment Methods</h3>
          <ChartBox height={260}>
            <PieChart>
              <Pie data={data.payments} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {data.payments.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ChartBox>
          <div className="mt-4 space-y-3">
            {data.payments.map((p) => {
              const Icon = getPaymentIcon(p.name);
              const pct = ((p.value / data.totalSales) * 100).toFixed(1);
              return (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{p.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 — THE FIX: explicit heights on Card + ChartBox */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Top Products */}
        <Card className="min-w-0 border-gray-200 p-5">
          <h3 className="mb-5 text-sm font-semibold text-gray-900">Top Selling Products</h3>
          <ChartBox height={260}>
            <BarChart data={data.topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#2A3A9D" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ChartBox>
        </Card>

        {/* Cashier Performance */}
        <Card className="min-w-0 border-gray-200 p-5">
          <h3 className="mb-5 text-sm font-semibold text-gray-900">Cashier Performance</h3>
          <ChartBox height={260}>
            <BarChart data={data.cashiers} margin={{ top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ChartBox>
        </Card>

        {/* Daily Trend */}
        <Card className="min-w-0 border-gray-200 p-5">
          <h3 className="mb-5 text-sm font-semibold text-gray-900">
            {range === "this_month" ? "Weekly Trend" : "7-Day Trend"}
          </h3>
          <ChartBox height={260}>
            <BarChart data={data.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" fill="#2A3A9D" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ChartBox>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Top Products Table */}
        <Card className="min-w-0 border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Top Products Detail</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-20">Qty</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-28">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topProducts.slice(0, 6).map((product, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    </td>
                    <td className="py-2.5 px-4 text-center text-sm text-gray-600">{product.qty.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-sm font-bold" style={{ color: COLORS.primary }}>
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Cashier Performance Table */}
        <Card className="min-w-0 border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Cashier Performance Detail</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Cashier</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-24">Txns</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase w-28">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.cashiers.map((cashier, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-[#2A3A9D]">
                          {cashier.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{cashier.name}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center text-sm text-gray-600">{cashier.transactions.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-sm font-bold" style={{ color: COLORS.primary }}>
                      {formatCurrency(cashier.sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}