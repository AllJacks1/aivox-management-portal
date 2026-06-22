"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Download,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────
// Constants & Configuration
// ───────────────────────────────────────────────

const PRIMARY_COLOR = "#20B757";
const SECONDARY_COLOR = "#0EA5E9";
const CHART_COLORS = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
  cash: "#20B757",
  gcash: "#22C55E",
  card: "#4ADE80",
  maya: "#86EFAC",
  grid: "#E4E4E7",
  text: "#71717A",
};

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisweek", label: "This Week" },
  { value: "thismonth", label: "This Month" },
] as const;

type Period = (typeof PERIODS)[number]["value"];
type ReportType = "sales" | "inventory" | "customer";

// ───────────────────────────────────────────────
// Mock Data
// ───────────────────────────────────────────────

const SUMMARY = {
  totalSales: 124_850,
  totalTransactions: 87,
  averageOrder: 1_435,
  topProduct: "Coca-Cola 1.5L",
  lowStockItems: 5,
};

const SALES_TREND_DATA = [
  { day: "Mon", sales: 12_400, transactions: 18 },
  { day: "Tue", sales: 15_600, transactions: 22 },
  { day: "Wed", sales: 9_800, transactions: 15 },
  { day: "Thu", sales: 18_900, transactions: 28 },
  { day: "Fri", sales: 22_400, transactions: 31 },
  { day: "Sat", sales: 27_800, transactions: 42 },
  { day: "Sun", sales: 18_200, transactions: 26 },
];

const TOP_PRODUCTS_DATA = [
  { name: "Coca-Cola 1.5L", sales: 12_450 },
  { name: "Potato Chips", sales: 8_750 },
  { name: "White Bread", sales: 6_320 },
  { name: "Mineral Water", sales: 4_250 },
  { name: "Eggs Tray", sales: 3_150 },
];

const PAYMENT_DATA = [
  { name: "Cash", value: 45, color: CHART_COLORS.cash },
  { name: "GCash", value: 32, color: CHART_COLORS.gcash },
  { name: "Card", value: 18, color: CHART_COLORS.card },
  { name: "Maya", value: 5, color: CHART_COLORS.maya },
];

const REPORT_CARDS = [
  {
    title: "Full Sales Report",
    description: "Complete transaction breakdown with filters",
    type: "sales" as ReportType,
    icon: "📊",
  },
  {
    title: "Inventory Valuation",
    description: "Stock value, movement & low stock analysis",
    type: "inventory" as ReportType,
    icon: "📦",
  },
  {
    title: "Customer Analytics",
    description: "Loyalty tiers and purchase behavior",
    type: "customer" as ReportType,
    icon: "👥",
  },
];

// ───────────────────────────────────────────────
// Utility Components
// ───────────────────────────────────────────────

function Currency({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const formatted = useMemo(
    () =>
      new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
      }).format(amount),
    [amount],
  );

  return <span className={className}>{formatted}</span>;
}

