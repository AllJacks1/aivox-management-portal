"use client";
import { COLORS } from "@/styles/colors";
import {
  Package,
  ChevronRight,
  DollarSign as DollarIcon,
  ShoppingCart as CartIcon,
  Package as PackageIcon,
  Users as UsersIcon,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// ─── Register Chart.js components ─────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// ─── Stat Cards Data ────────────────────────────────────────────
const stats = [
  {
    title: "Total Revenue",
    value: "$261,000",
    change: "+12.5%",
    changeLabel: "from last month",
    changeType: "positive" as const,
    icon: DollarIcon,
    iconBg: "#EFF6FF",
    iconColor: "#1E3A8A",
  },
  {
    title: "Total Orders",
    value: "710",
    change: "+8.2%",
    changeLabel: "from last month",
    changeType: "positive" as const,
    icon: CartIcon,
    iconBg: "#F0FDF4",
    iconColor: "#10B981",
  },
  {
    title: "Inventory Items",
    value: "550",
    change: "-3",
    changeLabel: "from yesterday",
    changeType: "negative" as const,
    icon: PackageIcon,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
  },
  {
    title: "Active Customers",
    value: "1,245",
    change: "+45",
    changeLabel: "new this month",
    changeType: "positive" as const,
    icon: UsersIcon,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
  },
];

// ─── Chart Data ─────────────────────────────────────────────────
const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Sales ($)",
      data: [45000, 52000, 48000, 61000, 55000],
      backgroundColor: COLORS.chartBar,
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.6,
      categoryPercentage: 0.7,
    },
  ],
};

const salesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1E293B",
      padding: 12,
      cornerRadius: 8,
      titleFont: { size: 13, family: "Inter" },
      bodyFont: { size: 13, family: "Inter" },
      callbacks: {
        label: (ctx: any) => `$${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#64748B",
        font: { size: 12, family: "Inter" },
      },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      max: 80000,
      ticks: {
        stepSize: 20000,
        color: "#94A3B8",
        font: { size: 11, family: "Inter" },
        callback: (value: any) => {
          if (value === 0) return "0";
          return value / 1000 + "k";
        },
      },
      grid: {
        color: "#E2E8F0",
        borderDash: [4, 4],
      },
      border: { display: false },
    },
  },
};

const inventoryData = {
  labels: ["In Stock", "Low Stock", "Out of Stock"],
  datasets: [
    {
      data: [82, 15, 3],
      backgroundColor: [
        COLORS.pieInStock,
        COLORS.pieLowStock,
        COLORS.pieOutStock,
      ],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

const inventoryOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1E293B",
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
};

// ─── Components ─────────────────────────────────────────────────
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const Icon = stat.icon;
  const ChangeIcon = stat.changeType === "positive" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {stat.value}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                stat.changeType === "positive"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              <ChangeIcon className="w-3 h-3" />
              {stat.change}
            </span>
            <span className="text-xs text-gray-400">{stat.changeLabel}</span>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: stat.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
        </div>
      </div>
    </div>
  );
}

function SalesChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Sales Overview</h3>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="h-64">
        <Bar data={salesData} options={salesOptions} />
      </div>
    </div>
  );
}

function InventoryChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-6">Inventory Status</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        <div className="flex flex-col gap-3">
          {[
            { label: "In Stock", value: 82, color: COLORS.pieInStock },
            { label: "Low Stock", value: 15, color: COLORS.pieLowStock },
            { label: "Out of Stock", value: 3, color: COLORS.pieOutStock },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.label}{" "}
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </span>
            </div>
          ))}
        </div>

        <div className="relative w-44 h-44">
          <Doughnut data={inventoryData} options={inventoryOptions} />
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-bold text-gray-900">550</span>
            <span className="text-xs text-gray-500">Total Items</span>
          </div>
        </div>
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
        <button className="text-sm font-medium text-[#2A3A9D] hover:text-[#3246B8] flex items-center gap-1 transition-colors">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[640px]">
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
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
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
                          ? "bg-amber-50 text-amber-700"
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

// ─── Utility ────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Main Dashboard Page ────────────────────────────────────────
export default function DashboardPage() {
  return (
    <>
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here's what's happening with your tire shop today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <SalesChart />
        <InventoryChart />
      </div>

      {/* Products Table */}
      <TopSellingProducts />
    </>
  );
}