"use client";

import { useState, useMemo } from "react";
import {
  Warehouse,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  AlertTriangle,
  Package,
  ChevronRight,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  CircleDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "@/styles/colors";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// ─── Types ───────────────────────────────────────────────────────
type ActivityType = "incoming" | "outgoing" | "transfer";

interface Activity {
  id: string;
  type: ActivityType;
  text: string;
  time: string;
  quantity: number;
  unit: string;
}

interface KpiData {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  color: string;
  bgColor: string;
}

interface StockMovementItem {
  type: "incoming" | "outgoing" | "transfer";
  product: string;
  quantity: number;
  reference: string;
  date: string;
  status: "completed" | "pending";
}

interface ReceivingItem {
  reference: string;
  supplier: string;
  items: number;
  quantity: number;
  status: "received" | "draft";
  discrepancies: number;
}

interface DispatchItem {
  reference: string;
  destination: string;
  items: number;
  quantity: number;
  status: "released" | "pending" | "cancelled";
  handler: string;
}

interface SnapshotItem {
  product: string;
  sku: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  status: "ok" | "low" | "out";
}

// ─── Mock Data ──────────────────────────────────────────────────
const kpiData: KpiData[] = [
  {
    label: "Incoming Today",
    value: "120",
    icon: <ArrowDownLeft className="w-5 h-5" />,
    trend: "+12%",
    trendUp: true,
    color: "#10B981",
    bgColor: "#10B98115",
  },
  {
    label: "Outgoing Today",
    value: "85",
    icon: <ArrowUpRight className="w-5 h-5" />,
    trend: "+5%",
    trendUp: true,
    color: "#3B82F6",
    bgColor: "#3B82F615",
  },
  {
    label: "Transfer Requests",
    value: "24",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    trend: "-3%",
    trendUp: false,
    color: "#8B5CF6",
    bgColor: "#8B5CF615",
  },
  {
    label: "Low Warehouse Stocks",
    value: "7",
    icon: <AlertTriangle className="w-5 h-5" />,
    trend: "+2",
    trendUp: false,
    color: "#F59E0B",
    bgColor: "#F59E0B15",
  },
];

const stockMovementData: StockMovementItem[] = [
  {
    type: "incoming",
    product: "Coca-Cola 500ml",
    quantity: 120,
    reference: "PO-2026-0542",
    date: "Today",
    status: "completed",
  },
  {
    type: "outgoing",
    product: "Rice Bags 5kg",
    quantity: 45,
    reference: "DO-2026-0124",
    date: "Today",
    status: "completed",
  },
  {
    type: "transfer",
    product: "Instant Noodles",
    quantity: 40,
    reference: "TRF-2026-0089",
    date: "Today",
    status: "completed",
  },
  {
    type: "incoming",
    product: "Michelin Pilot Sport 4",
    quantity: 50,
    reference: "PO-2026-0543",
    date: "Today",
    status: "pending",
  },
  {
    type: "outgoing",
    product: "Damaged Products",
    quantity: 10,
    reference: "ADJ-2026-0045",
    date: "Today",
    status: "completed",
  },
];

const receivingData: ReceivingItem[] = [
  {
    reference: "PO-2026-0542",
    supplier: "Michelin Corp",
    items: 2,
    quantity: 80,
    status: "received",
    discrepancies: 0,
  },
  {
    reference: "PO-2026-0543",
    supplier: "Bridgestone Inc",
    items: 1,
    quantity: 25,
    status: "draft",
    discrepancies: 0,
  },
  {
    reference: "RTN-2026-0089",
    supplier: "Customer Returns",
    items: 1,
    quantity: 2,
    status: "received",
    discrepancies: 0,
  },
  {
    reference: "PO-2026-0540",
    supplier: "Pirelli & C",
    items: 2,
    quantity: 60,
    status: "received",
    discrepancies: 1,
  },
  {
    reference: "PO-2026-0541",
    supplier: "Continental AG",
    items: 1,
    quantity: 35,
    status: "draft",
    discrepancies: 0,
  },
];

const dispatchData: DispatchItem[] = [
  {
    reference: "DO-2026-0124",
    destination: "Downtown Branch",
    items: 2,
    quantity: 20,
    status: "released",
    handler: "Admin User",
  },
  {
    reference: "DO-2026-0125",
    destination: "Customer Order #45892",
    items: 1,
    quantity: 4,
    status: "pending",
    handler: "Admin User",
  },
  {
    reference: "ADJ-2026-0045",
    destination: "Waste/Disposal",
    items: 1,
    quantity: 3,
    status: "released",
    handler: "Admin User",
  },
  {
    reference: "TRF-2026-0033",
    destination: "Display Floor",
    items: 2,
    quantity: 10,
    status: "pending",
    handler: "Admin User",
  },
  {
    reference: "DO-2026-0123",
    destination: "Uptown Branch",
    items: 1,
    quantity: 15,
    status: "cancelled",
    handler: "Admin User",
  },
];

const snapshotData: SnapshotItem[] = [
  {
    product: "Coca-Cola 500ml",
    sku: "CC-500",
    inStock: 450,
    lowStock: 0,
    outOfStock: 0,
    status: "ok",
  },
  {
    product: "Instant Noodles",
    sku: "NOOD-001",
    inStock: 85,
    lowStock: 0,
    outOfStock: 0,
    status: "ok",
  },
  {
    product: "Rice Bags 5kg",
    sku: "RICE-5K",
    inStock: 12,
    lowStock: 1,
    outOfStock: 0,
    status: "low",
  },
  {
    product: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    inStock: 0,
    lowStock: 0,
    outOfStock: 1,
    status: "out",
  },
  {
    product: "Laptop Dell XPS 13",
    sku: "DELL-XPS13",
    inStock: 8,
    lowStock: 1,
    outOfStock: 0,
    status: "low",
  },
];

const recentActivity: Activity[] = [
  {
    id: "1",
    type: "incoming",
    text: "Coca-Cola received from Supplier XYZ",
    time: "2 min ago",
    quantity: 120,
    unit: "pcs",
  },
  {
    id: "2",
    type: "transfer",
    text: "Instant Noodles transferred to Branch A",
    time: "15 min ago",
    quantity: 40,
    unit: "pcs",
  },
  {
    id: "3",
    type: "outgoing",
    text: "Damaged products removed from inventory",
    time: "32 min ago",
    quantity: 10,
    unit: "pcs",
  },
  {
    id: "4",
    type: "incoming",
    text: "Rice bags received from Supplier ABC",
    time: "1 hr ago",
    quantity: 250,
    unit: "pcs",
  },
  {
    id: "5",
    type: "transfer",
    text: "Laptops transferred to Branch B",
    time: "2 hrs ago",
    quantity: 15,
    unit: "pcs",
  },
  {
    id: "6",
    type: "outgoing",
    text: "Expired goods dispatched to disposal",
    time: "3 hrs ago",
    quantity: 22,
    unit: "pcs",
  },
];

// ─── Activity Config ────────────────────────────────────────────
const activityConfig = {
  incoming: {
    label: "Incoming",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ArrowDownLeft,
    sign: "+",
  },
  outgoing: {
    label: "Outgoing",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: ArrowUpRight,
    sign: "-",
  },
  transfer: {
    label: "Transfer",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ArrowLeftRight,
    sign: "-",
  },
};

const statusConfig = {
  completed: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Done",
  },
  pending: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CircleDashed,
    label: "Pending",
  },
  received: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Received",
  },
  draft: {
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: CircleDashed,
    label: "Draft",
  },
  released: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
    label: "Released",
  },
  cancelled: {
    badge: "bg-gray-50 text-gray-500 border-gray-200",
    icon: XCircle,
    label: "Cancelled",
  },
  ok: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "OK",
  },
  low: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertTriangle,
    label: "Low",
  },
  out: {
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    label: "Out",
  },
};

