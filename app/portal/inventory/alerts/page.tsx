"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Package,
  ArrowRight,
  RefreshCw,
  Mail,
  Smartphone,
  CheckCircle2,
  X,
  Filter,
  Search,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COLORS } from "@/styles/colors";
import Pagination from "@/components/sections/Pagination";

// ─── Types ───────────────────────────────────────────────────────
interface LowStockItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
  alertSent: boolean;
  alertDismissed: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialAlerts: LowStockItem[] = [
  {
    id: "1",
    productName: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    category: "Performance Tires",
    currentStock: 8,
    minimumStock: 12,
    unit: "pcs",
    supplier: "Bridgestone Inc",
    lastRestocked: "2026-04-15",
    alertSent: true,
    alertDismissed: false,
  },
  {
    id: "2",
    productName: "Toyo Proxes R888R",
    sku: "TOYO-R888-255",
    category: "Track Tires",
    currentStock: 5,
    minimumStock: 8,
    unit: "pcs",
    supplier: "Toyo Tires",
    lastRestocked: "2026-04-20",
    alertSent: true,
    alertDismissed: false,
  },
  {
    id: "3",
    productName: "Falken Azenis RT615K+",
    sku: "FALK-RT61-255",
    category: "Track Tires",
    currentStock: 3,
    minimumStock: 10,
    unit: "pcs",
    supplier: "Falken Tire",
    lastRestocked: "2026-03-28",
    alertSent: false,
    alertDismissed: false,
  },
  {
    id: "4",
    productName: "Goodyear Eagle F1 Asymmetric",
    sku: "GOOD-F1A-235",
    category: "Summer Tires",
    currentStock: 0,
    minimumStock: 8,
    unit: "pcs",
    supplier: "Goodyear Tires",
    lastRestocked: "2026-04-01",
    alertSent: true,
    alertDismissed: false,
  },
  {
    id: "5",
    productName: "Continental SportContact 7",
    sku: "CONT-SC7-245",
    category: "Ultra High Performance",
    currentStock: 0,
    minimumStock: 5,
    unit: "pcs",
    supplier: "Continental AG",
    lastRestocked: "2026-03-15",
    alertSent: true,
    alertDismissed: false,
  },
  {
    id: "6",
    productName: "Nitto NT05",
    sku: "NITT-NT05-245",
    category: "Performance Tires",
    currentStock: 0,
    minimumStock: 6,
    unit: "pcs",
    supplier: "Nitto Tire",
    lastRestocked: "2026-04-10",
    alertSent: false,
    alertDismissed: true,
  },
  {
    id: "7",
    productName: "Hankook Ventus V12 Evo2",
    sku: "HANK-V12-235",
    category: "Summer Tires",
    currentStock: 4,
    minimumStock: 10,
    unit: "pcs",
    supplier: "Hankook Tire",
    lastRestocked: "2026-04-22",
    alertSent: true,
    alertDismissed: false,
  },
  {
    id: "8",
    productName: "Kumho Ecsta PS91",
    sku: "KUMH-PS91-245",
    category: "Ultra High Performance",
    currentStock: 2,
    minimumStock: 8,
    unit: "pcs",
    supplier: "Kumho Tire",
    lastRestocked: "2026-04-05",
    alertSent: true,
    alertDismissed: false,
  },
];

// ─── Severity Logic ─────────────────────────────────────────────
type Severity = "critical" | "warning";

function getSeverity(current: number, minimum: number): Severity {
  if (current === 0) return "critical";
  return "warning";
}

const severityConfig = {
  critical: {
    label: "Out of Stock",
    badge: "bg-red-50 text-red-700 border-red-200",
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  warning: {
    label: "Low Stock",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

// ─── Components ─────────────────────────────────────────────────
function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor,
  bgColor,
  alertColor,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  alertColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          <p className="text-xs text-gray-400">{subtext}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            bgColor,
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      {alertColor && (
        <div className={cn("mt-3 h-1 rounded-full w-full", alertColor)} />
      )}
    </div>
  );
}

function UrgencyBadge({
  current,
  minimum,
}: {
  current: number;
  minimum: number;
}) {
  const ratio = current / minimum;
  const severity = getSeverity(current, minimum);

  if (severity === "critical") {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 font-medium"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
        Critical
      </Badge>
    );
  }

  if (ratio <= 0.3) {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 font-medium"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
        Urgent
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
      Low
    </Badge>
  );
}

