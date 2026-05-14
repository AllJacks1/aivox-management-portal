"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/styles/colors";
import {
  Search,
  Receipt,
  Eye,
  Printer,
  RotateCcw,
  Ban,
  Calendar,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Package,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
} from "lucide-react";
import Pagination from "@/components/sections/Pagination";

// ─── Types ─────────────────────────────────────────────────────────

interface TransactionItem {
  productId: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
  discount: number;
}

interface Transaction {
  id: string;
  orNumber: string;
  date: string;
  cashier: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "gcash" | "card" | "bank_transfer";
  cashReceived?: number;
  change?: number;
  status: "completed" | "voided" | "refunded";
  voidReason?: string;
  refundedAt?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-001",
    orNumber: "OR-2026-0001",
    date: "2026-05-14T09:23:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        productId: "P001",
        name: "Coca-Cola 500ml",
        sku: "CC-500",
        qty: 2,
        price: 45.0,
        discount: 0,
      },
      {
        productId: "P003",
        name: "Michelin Pilot Sport 4",
        sku: "MPS4-17",
        qty: 1,
        price: 8500.0,
        discount: 500,
      },
    ],
    subtotal: 8590.0,
    discount: 500,
    tax: 970.8,
    total: 9060.8,
    paymentMethod: "cash",
    cashReceived: 10000,
    change: 939.2,
    status: "completed",
  },
  {
    id: "TXN-002",
    orNumber: "OR-2026-0002",
    date: "2026-05-14T10:45:00",
    cashier: "Maria Santos",
    items: [
      {
        productId: "P007",
        name: "Castrol GTX 5W-30 4L",
        sku: "CASTROL-5W30",
        qty: 1,
        price: 1850.0,
        discount: 0,
      },
      {
        productId: "P005",
        name: 'Bosch Wiper Blade 18"',
        sku: "BOSCH-WP",
        qty: 2,
        price: 450.0,
        discount: 50,
      },
    ],
    subtotal: 2750.0,
    discount: 50,
    tax: 324.0,
    total: 3024.0,
    paymentMethod: "gcash",
    status: "completed",
  },
  {
    id: "TXN-003",
    orNumber: "OR-2026-0003",
    date: "2026-05-14T11:12:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        productId: "P004",
        name: "Pirelli P Zero",
        sku: "PPZ-18",
        qty: 2,
        price: 9200.0,
        discount: 0,
      },
    ],
    subtotal: 18400.0,
    discount: 0,
    tax: 2208.0,
    total: 20608.0,
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: "TXN-004",
    orNumber: "OR-2026-0004",
    date: "2026-05-13T14:30:00",
    cashier: "Maria Santos",
    items: [
      {
        productId: "P002",
        name: "Sprite 330ml",
        sku: "SPR-330",
        qty: 6,
        price: 35.0,
        discount: 0,
      },
      {
        productId: "P006",
        name: "Lays BBQ Chips",
        sku: "CHIPS-BBQ",
        qty: 3,
        price: 55.0,
        discount: 0,
      },
    ],
    subtotal: 375.0,
    discount: 0,
    tax: 45.0,
    total: 420.0,
    paymentMethod: "cash",
    cashReceived: 500,
    change: 80,
    status: "voided",
    voidReason: "Customer changed mind",
  },
  {
    id: "TXN-005",
    orNumber: "OR-2026-0005",
    date: "2026-05-13T16:00:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        productId: "P008",
        name: "Mobil 1 10W-40 4L",
        sku: "MOBIL-10W40",
        qty: 1,
        price: 2100.0,
        discount: 0,
      },
    ],
    subtotal: 2100.0,
    discount: 0,
    tax: 252.0,
    total: 2352.0,
    paymentMethod: "bank_transfer",
    status: "refunded",
    refundedAt: "2026-05-13T17:15:00",
  },
  {
    id: "TXN-006",
    orNumber: "OR-2026-0006",
    date: "2026-05-12T08:45:00",
    cashier: "Pedro Reyes",
    items: [
      {
        productId: "P009",
        name: "Fanta Orange 500ml",
        sku: "FANTA-500",
        qty: 12,
        price: 42.0,
        discount: 24,
      },
      {
        productId: "P001",
        name: "Coca-Cola 500ml",
        sku: "CC-500",
        qty: 6,
        price: 45.0,
        discount: 0,
      },
    ],
    subtotal: 774.0,
    discount: 24,
    tax: 90.0,
    total: 840.0,
    paymentMethod: "cash",
    cashReceived: 1000,
    change: 160,
    status: "completed",
  },
  {
    id: "TXN-007",
    orNumber: "OR-2026-0007",
    date: "2026-05-12T13:20:00",
    cashier: "Maria Santos",
    items: [
      {
        productId: "P010",
        name: 'Bridgestone Potenza 16"',
        sku: "BRIDGEST-16",
        qty: 1,
        price: 6200.0,
        discount: 0,
      },
    ],
    subtotal: 6200.0,
    discount: 0,
    tax: 744.0,
    total: 6944.0,
    paymentMethod: "gcash",
    status: "completed",
  },
  {
    id: "TXN-008",
    orNumber: "OR-2026-0008",
    date: "2026-05-11T09:00:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        productId: "P003",
        name: "Michelin Pilot Sport 4",
        sku: "MPS4-17",
        qty: 1,
        price: 8500.0,
        discount: 0,
      },
      {
        productId: "P007",
        name: "Castrol GTX 5W-30 4L",
        sku: "CASTROL-5W30",
        qty: 1,
        price: 1850.0,
        discount: 0,
      },
    ],
    subtotal: 10350.0,
    discount: 0,
    tax: 1242.0,
    total: 11592.0,
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: "TXN-009",
    orNumber: "OR-2026-0009",
    date: "2026-05-11T15:30:00",
    cashier: "Pedro Reyes",
    items: [
      {
        productId: "P005",
        name: 'Bosch Wiper Blade 18"',
        sku: "BOSCH-WP",
        qty: 4,
        price: 450.0,
        discount: 0,
      },
    ],
    subtotal: 1800.0,
    discount: 0,
    tax: 216.0,
    total: 2016.0,
    paymentMethod: "cash",
    cashReceived: 2500,
    change: 484,
    status: "voided",
    voidReason: "Wrong item rung up",
  },
  {
    id: "TXN-010",
    orNumber: "OR-2026-0010",
    date: "2026-05-10T11:00:00",
    cashier: "Maria Santos",
    items: [
      {
        productId: "P006",
        name: "Lays BBQ Chips",
        sku: "CHIPS-BBQ",
        qty: 10,
        price: 55.0,
        discount: 50,
      },
    ],
    subtotal: 550.0,
    discount: 50,
    tax: 60.0,
    total: 560.0,
    paymentMethod: "gcash",
    status: "completed",
  },
  {
    id: "TXN-011",
    orNumber: "OR-2026-0011",
    date: "2026-05-10T14:15:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        productId: "P002",
        name: "Sprite 330ml",
        sku: "SPR-330",
        qty: 24,
        price: 35.0,
        discount: 0,
      },
    ],
    subtotal: 840.0,
    discount: 0,
    tax: 100.8,
    total: 940.8,
    paymentMethod: "bank_transfer",
    status: "completed",
  },
  {
    id: "TXN-012",
    orNumber: "OR-2026-0012",
    date: "2026-05-09T10:30:00",
    cashier: "Pedro Reyes",
    items: [
      {
        productId: "P004",
        name: "Pirelli P Zero",
        sku: "PPZ-18",
        qty: 1,
        price: 9200.0,
        discount: 0,
      },
      {
        productId: "P010",
        name: 'Bridgestone Potenza 16"',
        sku: "BRIDGEST-16",
        qty: 1,
        price: 6200.0,
        discount: 0,
      },
    ],
    subtotal: 15400.0,
    discount: 0,
    tax: 1848.0,
    total: 17248.0,
    paymentMethod: "card",
    status: "refunded",
    refundedAt: "2026-05-09T12:00:00",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Helpers ───────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getPaymentIcon = (method: string) => {
  switch (method) {
    case "cash":
      return Banknote;
    case "gcash":
      return Smartphone;
    case "card":
      return CreditCard;
    case "bank_transfer":
      return Landmark;
    default:
      return CreditCard;
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      };
    case "voided":
      return {
        label: "Voided",
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      };
    case "refunded":
      return {
        label: "Refunded",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: RotateCcw,
      };
    default:
      return {
        label: status,
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: CheckCircle2,
      };
  }
};