// ─── Reusable Components ──────────────────────────────────────

function KpiCard({ data }: { data: KpiData }) {
  return (
    <Card className="border-gray-100 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: data.bgColor, color: data.color }}
          >
            {data.icon}
          </div>
          <div
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: data.trendUp ? "#10B98115" : "#EF444415",
              color: data.trendUp ? "#10B981" : "#EF4444",
            }}
          >
            {data.trendUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {data.trend}
          </div>
        </div>
        <div
          className="text-3xl font-bold mb-1"
          style={{ color: COLORS.textPrimary }}
        >
          {data.value}
        </div>
        <div className="text-sm" style={{ color: COLORS.textSecondary }}>
          {data.label}
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStatusBadge({ status }: { status: string }) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] px-1.5 py-0 font-medium", config.badge)}
    >
      <StatusIcon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type];
  const StatusIcon = config.icon;
  const iconBgColor =
    activity.type === "incoming"
      ? "#10B98115"
      : activity.type === "outgoing"
        ? "#EF444415"
        : "#F59E0B15";
  const iconColor =
    activity.type === "incoming"
      ? "#10B981"
      : activity.type === "outgoing"
        ? "#EF4444"
        : "#F59E0B";
  const qtyColor =
    activity.type === "incoming"
      ? "text-emerald-600"
      : activity.type === "outgoing"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:bg-gray-50/80">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <StatusIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-bold ${qtyColor}`}>
            {config.sign}
            {activity.quantity} {activity.unit}
          </span>
          <span className="text-sm" style={{ color: COLORS.textPrimary }}>
            {activity.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: COLORS.textMuted }}>
            {activity.time}
          </span>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0", config.badge)}
          >
            {config.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle
          className="text-base font-semibold"
          style={{ color: COLORS.textPrimary }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Report Data Cards ─────────────────────────────────────────

function StockMovementCard() {
  return (
    <Card
      className="border-gray-100 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${COLORS.primary}15`,
                color: COLORS.primary,
              }}
            >
              <Package className="w-5 h-5" />
            </div>
            <div>
              <CardTitle
                className="text-base font-semibold"
                style={{ color: COLORS.textPrimary }}
              >
                Stock Movement Report
              </CardTitle>
              <p
                className="text-xs mt-0.5"
                style={{ color: COLORS.textSecondary }}
              >
                Tracks the most recent inventory movement across the warehouse
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
              5
            </p>
            <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
              Today
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Ref
                </th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockMovementData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {item.type === "incoming" && (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {item.type === "outgoing" && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                      )}
                      {item.type === "transfer" && (
                        <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span
                        className="text-xs capitalize"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {item.type}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-2 px-3 text-xs font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.product}
                  </td>
                  <td
                    className="py-2 px-3 text-right text-xs font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: COLORS.textMuted }}
                  >
                    {item.reference}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MiniStatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 flex items-center justify-between text-xs"
          style={{ color: COLORS.textMuted }}
        >
          <span>
            Incoming: <strong style={{ color: "#10B981" }}>2</strong>
          </span>
          <span>
            Outgoing: <strong style={{ color: "#EF4444" }}>2</strong>
          </span>
          <span>
            Transfers: <strong style={{ color: "#F59E0B" }}>1</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ReceivingCard() {
  return (
    <Card
      className="border-gray-100 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#10B98115", color: "#10B981" }}
            >
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <CardTitle
                className="text-base font-semibold"
                style={{ color: COLORS.textPrimary }}
              >
                Receiving Report
              </CardTitle>
              <p
                className="text-xs mt-0.5"
                style={{ color: COLORS.textSecondary }}
              >
                Track and verify the most recent incoming deliveries from suppliers
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              202
            </p>
            <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
              Total Units
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Discrp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {receivingData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td
                    className="py-2 px-3 text-xs font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.reference}
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {item.supplier}
                  </td>
                  <td
                    className="py-2 px-3 text-right text-xs font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MiniStatusBadge status={item.status} />
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.discrepancies > 0 ? (
                      <span className="text-xs font-bold text-red-600">
                        {item.discrepancies}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 flex items-center justify-between text-xs"
          style={{ color: COLORS.textMuted }}
        >
          <span>
            Received: <strong style={{ color: "#10B981" }}>3</strong>
          </span>
          <span>
            Draft: <strong style={{ color: COLORS.textSecondary }}>2</strong>
          </span>
          <span>
            Discrepancies: <strong style={{ color: "#EF4444" }}>1</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DispatchCard() {
  return (
    <Card
      className="border-gray-100 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#EF444415", color: "#EF4444" }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <CardTitle
                className="text-base font-semibold"
                style={{ color: COLORS.textPrimary }}
              >
                Dispatch Report
              </CardTitle>
              <p
                className="text-xs mt-0.5"
                style={{ color: COLORS.textSecondary }}
              >
                Monitor the most recent outgoing shipments and warehouse releases
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "#EF4444" }}>
              52
            </p>
            <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
              Total Out
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Handler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dispatchData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td
                    className="py-2 px-3 text-xs font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.reference}
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {item.destination}
                  </td>
                  <td
                    className="py-2 px-3 text-right text-xs font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MiniStatusBadge status={item.status} />
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: COLORS.textMuted }}
                  >
                    {item.handler}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 flex items-center justify-between text-xs"
          style={{ color: COLORS.textMuted }}
        >
          <span>
            Released: <strong style={{ color: "#3B82F6" }}>2</strong>
          </span>
          <span>
            Pending: <strong style={{ color: "#F59E0B" }}>2</strong>
          </span>
          <span>
            Cancelled:{" "}
            <strong style={{ color: COLORS.textSecondary }}>1</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SnapshotCard() {
  const okCount = snapshotData.filter((s) => s.status === "ok").length;
  const lowCount = snapshotData.filter((s) => s.status === "low").length;
  const outCount = snapshotData.filter((s) => s.status === "out").length;

  return (
    <Card
      className="border-gray-100 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}
            >
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <CardTitle
                className="text-base font-semibold"
                style={{ color: COLORS.textPrimary }}
              >
                Warehouse Inventory Snapshot
              </CardTitle>
              <p
                className="text-xs mt-0.5"
                style={{ color: COLORS.textSecondary }}
              >
                Current warehouse stock overview and availability
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "#8B5CF6" }}>
              555
            </p>
            <p className="text-[10px]" style={{ color: COLORS.textMuted }}>
              Total Units
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {snapshotData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td
                    className="py-2 px-3 text-xs font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.product}
                  </td>
                  <td
                    className="py-2 px-3 text-xs"
                    style={{ color: COLORS.textMuted }}
                  >
                    {item.sku}
                  </td>
                  <td
                    className="py-2 px-3 text-right text-xs font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {item.inStock}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <MiniStatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 flex items-center justify-between text-xs"
          style={{ color: COLORS.textMuted }}
        >
          <span>
            In Stock: <strong style={{ color: "#10B981" }}>{okCount}</strong>
          </span>
          <span>
            Low Stock: <strong style={{ color: "#F59E0B" }}>{lowCount}</strong>
          </span>
          <span>
            Out of Stock:{" "}
            <strong style={{ color: "#EF4444" }}>{outCount}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Chart Components ───────────────────────────────────────────

function WeeklyStockMovementChart() {
  const data = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Incoming",
          data: [45, 62, 38, 85, 55, 30, 42],
          backgroundColor: COLORS.primary,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Outgoing",
          data: [30, 45, 25, 50, 40, 20, 35],
          backgroundColor: "#94A3B8",
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Transfers",
          data: [12, 18, 8, 22, 15, 5, 10],
          backgroundColor: "#CBD5E1",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }),
    [],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: {
              size: 12,
              family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
            },
            color: COLORS.textSecondary,
          },
        },
        tooltip: {
          backgroundColor: COLORS.textPrimary,
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 }, color: COLORS.textSecondary },
        },
        y: {
          grid: { color: "#F1F5F9", drawBorder: false },
          ticks: {
            font: { size: 12 },
            color: COLORS.textSecondary,
            padding: 8,
          },
          border: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}