// ─── Main Low Stock Alerts Page ─────────────────────────────────
export default function LowStockAlertsPage() {
  const [alerts, setAlerts] = useState<LowStockItem[]>(initialAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [showDismissed, setShowDismissed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<LowStockItem | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
  });
  const itemsPerPage = 6;

  // Auto-detect: items where current <= minimum
  const activeAlerts = alerts.filter((a) => !a.alertDismissed);
  const dismissedAlerts = alerts.filter((a) => a.alertDismissed);
  const outOfStockCount = activeAlerts.filter(
    (a) => a.currentStock === 0,
  ).length;
  const lowStockCount = activeAlerts.filter((a) => a.currentStock > 0).length;

  // Filter logic
  const displayAlerts = showDismissed ? alerts : activeAlerts;
  const filteredAlerts = displayAlerts.filter((alert) => {
    const matchesSearch =
      alert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" ||
      (severityFilter === "critical" && alert.currentStock === 0) ||
      (severityFilter === "warning" && alert.currentStock > 0);
    return matchesSearch && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDismiss = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, alertDismissed: true } : a)),
    );
  };

  const handleRestore = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, alertDismissed: false } : a)),
    );
  };

  const handleSendAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, alertSent: true } : a)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Low Stock Alerts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated monitoring for inventory below minimum thresholds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <Bell className="w-4 h-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700">
                Notifications
              </span>
              <span className="text-[10px] text-gray-400">
                Email {notificationSettings.email ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Alerts"
          value={activeAlerts.length.toString()}
          subtext="Require attention"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
          alertColor="bg-amber-500"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount.toString()}
          subtext="Immediate restock needed"
          icon={Package}
          iconColor="text-red-600"
          bgColor="bg-red-50"
          alertColor="bg-red-500"
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount.toString()}
          subtext="Below minimum threshold"
          icon={TrendingDown}
          iconColor="text-amber-600"
          bgColor="bg-amber-50"
          alertColor="bg-amber-500"
        />
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2A3A9D]/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#2A3A9D]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Alert Channels
              </p>
              <p className="text-xs text-gray-500">
                Choose how you want to be notified
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="email-alerts"
                checked={notificationSettings.email}
                onCheckedChange={(v) =>
                  setNotificationSettings((s) => ({ ...s, email: v }))
                }
              />
              <Label
                htmlFor="email-alerts"
                className="text-sm text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="push-alerts"
                checked={notificationSettings.push}
                onCheckedChange={(v) =>
                  setNotificationSettings((s) => ({ ...s, push: v }))
                }
              />
              <Label
                htmlFor="push-alerts"
                className="text-sm text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Push
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search product, SKU, or supplier..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={severityFilter}
            onValueChange={(v) => {
              setSeverityFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] bg-white border-gray-200">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical (Out of Stock)</SelectItem>
              <SelectItem value="warning">Warning (Low Stock)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDismissed(!showDismissed)}
            className={cn(
              "gap-2",
              showDismissed && "bg-gray-100 text-gray-900",
            )}
          >
            {showDismissed ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            {showDismissed
              ? "Hide Dismissed"
              : `Show Dismissed (${dismissedAlerts.length})`}
          </Button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Current / Minimum
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      {showDismissed
                        ? "No alerts match your filters"
                        : "All stock levels healthy"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {showDismissed
                        ? "Try adjusting your search"
                        : "No items below minimum threshold"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alert) => {
                  const severity = getSeverity(
                    alert.currentStock,
                    alert.minimumStock,
                  );
                  const config = severityConfig[severity];
                  const stockRatio =
                    alert.minimumStock > 0
                      ? (alert.currentStock / alert.minimumStock) * 100
                      : 0;

                  return (
                    <tr
                      key={alert.id}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        alert.alertDismissed && "opacity-50",
                        severity === "critical" &&
                          !alert.alertDismissed &&
                          "bg-red-50/30",
                      )}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                              config.bgColor,
                            )}
                          >
                            <Package
                              className={cn("w-4 h-4", config.iconColor)}
                            />
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                alert.alertDismissed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900",
                              )}
                            >
                              {alert.productName}
                            </p>
                            <p className="text-xs text-gray-400">{alert.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-bold",
                                severity === "critical"
                                  ? "text-red-600"
                                  : "text-amber-600",
                              )}
                            >
                              {alert.currentStock}
                            </span>
                            <span className="text-xs text-gray-400">
                              / {alert.minimumStock} {alert.unit}
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                config.iconColor.replace("text-", "bg-"),
                              )}
                              style={{ width: `${Math.min(stockRatio, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <UrgencyBadge
                          current={alert.currentStock}
                          minimum={alert.minimumStock}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm text-gray-700">
                          {alert.supplier}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm text-gray-500">
                          {new Date(alert.lastRestocked).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!alert.alertDismissed ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedAlert(alert)}
                                className="text-[#2A3A9D] hover:text-[#252f7a] hover:bg-[#2A3A9D]/5 h-8"
                              >
                                Order
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDismiss(alert.id)}
                                className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                title="Dismiss alert"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestore(alert.id)}
                              className="text-gray-500 hover:text-gray-700 h-8"
                            >
                              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAlerts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Quick Order Dialog */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={(open) => !open && setSelectedAlert(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#2A3A9D]" />
              Quick Restock Order
            </DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {selectedAlert.productName}
                </p>
                <p className="text-xs text-gray-500">{selectedAlert.sku}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    {selectedAlert.currentStock} in stock
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Min: {selectedAlert.minimumStock}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recommended Order Quantity</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    defaultValue={selectedAlert.minimumStock * 3}
                    className="bg-gray-50 border-gray-200"
                  />
                  <span className="text-sm text-gray-500">
                    {selectedAlert.unit}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Suggested: {selectedAlert.minimumStock * 3}{" "}
                  {selectedAlert.unit} (3x minimum)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Supplier</Label>
                <p className="text-sm text-gray-700">
                  {selectedAlert.supplier}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 text-white hover:opacity-90"
                  style={{ backgroundColor: COLORS.primary }}
                  onClick={() => {
                    handleSendAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  Send PO to Supplier
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
