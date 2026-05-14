"use client";

import { useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/styles/colors";
import {
  Search,
  Receipt,
  Printer,
  Download,
  Eye,
  X,
  Calendar,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Package,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Store,
  MapPin,
  Phone,
} from "lucide-react";
import Pagination from "@/components/sections/Pagination";

// ─── Types ─────────────────────────────────────────────────────────

interface ReceiptItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  discount: number;
}

interface Receipt {
  id: string;
  orNumber: string;
  date: string;
  cashier: string;
  items: ReceiptItem[];
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

const RECEIPTS: Receipt[] = [
  {
    id: "RCP-001",
    orNumber: "OR-2026-0001",
    date: "2026-05-14T09:23:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        name: "Coca-Cola 500ml",
        sku: "CC-500",
        qty: 2,
        price: 45.0,
        discount: 0,
      },
      {
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
    id: "RCP-002",
    orNumber: "OR-2026-0002",
    date: "2026-05-14T10:45:00",
    cashier: "Maria Santos",
    items: [
      {
        name: "Castrol GTX 5W-30 4L",
        sku: "CASTROL-5W30",
        qty: 1,
        price: 1850.0,
        discount: 0,
      },
      {
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
    id: "RCP-003",
    orNumber: "OR-2026-0003",
    date: "2026-05-14T11:12:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
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
    id: "RCP-004",
    orNumber: "OR-2026-0004",
    date: "2026-05-13T14:30:00",
    cashier: "Maria Santos",
    items: [
      {
        name: "Sprite 330ml",
        sku: "SPR-330",
        qty: 6,
        price: 35.0,
        discount: 0,
      },
      {
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
    id: "RCP-005",
    orNumber: "OR-2026-0005",
    date: "2026-05-13T16:00:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
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
    id: "RCP-006",
    orNumber: "OR-2026-0006",
    date: "2026-05-12T08:45:00",
    cashier: "Pedro Reyes",
    items: [
      {
        name: "Fanta Orange 500ml",
        sku: "FANTA-500",
        qty: 12,
        price: 42.0,
        discount: 24,
      },
      {
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
    id: "RCP-007",
    orNumber: "OR-2026-0007",
    date: "2026-05-12T13:20:00",
    cashier: "Maria Santos",
    items: [
      {
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
    id: "RCP-008",
    orNumber: "OR-2026-0008",
    date: "2026-05-11T09:00:00",
    cashier: "Juan Dela Cruz",
    items: [
      {
        name: "Michelin Pilot Sport 4",
        sku: "MPS4-17",
        qty: 1,
        price: 8500.0,
        discount: 0,
      },
      {
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
];

const ITEMS_PER_PAGE = 8;
const TAX_RATE = 0.12;

// ─── Business Info (configurable) ──────────────────────────────────

const BUSINESS = {
  name: "Astra Tire & Auto Supply",
  address: "123 Main Street, Quezon City, Metro Manila",
  phone: "(02) 8123-4567",
  tin: "123-456-789-000",
};

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

const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-PH", {
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

export default function ReceiptsPage() {
  const [receipts] = useState<Receipt[]>(RECEIPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showThermalPreview, setShowThermalPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // ── Filtered & Paginated ────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return receipts;
    const q = searchQuery.toLowerCase();
    return receipts.filter(
      (r) =>
        r.orNumber.toLowerCase().includes(q) ||
        r.cashier.toLowerCase().includes(q) ||
        r.items.some(
          (i) =>
            i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q),
        ),
    );
  }, [receipts, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  // ── Actions ─────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!selectedReceipt) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHTML = generateReceiptHTML(selectedReceipt);
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = () => {
    if (!selectedReceipt) return;
    // TODO: integrate with PDF library (e.g., jsPDF, html2pdf)
    alert(
      `Download PDF for ${selectedReceipt.orNumber} — integrate jsPDF or html2pdf here`,
    );
  };

  const handleThermalPrint = () => {
    if (!selectedReceipt) return;
    setShowThermalPreview(true);
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
          Receipts
        </h2>
        <Badge
          variant="outline"
          className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
        >
          {totalItems} records
        </Badge>
      </div>

      {/* Search */}
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
      </div>

      {/* Receipts Table */}
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
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No receipts found.
                  </td>
                </tr>
              ) : (
                paginated.map((receipt) => {
                  const statusCfg = getStatusConfig(receipt.status);
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr
                      key={receipt.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        receipt.status !== "completed" ? "opacity-60" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-sm font-medium"
                            style={{ color: COLORS.textPrimary }}
                          >
                            {receipt.orNumber}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        {formatDate(receipt.date)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {receipt.cashier}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-center text-sm font-medium"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {receipt.items.reduce((s, i) => s + i.qty, 0)}
                      </td>
                      <td
                        className="py-3 px-4 text-right text-sm font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(receipt.total)}
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
                            onClick={() => setSelectedReceipt(receipt)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-[#2A3A9D] hover:bg-blue-50"
                            title="View Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReceipt(receipt);
                              handlePrint();
                            }}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            title="Reprint"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReceipt(receipt);
                              handleDownloadPDF();
                            }}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
          MODAL: Full Receipt Preview (A4 / Standard)
         ═══════════════════════════════════════════════════════════════ */}
      {selectedReceipt && !showThermalPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md bg-white max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                Receipt Preview
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Receipt Content */}
              <div ref={printRef} className="bg-white">
                {/* Business Header */}
                <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-200">
                  <Store
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: COLORS.primary }}
                  />
                  <h2 className="text-lg font-bold text-gray-900">
                    {BUSINESS.name}
                  </h2>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {BUSINESS.address}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-0.5 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    {BUSINESS.phone}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    TIN: {BUSINESS.tin}
                  </p>
                </div>

                {/* OR & Meta */}
                <div className="space-y-1 mb-4 pb-4 border-b border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">OR Number</span>
                    <span className="font-bold">
                      {selectedReceipt.orNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span>{formatDate(selectedReceipt.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cashier</span>
                    <span>{selectedReceipt.cashier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-medium ${
                        selectedReceipt.status === "completed"
                          ? "text-green-600"
                          : selectedReceipt.status === "voided"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {selectedReceipt.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 pb-4 border-b border-dashed border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-1 text-xs text-gray-500">
                          Item
                        </th>
                        <th className="text-center py-1 text-xs text-gray-500 w-10">
                          Qty
                        </th>
                        <th className="text-right py-1 text-xs text-gray-500">
                          Price
                        </th>
                        <th className="text-right py-1 text-xs text-gray-500">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceipt.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <td className="py-1.5">
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {item.sku}
                            </p>
                          </td>
                          <td className="py-1.5 text-center">{item.qty}</td>
                          <td className="py-1.5 text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="py-1.5 text-right font-medium">
                            {formatCurrency(
                              item.price * item.qty - item.discount,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-1 mb-4 pb-4 border-b border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(selectedReceipt.subtotal)}</span>
                  </div>
                  {selectedReceipt.discount > 0 && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedReceipt.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (12%)</span>
                    <span>{formatCurrency(selectedReceipt.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between text-base font-bold">
                    <span>GRAND TOTAL</span>
                    <span style={{ color: COLORS.primary }}>
                      {formatCurrency(selectedReceipt.total)}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                <div className="space-y-1 mb-4 pb-4 border-b border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="capitalize">
                      {selectedReceipt.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                  {selectedReceipt.cashReceived !== undefined && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cash Received</span>
                        <span>
                          {formatCurrency(selectedReceipt.cashReceived)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-green-600">
                        <span>Change</span>
                        <span>
                          {formatCurrency(selectedReceipt.change || 0)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Void / Refund Notice */}
                {selectedReceipt.status === "voided" &&
                  selectedReceipt.voidReason && (
                    <div className="mb-4 p-3 rounded bg-red-50 border border-red-100 text-center">
                      <p className="text-sm font-bold text-red-700">
                        *** VOIDED ***
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Reason: {selectedReceipt.voidReason}
                      </p>
                    </div>
                  )}
                {selectedReceipt.status === "refunded" &&
                  selectedReceipt.refundedAt && (
                    <div className="mb-4 p-3 rounded bg-amber-50 border border-amber-100 text-center">
                      <p className="text-sm font-bold text-amber-700">
                        *** REFUNDED ***
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Refunded on {formatDate(selectedReceipt.refundedAt)}
                      </p>
                    </div>
                  )}

                {/* Footer */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-400">
                    Thank you for your business!
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">
                    This serves as your official receipt.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-100 grid grid-cols-3 gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setSelectedReceipt(null)}
                className="h-10"
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                className="h-10 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-1.5" />
                PDF
              </Button>
              <Button
                onClick={handlePrint}
                className="h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Print
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Thermal Printer Preview (58mm / 80mm narrow format)
         ═══════════════════════════════════════════════════════════════ */}
      {showThermalPreview && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-[320px] bg-white max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                Thermal Print Preview
              </h3>
              <button
                onClick={() => setShowThermalPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {/* Thermal Receipt Mockup */}
              <div
                className="bg-white p-4 shadow-sm"
                style={{ fontFamily: "monospace" }}
              >
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
                  <p className="font-bold text-sm">{BUSINESS.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {BUSINESS.address}
                  </p>
                  <p className="text-[10px] text-gray-500">{BUSINESS.phone}</p>
                  <p className="text-[10px] text-gray-400">
                    TIN: {BUSINESS.tin}
                  </p>
                </div>

                <div className="text-[10px] space-y-0.5 mb-3 border-b border-dashed border-gray-300 pb-3">
                  <p>OR: {selectedReceipt.orNumber}</p>
                  <p>
                    Date: {formatDateShort(selectedReceipt.date)}{" "}
                    {formatTime(selectedReceipt.date)}
                  </p>
                  <p>Cashier: {selectedReceipt.cashier}</p>
                </div>

                <div className="mb-3 border-b border-dashed border-gray-300 pb-3">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="text-[10px] mb-1">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex justify-between">
                        <span>
                          {item.qty}x @ {formatCurrency(item.price)}
                        </span>
                        <span>
                          {formatCurrency(
                            item.price * item.qty - item.discount,
                          )}
                        </span>
                      </div>
                      {item.discount > 0 && (
                        <p className="text-red-500">
                          - Disc: {formatCurrency(item.discount)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] space-y-0.5 mb-3 border-b border-dashed border-gray-300 pb-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedReceipt.subtotal)}</span>
                  </div>
                  {selectedReceipt.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedReceipt.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (12%)</span>
                    <span>{formatCurrency(selectedReceipt.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1">
                    <span>TOTAL</span>
                    <span>{formatCurrency(selectedReceipt.total)}</span>
                  </div>
                </div>

                <div className="text-[10px] space-y-0.5 mb-3 border-b border-dashed border-gray-300 pb-3">
                  <p className="capitalize">
                    Payment: {selectedReceipt.paymentMethod.replace("_", " ")}
                  </p>
                  {selectedReceipt.cashReceived !== undefined && (
                    <>
                      <div className="flex justify-between">
                        <span>Cash</span>
                        <span>
                          {formatCurrency(selectedReceipt.cashReceived)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Change</span>
                        <span>
                          {formatCurrency(selectedReceipt.change || 0)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {selectedReceipt.status !== "completed" && (
                  <div className="text-center mb-3 py-2 border-2 border-dashed border-gray-300">
                    <p className="font-bold text-sm">
                      *** {selectedReceipt.status.toUpperCase()} ***
                    </p>
                    {selectedReceipt.voidReason && (
                      <p className="text-[10px] text-gray-500">
                        {selectedReceipt.voidReason}
                      </p>
                    )}
                  </div>
                )}

                <div className="text-center text-[10px] text-gray-400 pt-2">
                  <p>Thank you for your business!</p>
                  <p className="mt-0.5">Keep this receipt for returns.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowThermalPreview(false)}
                className="flex-1 h-10"
              >
                Close
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Print
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}

// ─── Helper: Generate Print-Optimized HTML ───────────────────────────

function generateReceiptHTML(receipt: Receipt): string {
  const format = (n: number) =>
    `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const itemsHTML = receipt.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px dashed #eee;">
      <td style="padding: 4px 0; font-size: 12px;">
        <div style="font-weight: 600;">${item.name}</div>
        <div style="font-size: 10px; color: #999;">${item.sku}</div>
      </td>
      <td style="padding: 4px 0; font-size: 12px; text-align: center;">${item.qty}</td>
      <td style="padding: 4px 0; font-size: 12px; text-align: right;">${format(item.price)}</td>
      <td style="padding: 4px 0; font-size: 12px; text-align: right; font-weight: 600;">
        ${format(item.price * item.qty - item.discount)}
      </td>
    </tr>
  `,
    )
    .join("");

  const voidBlock =
    receipt.status === "voided" && receipt.voidReason
      ? `
    <div style="margin: 16px 0; padding: 8px; background: #fef2f2; border: 1px dashed #fecaca; text-align: center;">
      <p style="font-weight: bold; color: #dc2626; margin: 0;">*** VOIDED ***</p>
      <p style="font-size: 11px; color: #dc2626; margin: 4px 0 0;">Reason: ${receipt.voidReason}</p>
    </div>
  `
      : "";

  const refundBlock =
    receipt.status === "refunded" && receipt.refundedAt
      ? `
    <div style="margin: 16px 0; padding: 8px; background: #fffbeb; border: 1px dashed #fcd34d; text-align: center;">
      <p style="font-weight: bold; color: #d97706; margin: 0;">*** REFUNDED ***</p>
      <p style="font-size: 11px; color: #d97706; margin: 4px 0 0;">
        Refunded on ${formatDate(receipt.refundedAt)}
      </p>
    </div>
  `
      : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt ${receipt.orNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      color: #1f2937;
    }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px dashed #e5e7eb;">
    <h2 style="margin: 0; font-size: 18px; font-weight: bold;">${BUSINESS.name}</h2>
    <p style="margin: 4px 0 0; font-size: 11px; color: #6b7280;">${BUSINESS.address}</p>
    <p style="margin: 2px 0 0; font-size: 11px; color: #6b7280;">${BUSINESS.phone}</p>
    <p style="margin: 2px 0 0; font-size: 10px; color: #9ca3af;">TIN: ${BUSINESS.tin}</p>
  </div>

  <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #e5e7eb; font-size: 12px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">OR Number</span>
      <span style="font-weight: bold;">${receipt.orNumber}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Date</span>
      <span>${formatDate(receipt.date)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Cashier</span>
      <span>${receipt.cashier}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span style="color: #6b7280;">Status</span>
      <span style="font-weight: bold; text-transform: uppercase;">${receipt.status}</span>
    </div>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #e5e7eb;">
    <thead>
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <th style="text-align: left; padding: 4px 0; font-size: 10px; color: #9ca3af; text-transform: uppercase;">Item</th>
        <th style="text-align: center; padding: 4px 0; font-size: 10px; color: #9ca3af; text-transform: uppercase;">Qty</th>
        <th style="text-align: right; padding: 4px 0; font-size: 10px; color: #9ca3af; text-transform: uppercase;">Price</th>
        <th style="text-align: right; padding: 4px 0; font-size: 10px; color: #9ca3af; text-transform: uppercase;">Amt</th>
      </tr>
    </thead>
    <tbody>${itemsHTML}</tbody>
  </table>

  <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #e5e7eb; font-size: 12px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Subtotal</span>
      <span>${format(receipt.subtotal)}</span>
    </div>
    ${
      receipt.discount > 0
        ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #dc2626;">
      <span>Discount</span>
      <span>-${format(receipt.discount)}</span>
    </div>
    `
        : ""
    }
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Tax (12%)</span>
      <span>${format(receipt.tax)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding-top: 8px; margin-top: 8px; border-top: 1px solid #e5e7eb; font-size: 14px; font-weight: bold;">
      <span>GRAND TOTAL</span>
      <span>${format(receipt.total)}</span>
    </div>
  </div>

  <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #e5e7eb; font-size: 12px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Payment Method</span>
      <span style="text-transform: capitalize;">${receipt.paymentMethod.replace("_", " ")}</span>
    </div>
    ${
      receipt.cashReceived !== undefined
        ? `
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span style="color: #6b7280;">Cash Received</span>
      <span>${format(receipt.cashReceived)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-weight: bold; color: #16a34a;">
      <span>Change</span>
      <span>${format(receipt.change || 0)}</span>
    </div>
    `
        : ""
    }
  </div>

  ${voidBlock}
  ${refundBlock}

  <div style="text-align: center; padding-top: 8px;">
    <p style="margin: 0; font-size: 11px; color: #9ca3af;">Thank you for your business!</p>
    <p style="margin: 4px 0 0; font-size: 10px; color: #d1d5db;">This serves as your official receipt.</p>
  </div>

  <div class="no-print" style="margin-top: 32px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #2A3A9D; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
      Print Receipt
    </button>
  </div>
</body>
</html>
  `;
}