function WarehouseStockStatusChart() {
  const data = useMemo(
    () => ({
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [842, 7, 3],
          backgroundColor: [
            COLORS.pieInStock,
            COLORS.pieLowStock,
            COLORS.pieOutStock,
          ],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
            font: {
              size: 12,
              family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
            },
            color: COLORS.textSecondary,
          },
        },
        tooltip: {
          backgroundColor: COLORS.textPrimary,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => ` ${context.label}: ${context.raw} items`,
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-56 flex flex-col items-center">
      <div className="h-44 w-full relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            852
          </span>
          <span className="text-xs" style={{ color: COLORS.textSecondary }}>
            Total Items
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function WarehouseReportsPage() {
  const [activitySearch, setActivitySearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");

  const filteredActivities = recentActivity.filter((a) => {
    const matchesFilter = activityFilter === "all" || a.type === activityFilter;
    const matchesSearch =
      activitySearch === "" ||
      a.text.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.quantity.toString().includes(activitySearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 min-h-screen"
      style={{ backgroundColor: COLORS.bgMain }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Warehouse Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
            Monitor warehouse movements, receiving, dispatching, and inventory
            activity in real time.
          </p>
        </div>
        <Button
          className="gap-2 text-white hover:opacity-90"
          style={{ backgroundColor: COLORS.primary }}
        >
          <FileText className="w-4 h-4" /> Generate Report
        </Button>
      </div>

      {/* Section 1 — KPI Cards */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi, idx) => (
            <KpiCard key={idx} data={kpi} />
          ))}
        </div>
      </section>

      {/* Section 2 — Operational Charts */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: COLORS.textPrimary }}
        >
          Operational Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Weekly Stock Movement">
            <WeeklyStockMovementChart />
          </ChartCard>
          <ChartCard title="Warehouse Stock Status">
            <WarehouseStockStatusChart />
          </ChartCard>
        </div>
      </section>

      {/* Section 3 — Most Useful Reports (with real data) */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StockMovementCard />
          <ReceivingCard />
          <DispatchCard />
          <SnapshotCard />
        </div>
      </section>

      {/* Section 4 — Recent Activity Feed */}
      {/* Section 4 — Recent Activity Feed */}
      <section>
        <Card
          className="border-gray-100 shadow-sm overflow-hidden"
          style={{ backgroundColor: COLORS.cardBg }}
        >
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-2">
              <CardTitle
                className="text-lg"
                style={{ color: COLORS.textPrimary }}
              >
                Recent Activity Feed
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />{" "}
                Live
              </Badge>
            </div>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              Recent warehouse activity updates. This makes the system feel
              alive.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Search + Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search activity..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="pl-9 bg-white border-gray-200"
                  style={{ borderColor: "#E2E8F0", color: COLORS.textPrimary }}
                />
              </div>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger
                  className="sm:w-[160px] bg-white border-gray-200"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="divide-y divide-gray-50 -mx-4">
              {filteredActivities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
            {filteredActivities.length === 0 && (
              <div className="py-8 text-center">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  No activity found
                </p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button
                className="text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                style={{ color: COLORS.primary }}
              >
                View All Activity <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