// ─── Component ───────────────────────────────────────────────────────

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState("");
  const [voidTargetId, setVoidTargetId] = useState<string | null>(null);

  // ── Filtered & Paginated ────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...transactions];
    if (statusFilter !== "all") {
      data = data.filter((t) => t.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.orNumber.toLowerCase().includes(q) ||
          t.cashier.toLowerCase().includes(q) ||
          t.items.some(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              i.sku.toLowerCase().includes(q),
          ),
      );
    }
    return data;
  }, [transactions, statusFilter, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  // ── Actions ─────────────────────────────────────────────────────
  const handleVoid = () => {
    if (!voidTargetId || !voidReason.trim()) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === voidTargetId
          ? { ...t, status: "voided", voidReason: voidReason.trim() }
          : t,
      ),
    );
    setShowVoidModal(false);
    setVoidReason("");
    setVoidTargetId(null);
    setSelectedTxn(null);
  };

  const handleRefund = (id: string) => {
    if (!confirm("Refund this transaction? This cannot be undone.")) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "refunded", refundedAt: new Date().toISOString() }
          : t,
      ),
    );
    setSelectedTxn(null);
  };

  const openVoidModal = (id: string) => {
    setVoidTargetId(id);
    setVoidReason("");
    setShowVoidModal(true);
    setSelectedTxn(null);
  };

  const handleReprint = (txn: Transaction) => {
    // TODO: connect to receipt printer
    alert(`Reprinting receipt ${txn.orNumber}...`);
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5" style={{ color: COLORS.primary }} />
        <h2
          className="text-lg font-semibold"
          style={{ color: COLORS.textPrimary }}
        >
          Transactions
        </h2>
        <Badge
          variant="outline"
          className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
        >
          {totalItems} records
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search OR #, cashier, or product..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "completed", "voided", "refunded"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={
                statusFilter === status
                  ? "bg-[#2A3A9D] text-white hover:bg-[#252f7a]"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
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
                  OR Number
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  Items
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => {
                  const statusCfg = getStatusConfig(txn.status);
                  const StatusIcon = statusCfg.icon;
                  const PaymentIcon = getPaymentIcon(txn.paymentMethod);
                  const isActive = txn.status === "completed";

                  return (
                    <tr
                      key={txn.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        txn.status === "voided" || txn.status === "refunded"
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-sm font-medium"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {txn.orNumber}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {txn.cashier}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-center text-sm font-medium"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {txn.items.reduce((s, i) => s + i.qty, 0)}
                      </td>
                      <td
                        className="py-3 px-4 text-right text-sm font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(txn.total)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <PaymentIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-xs capitalize"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {txn.paymentMethod.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusCfg.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusCfg.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTxn(txn)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-[#2A3A9D] hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReprint(txn)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            title="Reprint Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                          {isActive && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRefund(txn.id)}
                                className="h-7 w-7 p-0 text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                                title="Refund"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openVoidModal(txn.id)}
                                className="h-7 w-7 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                title="Void"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </Button>
                            </>
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

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Transaction Details
         ═══════════════════════════════════════════════════════════════ */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg bg-white max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedTxn.orNumber}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(selectedTxn.date)}
                </p>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Status & Cashier */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedTxn.cashier}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusConfig(selectedTxn.status).color}
                >
                  {getStatusConfig(selectedTxn.status).label}
                </Badge>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </h4>
                <div className="space-y-2">
                  {selectedTxn.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.sku} · {item.qty}x @{" "}
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm font-medium"
                          style={{ color: COLORS.primary }}
                        >
                          {formatCurrency(
                            item.price * item.qty - item.discount,
                          )}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-xs text-red-500">
                            -{formatCurrency(item.discount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(selectedTxn.subtotal)}</span>
                </div>
                {selectedTxn.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Discounts</span>
                    <span>-{formatCurrency(selectedTxn.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (12%)</span>
                  <span>{formatCurrency(selectedTxn.tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span style={{ color: COLORS.primary }}>
                    {formatCurrency(selectedTxn.total)}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </h4>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getPaymentIcon(selectedTxn.paymentMethod);
                    return <Icon className="w-4 h-4 text-gray-400" />;
                  })()}
                  <span className="text-sm capitalize">
                    {selectedTxn.paymentMethod.replace("_", " ")}
                  </span>
                </div>
                {selectedTxn.cashReceived !== undefined && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cash Received</span>
                      <span>{formatCurrency(selectedTxn.cashReceived)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>Change</span>
                      <span>{formatCurrency(selectedTxn.change || 0)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Void / Refund Info */}
              {selectedTxn.status === "voided" && selectedTxn.voidReason && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Voided</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Reason: {selectedTxn.voidReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {selectedTxn.status === "refunded" && selectedTxn.refundedAt && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <RotateCcw className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Refunded
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Refunded on {formatDate(selectedTxn.refundedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setSelectedTxn(null)}
                className="flex-1 h-10"
              >
                Close
              </Button>
              <Button
                onClick={() => handleReprint(selectedTxn)}
                className="flex-1 h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Reprint
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Void Transaction (requires reason)
         ═══════════════════════════════════════════════════════════════ */}
      {showVoidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Void Transaction
                </h3>
                <p className="text-xs text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason for voiding <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Customer changed mind, Wrong item..."
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVoidModal(false);
                  setVoidReason("");
                  setVoidTargetId(null);
                }}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVoid}
                disabled={!voidReason.trim()}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                <Ban className="w-4 h-4 mr-2" />
                Void Transaction
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
