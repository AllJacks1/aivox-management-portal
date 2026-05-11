"use client";

import Header from "@/components/sections/Header";
import Sidebar from "@/components/sections/Navbar";
import { COLORS } from "@/styles/colors";
import {
  Package,
  ChevronRight,
  DollarSign as DollarIcon,
  ShoppingCart as CartIcon,
  Package as PackageIcon,
  Users as UsersIcon,
} from "lucide-react";

// ─── Stat Cards Data ────────────────────────────────────────────
const stats = [
  {
    title: "Total Revenue",
    value: "$261,000",
    change: "+12.5% from last month",
    changeType: "positive" as const,
    icon: DollarIcon,
    iconBg: "#EFF6FF",
    iconColor: "#1E3A8A",
  },
  {
    title: "Total Orders",
    value: "710",
    change: "+8.2% from last month",
    changeType: "positive" as const,
    icon: CartIcon,
    iconBg: "#F0FDF4",
    iconColor: "#10B981",
  },
  {
    title: "Inventory Items",
    value: "550",
    change: "-3 from yesterday",
    changeType: "negative" as const,
    icon: PackageIcon,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
  },
  {
    title: "Active Customers",
    value: "1,245",
    change: "+45 new this month",
    changeType: "positive" as const,
    icon: UsersIcon,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
  },
];

// ─── Sales Chart Data ───────────────────────────────────────────
const salesData = [
  { month: "Jan", value: 45000 },
  { month: "Feb", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Apr", value: 61000 },
  { month: "May", value: 55000 },
];

const maxSales = Math.max(...salesData.map((d) => d.value));

// ─── Inventory Pie Data ─────────────────────────────────────────
const inventoryData = [
  { label: "In Stock", value: 82, color: COLORS.pieInStock },
  { label: "Low Stock", value: 15, color: COLORS.pieLowStock },
  { label: "Out of Stock", value: 3, color: COLORS.pieOutStock },
];

// ─── Components ─────────────────────────────────────────────────
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {stat.value}
          </p>
          <p
            className={`text-xs font-medium ${
              stat.changeType === "positive"
                ? "text-emerald-600"
                : "text-red-500"
            }`}
          >
            {stat.change}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: stat.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
        </div>
      </div>
    </div>
  );
}

function BarChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Sales Overview
      </h3>
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400 text-right pr-2">
          <span>80000</span>
          <span>60000</span>
          <span>40000</span>
          <span>20000</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="ml-12 h-full flex flex-col">
          {/* Grid lines */}
          <div className="flex-1 relative">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-dashed border-gray-200"
                style={{ top: `${i * 25}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around px-4 pb-0">
              {salesData.map((item, idx) => {
                const heightPercent = (item.value / 80000) * 100;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className="w-16 rounded-t-sm transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: COLORS.chartBar,
                        minHeight: "4px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="h-8 flex justify-around items-center ml-0 mr-0">
            {salesData.map((item, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-500 font-medium w-16 text-center"
              >
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PieChart() {
  // Calculate SVG pie slices
  const radius = 80;
  const center = 100;
  let currentAngle = 0;

  const slices = inventoryData.map((item) => {
    const angle = (item.value / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Inventory Status
      </h3>
      <div className="flex items-center justify-center gap-8">
        {/* Legend Left */}
        <div className="flex flex-col gap-4">
          {slices.map((slice, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-gray-600">
                {slice.label}{" "}
                <span className="font-semibold text-gray-900">
                  {slice.value}%
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Pie SVG */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="flex-shrink-0"
        >
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-90 transition-opacity cursor-pointer"
            />
          ))}
          {/* Inner circle for donut effect (optional, keeping full pie per reference) */}
        </svg>
      </div>
    </div>
  );
}

function TopSellingProducts() {
  const products = [
    {
      name: "Michelin Pilot Sport 4",
      sold: 142,
      revenue: "$42,600",
      stock: "In Stock",
    },
    {
      name: "Bridgestone Potenza RE-71R",
      sold: 98,
      revenue: "$29,400",
      stock: "Low Stock",
    },
    {
      name: "Goodyear Eagle F1 Asymmetric",
      sold: 87,
      revenue: "$26,100",
      stock: "In Stock",
    },
    { name: "Pirelli P Zero", sold: 76, revenue: "$22,800", stock: "In Stock" },
    {
      name: "Continental SportContact 7",
      sold: 65,
      revenue: "$19,500",
      stock: "Out of Stock",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Top Selling Products
        </h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">
                Product Name
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">
                Units Sold
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">
                Revenue
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-sm text-gray-600">
                  {product.sold}
                </td>
                <td className="py-3.5 pr-4 text-sm font-medium text-gray-900">
                  {product.revenue}
                </td>
                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock === "In Stock"
                        ? "bg-emerald-50 text-emerald-700"
                        : product.stock === "Low Stock"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside>
        <Sidebar />
      </aside>
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 p-6 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Here's what's happening with your tire shop today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <BarChart />
            <PieChart />
          </div>

          {/* Products Table */}
          <TopSellingProducts />
        </main>
      </div>
    </div>
  );
}
