"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Legend,
} from "recharts";

const PRIMARY_COLOR = "#20B757";
const SECONDARY_COLOR = "#15803D";

interface SalesTrendData {
  day: string;
  sales: number;
  transactions: number;
  growth: number;
}

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("thisweek");
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Mock Data - Expanded & More Realistic
  const summary = {
    totalSales: 124850,
    totalTransactions: 87,
    averageOrder: 1435,
    growthRate: 12.4,
    topProduct: "Coca-Cola 1.5L",
    lowStockItems: 5,
    inventoryValue: 248750,
  };

  const salesTrendData: SalesTrendData[] = [
    { day: "Mon", sales: 12400, transactions: 18, growth: 8 },
    { day: "Tue", sales: 15600, transactions: 22, growth: 14 },
    { day: "Wed", sales: 9800, transactions: 15, growth: -12 },
    { day: "Thu", sales: 18900, transactions: 28, growth: 22 },
    { day: "Fri", sales: 22400, transactions: 31, growth: 18 },
    { day: "Sat", sales: 27800, transactions: 42, growth: 35 },
    { day: "Sun", sales: 18200, transactions: 26, growth: -8 },
  ];

  const topProductsData = [
    { name: "Coca-Cola 1.5L", sales: 12450, units: 245, category: "Beverages" },
    { name: "Potato Chips", sales: 8750, units: 180, category: "Snacks" },
    { name: "White Bread", sales: 6320, units: 95, category: "Bakery" },
    { name: "Mineral Water", sales: 4250, units: 310, category: "Beverages" },
    { name: "Eggs Tray", sales: 3150, units: 42, category: "Dairy" },
  ];

  const paymentData = [
    { name: "Cash", value: 45, color: "#20B757", amount: 56182 },
    { name: "GCash", value: 32, color: "#22C55E", amount: 39952 },
    { name: "Card", value: 18, color: "#4ADE80", amount: 22473 },
    { name: "Maya", value: 5, color: "#86EFAC", amount: 6242 },
  ];

  const recentTransactions = [
    {
      id: "TRX-8921",
      time: "14:32",
      customer: "Juan Dela Cruz",
      amount: 2450,
      method: "GCash",
      items: 4,
    },
    {
      id: "TRX-8920",
      time: "14:18",
      customer: "Maria Santos",
      amount: 875,
      method: "Cash",
      items: 2,
    },
    {
      id: "TRX-8919",
      time: "13:55",
      customer: "Walk-in",
      amount: 3290,
      method: "Card",
      items: 7,
    },
    {
      id: "TRX-8918",
      time: "13:40",
      customer: "Ana Reyes",
      amount: 1560,
      method: "GCash",
      items: 3,
    },
  ];

  const lowStockItems = [
    { name: "Eggs Tray (Large)", stock: 8, threshold: 20 },
    { name: "Fresh Milk 1L", stock: 12, threshold: 25 },
    { name: "Lucky Me Noodles", stock: 15, threshold: 40 },
    { name: "Bread Loaf", stock: 9, threshold: 18 },
    { name: "Cigarettes (Marlboro)", stock: 22, threshold: 50 },
  ];

  const totalSalesThisPeriod = salesTrendData.reduce(
    (sum, day) => sum + day.sales,
    0,
  );

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Reports
            </h1>
            <p className="text-zinc-600 mt-1 text-lg">
              Real-time business performance and insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisweek">This Week</SelectItem>
                <SelectItem value="thismonth">This Month</SelectItem>
                <SelectItem value="lastmonth">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="gap-2 hover:brightness-105 transition"
                >
                  <Download size={18} />
                  Export Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Reports</DialogTitle>
                  <DialogDescription>
                    Choose format and sections to include in your export.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <p className="text-sm text-zinc-500">
                    Export options coming soon...
                  </p>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    Download as PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download as Excel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Total Sales
              </CardTitle>
              <DollarSign className="text-emerald-600" size={24} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ₱{summary.totalSales.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm mt-2">
                <TrendingUp size={16} />
                <span>+{summary.growthRate}% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Transactions
              </CardTitle>
              <Users className="text-emerald-600" size={24} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {summary.totalTransactions}
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                Avg ₱{summary.averageOrder.toLocaleString()} per order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Low Stock Alert
              </CardTitle>
              <Package className="text-amber-600" size={24} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-600">
                {summary.lowStockItems}
              </div>
              <p className="text-sm text-amber-600 mt-2">
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Inventory Value
              </CardTitle>
              <DollarSign className="text-zinc-600" size={24} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ₱{summary.inventoryValue.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Updated today</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Sales Trend - Full width on large screens */}
          <Card className="xl:col-span-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Daily performance this week</CardDescription>
                </div>
                <Badge variant="secondary">+12.4% WoW</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => [
                      `₱${Number(value ?? 0).toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Line
                    type="natural"
                    dataKey="sales"
                    stroke={PRIMARY_COLOR}
                    strokeWidth={4}
                    dot={{ fill: PRIMARY_COLOR, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={110} />
                  <Tooltip
                    formatter={(value: any) => [
                      `₱${Number(value ?? 0).toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Bar dataKey="sales" fill={PRIMARY_COLOR} radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-[320px]">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={115}
                      dataKey="value"
                      labelLine={false}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value ?? 0).toLocaleString()}%`,
                      ]}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">
                        {tx.id}
                      </TableCell>
                      <TableCell>{tx.time}</TableCell>
                      <TableCell className="font-medium">
                        {tx.customer}
                      </TableCell>
                      <TableCell>₱{tx.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.method}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="link"
                className="mt-4 w-full text-primary"
                onClick={() => {
                  window.location.href = "/transactions/history";
                }}
              >
                View All Transactions →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Inventory & Customer Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Low Stock Items */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Low Stock Items{" "}
                <Badge variant="destructive">{lowStockItems.length}</Badge>
              </CardTitle>
              <CardDescription>Items below safety threshold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-zinc-500">
                        Current: {item.stock} • Threshold: {item.threshold}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-200"
                    >
                      Restock Soon
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Insights */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-xl p-5 text-center">
                  <div className="text-5xl font-bold text-emerald-600">42</div>
                  <p className="text-sm text-zinc-600 mt-1">Loyal Customers</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs mt-3">
                    <ArrowUpRight size={14} /> +3 this week
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-xl p-5 text-center">
                  <div className="text-5xl font-bold">18</div>
                  <p className="text-sm text-zinc-600 mt-1">VIP Members</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-3">
                  Top Customer Segments
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Regular Walk-ins</span>
                    <span className="font-medium">54%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-2 w-[54%] bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