function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "emerald",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "emerald" | "amber" | "zinc";
}) {
  const colorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    zinc: "text-zinc-600",
  };

  return (
    <Card className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-500">{label}</p>
            <div className="text-3xl font-bold tracking-tight text-zinc-900">
              {value}
            </div>
          </div>
          <div
            className={cn("p-2.5 rounded-xl bg-opacity-10", colorMap[color])}
          >
            <Icon className={cn("w-6 h-6", colorMap[color])} />
          </div>
        </div>

        {trend && trendValue && (
          <div className="mt-4 flex items-center gap-1.5">
            {trend === "up" && (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-red-600"
                    : "text-zinc-500",
              )}
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ───────────────────────────────────────────────
// Chart Components
// ───────────────────────────────────────────────

function SalesTrendChart({
  data,
  period,
}: {
  data: typeof SALES_TREND_DATA;
  period: Period;
}) {
  const periodLabel =
    PERIODS.find((p) => p.value === period)?.label ?? "This Week";

  return (
    <Card className="border-zinc-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-zinc-900">
          Sales Trend ({periodLabel})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickFormatter={(value: number) =>
                `₱${(value / 1000).toFixed(0)}k`
              }
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E4E4E7",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                }).format(value),
                "Sales",
              ]}
              labelStyle={{ color: CHART_COLORS.text, marginBottom: "4px" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={PRIMARY_COLOR}
              strokeWidth={3}
              dot={{
                fill: PRIMARY_COLOR,
                r: 4,
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{
                r: 6,
                fill: PRIMARY_COLOR,
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function TopProductsChart({ data }: { data: typeof TOP_PRODUCTS_DATA }) {
  return (
    <Card className="border-zinc-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-zinc-900">
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
              dy={10}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
              tickFormatter={(value: number) =>
                `₱${(value / 1000).toFixed(0)}k`
              }
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E4E4E7",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                padding: "12px",
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                }).format(value),
                "Sales",
              ]}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar
              dataKey="sales"
              fill={PRIMARY_COLOR}
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function PaymentMethodsChart({ data }: { data: typeof PAYMENT_DATA }) {
  return (
    <Card className="border-zinc-200/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-zinc-900">
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E4E4E7",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mt-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-700">
                  {item.name}
                </span>
                <span className="text-xs text-zinc-400">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ───────────────────────────────────────────────
// Report Modals
// ───────────────────────────────────────────────

function SalesReportModal() {
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sales", value: 124_850 },
          { label: "Transactions", value: 87 },
          { label: "Avg Order", value: 1_435 },
        ].map((metric) => (
          <Card key={metric.label} className="border-zinc-200/60">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-zinc-900">
                {typeof metric.value === "number" && metric.value > 1000 ? (
                  <Currency amount={metric.value} />
                ) : (
                  metric.value
                )}
              </p>
              <p className="text-sm text-zinc-500 mt-1">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={SALES_TREND_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E4E4E7",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => [
                  new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 0,
                  }).format(value),
                  "Sales",
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={PRIMARY_COLOR}
                strokeWidth={3}
                dot={{
                  fill: PRIMARY_COLOR,
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryReportModal() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-medium text-zinc-700">
          Current Inventory Valuation:
        </span>
        <span className="text-2xl font-bold text-zinc-900">
          <Currency amount={248_750} />
        </span>
      </div>

      <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <Package className="w-5 h-5 text-amber-600" />
        <span className="text-amber-700 font-medium">
          5 Low Stock Items Require Attention
        </span>
      </div>

      <div className="mt-8 p-8 rounded-xl border-2 border-dashed border-zinc-200 text-center">
        <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-500 font-medium">Inventory Table</p>
        <p className="text-sm text-zinc-400 mt-1">
          Full inventory breakdown would render here
        </p>
      </div>
    </div>
  );
}

function CustomerReportModal() {
  return (
    <div className="space-y-6 py-4">
      <p className="text-lg font-medium text-zinc-700">Customer Insights</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-zinc-200/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-zinc-900">42</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Active Loyal Customers
                </p>
              </div>
              <Users className="w-8 h-8 text-emerald-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-zinc-900">18</p>
                <p className="text-sm text-zinc-500 mt-1">VIP / Gold Members</p>
              </div>
              <Users className="w-8 h-8 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const REPORT_MODALS: Record<ReportType, React.FC> = {
  sales: SalesReportModal,
  inventory: InventoryReportModal,
  customer: CustomerReportModal,
};

const REPORT_TITLES: Record<ReportType, string> = {
  sales: "Full Sales Report",
  inventory: "Inventory Valuation Report",
  customer: "Customer Analytics Report",
};

// ───────────────────────────────────────────────
// Main Page Component
// ───────────────────────────────────────────────

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState<Period>("thisweek");
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);

  const handleCloseModal = useCallback(() => {
    setActiveReport(null);
  }, []);

  const ActiveModalComponent = activeReport
    ? REPORT_MODALS[activeReport]
    : null;

  return (
    <div className="flex-1 overflow-auto bg-zinc-50/80">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Reports
            </h1>
            <p className="text-zinc-500 mt-1">
              Business insights and performance overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={reportPeriod}
              onValueChange={(v) => setReportPeriod(v as Period)}
            >
              <SelectTrigger className="w-44 bg-white border-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <MetricCard
            label="Total Sales"
            value={<Currency amount={SUMMARY.totalSales} />}
            icon={DollarSign}
            trend="up"
            trendValue="+12.4% from last period"
            color="emerald"
          />
          <MetricCard
            label="Transactions"
            value={SUMMARY.totalTransactions}
            icon={Users}
            trend="neutral"
            trendValue={`Avg ₱${SUMMARY.averageOrder.toLocaleString()} / order`}
            color="zinc"
          />
          <MetricCard
            label="Low Stock Items"
            value={
              <span className="text-amber-600">{SUMMARY.lowStockItems}</span>
            }
            icon={Package}
            color="amber"
          />
          <Card className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-500">
                    Top Product
                  </p>
                  <p className="text-lg font-semibold text-zinc-900 mt-2 leading-tight">
                    {SUMMARY.topProduct}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="mt-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0"
              >
                Best Seller
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <SalesTrendChart data={SALES_TREND_DATA} period={reportPeriod} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 mb-8">
          <TopProductsChart data={TOP_PRODUCTS_DATA} />
          <PaymentMethodsChart data={PAYMENT_DATA} />
        </div>

        <Separator className="my-10 bg-zinc-200/60" />

        {/* Detailed Reports Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Detailed Reports
          </h2>
          <p className="text-zinc-500 mt-1">
            Generate comprehensive reports for deeper analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {REPORT_CARDS.map((report) => (
            <Card
              key={report.type}
              className="group cursor-pointer border-zinc-200/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              onClick={() => setActiveReport(report.type)}
            >
              <CardContent className="p-6 lg:p-8">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {report.icon}
                </div>
                <h3 className="font-semibold text-xl text-zinc-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  {report.description}
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={!!activeReport} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-zinc-900">
                {activeReport ? REPORT_TITLES[activeReport] : ""}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="px-6 pb-6">
            {ActiveModalComponent && <ActiveModalComponent />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
