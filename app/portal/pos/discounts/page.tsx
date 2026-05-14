"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { COLORS } from "@/styles/colors";
import {
  Search,
  Tag,
  Percent,
  PhilippinePeso,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  AlertTriangle,
  UserCheck,
  Ban,
  Clock,
} from "lucide-react";
import Pagination from "@/components/sections/Pagination";

// ─── Types ─────────────────────────────────────────────────────────

type DiscountType = "percentage" | "fixed" | "pwd_senior" | "promo";

interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number; // percentage (0-100) or fixed amount
  requiresAuth: boolean;
  isActive: boolean;
  createdAt: string;
  usageCount: number;
  maxUsage?: number; // optional limit
  minPurchase?: number; // optional minimum purchase amount
}

// ─── Mock Data ─────────────────────────────────────────────────────

const DISCOUNTS: Discount[] = [
  {
    id: "DISC-001",
    code: "WELCOME10",
    name: "Welcome Discount",
    type: "percentage",
    value: 10,
    requiresAuth: false,
    isActive: true,
    createdAt: "2026-05-01T08:00:00",
    usageCount: 45,
  },
  {
    id: "DISC-002",
    code: "FLAT500",
    name: "₱500 Off",
    type: "fixed",
    value: 500,
    requiresAuth: true,
    isActive: true,
    createdAt: "2026-05-05T10:00:00",
    usageCount: 12,
    minPurchase: 3000,
  },
  {
    id: "DISC-003",
    code: "PWD20",
    name: "PWD / Senior Citizen (20%)",
    type: "pwd_senior",
    value: 20,
    requiresAuth: true,
    isActive: true,
    createdAt: "2026-04-20T09:00:00",
    usageCount: 89,
  },
  {
    id: "DISC-004",
    code: "TIRESALE",
    name: "Tire Promo — 15% Off",
    type: "promo",
    value: 15,
    requiresAuth: false,
    isActive: true,
    createdAt: "2026-05-10T14:00:00",
    usageCount: 23,
    maxUsage: 100,
  },
  {
    id: "DISC-005",
    code: "FLASH50",
    name: "Flash Sale — ₱50 Off",
    type: "fixed",
    value: 50,
    requiresAuth: false,
    isActive: false,
    createdAt: "2026-05-08T16:00:00",
    usageCount: 156,
    maxUsage: 200,
  },
  {
    id: "DISC-006",
    code: "BULK5",
    name: "Bulk Order — 5% Off",
    type: "percentage",
    value: 5,
    requiresAuth: true,
    isActive: true,
    createdAt: "2026-05-12T11:00:00",
    usageCount: 7,
    minPurchase: 5000,
  },
  {
    id: "DISC-007",
    code: "OILCHANGE",
    name: "Oil Change Bundle",
    type: "promo",
    value: 300,
    requiresAuth: false,
    isActive: true,
    createdAt: "2026-05-13T08:30:00",
    usageCount: 34,
  },
  {
    id: "DISC-008",
    code: "VIP25",
    name: "VIP Member — 25% Off",
    type: "percentage",
    value: 25,
    requiresAuth: true,
    isActive: true,
    createdAt: "2026-04-15T09:00:00",
    usageCount: 67,
  },
];

const ITEMS_PER_PAGE = 8;

// ─── Helpers ───────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getTypeConfig = (type: DiscountType) => {
  switch (type) {
    case "percentage":
      return {
        label: "Percentage",
        icon: Percent,
        color: "bg-blue-50 text-blue-700 border-blue-200",
        display: (v: number) => `${v}%`,
      };
    case "fixed":
      return {
        label: "Fixed Amount",
        icon: PhilippinePeso,
        color: "bg-green-50 text-green-700 border-green-200",
        display: (v: number) => formatCurrency(v),
      };
    case "pwd_senior":
      return {
        label: "PWD / Senior",
        icon: ShieldCheck,
        color: "bg-purple-50 text-purple-700 border-purple-200",
        display: (v: number) => `${v}%`,
      };
    case "promo":
      return {
        label: "Promo",
        icon: Tag,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        display: (v: number) => (v < 100 ? `${v}%` : formatCurrency(v)),
      };
  }
};

// ─── Component ───────────────────────────────────────────────────────

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(DISCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState<Partial<Discount>>({
    code: "",
    name: "",
    type: "percentage",
    value: 0,
    requiresAuth: false,
    isActive: true,
    minPurchase: undefined,
    maxUsage: undefined,
  });

  // ── Filtered & Paginated ────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...discounts];
    if (typeFilter !== "all") {
      data = data.filter((d) => d.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (d) =>
          d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q),
      );
    }
    return data;
  }, [discounts, typeFilter, searchQuery]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  // ── Actions ─────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setFormData({
      code: "",
      name: "",
      type: "percentage",
      value: 0,
      requiresAuth: false,
      isActive: true,
      minPurchase: undefined,
      maxUsage: undefined,
    });
    setShowModal(true);
  };

  const openEdit = (discount: Discount) => {
    setEditingId(discount.id);
    setFormData({ ...discount });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.code?.trim() || !formData.name?.trim() || !formData.value)
      return;

    if (editingId) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editingId ? ({ ...d, ...formData } as Discount) : d,
        ),
      );
    } else {
      const newDiscount: Discount = {
        id: `DISC-${Date.now().toString(36).toUpperCase()}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        type: formData.type as DiscountType,
        value: formData.value,
        requiresAuth: formData.requiresAuth || false,
        isActive: formData.isActive ?? true,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        minPurchase: formData.minPurchase,
        maxUsage: formData.maxUsage,
      };
      setDiscounts((prev) => [newDiscount, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    setShowDeleteConfirm(null);
  };

  const toggleActive = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)),
    );
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            Discounts
          </h2>
          <Badge
            variant="outline"
            className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
          >
            {totalItems} active
          </Badge>
        </div>
        <Button
          onClick={openCreate}
          className="h-9 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Discount
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search code or name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["all", "percentage", "fixed", "pwd_senior", "promo"].map((type) => {
            const label =
              type === "all"
                ? "All"
                : type === "pwd_senior"
                  ? "PWD/Senior"
                  : type.charAt(0).toUpperCase() + type.slice(1);
            return (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTypeFilter(type);
                  setCurrentPage(1);
                }}
                className={
                  typeFilter === type
                    ? "bg-[#2A3A9D] text-white hover:bg-[#252f7a]"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }
              >
                {label}
              </Button>
            );
          })}
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
                  Code
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Type
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Value
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Auth
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                  Used
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
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
                    <Tag className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No discounts found.
                  </td>
                </tr>
              ) : (
                paginated.map((discount) => {
                  const typeCfg = getTypeConfig(discount.type);
                  const TypeIcon = typeCfg.icon;
                  const isLimited =
                    discount.maxUsage &&
                    discount.usageCount >= discount.maxUsage;

                  return (
                    <tr
                      key={discount.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        !discount.isActive ? "opacity-50" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-gray-400" />
                          <span
                            className="text-sm font-mono font-bold"
                            style={{ color: COLORS.primary }}
                          >
                            {discount.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p
                          className="text-sm font-medium"
                          style={{ color: COLORS.textPrimary }}
                        >
                          {discount.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {discount.minPurchase && (
                            <span className="text-[10px] text-gray-400">
                              Min: {formatCurrency(discount.minPurchase)}
                            </span>
                          )}
                          {discount.maxUsage && (
                            <span className="text-[10px] text-gray-400">
                              Limit: {discount.usageCount}/{discount.maxUsage}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${typeCfg.color}`}
                        >
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {typeCfg.label}
                        </Badge>
                      </td>
                      <td
                        className="py-3 px-4 text-right text-sm font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {typeCfg.display(discount.value)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {discount.requiresAuth ? (
                          <div className="flex items-center justify-center gap-1">
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-amber-600 font-medium">
                              Required
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">
                              Auto
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-sm font-medium ${
                            isLimited ? "text-red-500" : "text-gray-600"
                          }`}
                        >
                          {discount.usageCount}
                          {discount.maxUsage && (
                            <span className="text-xs text-gray-400">
                              /{discount.maxUsage}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleActive(discount.id)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            discount.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {discount.isActive ? (
                            <>
                              <Check className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" />
                              Off
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(discount)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-[#2A3A9D] hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(discount.id)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          MODAL: Create / Edit Discount
         ═══════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md bg-white max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Discount" : "New Discount"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Code <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., WELCOME10"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className="h-10 font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Unique code customers or cashiers enter
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Welcome Discount"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-10"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        key: "percentage",
                        label: "Percentage (%)",
                        icon: Percent,
                      },
                      {
                        key: "fixed",
                        label: "Fixed Amount (₱)",
                        icon: PhilippinePeso,
                      },
                      {
                        key: "pwd_senior",
                        label: "PWD / Senior",
                        icon: ShieldCheck,
                      },
                      { key: "promo", label: "Promo", icon: Tag },
                    ] as const
                  ).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: key }))
                      }
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                        formData.type === key
                          ? "border-[#2A3A9D] bg-[#2A3A9D]/5 text-[#2A3A9D]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={
                      formData.type === "percentage" ? "e.g., 10" : "e.g., 500"
                    }
                    value={formData.value || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-10 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {formData.type === "percentage" ? "%" : "₱"}
                  </span>
                </div>
              </div>

              {/* Optional Rules */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Min. Purchase (₱)
                  </label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={formData.minPurchase || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minPurchase: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      }))
                    }
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Usage
                  </label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={formData.maxUsage || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxUsage: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    className="h-10"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Requires Authorization
                      </p>
                      <p className="text-xs text-gray-400">
                        Manager approval needed at POS
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.requiresAuth || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        requiresAuth: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Active
                      </p>
                      <p className="text-xs text-gray-400">
                        Available for use immediately
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !formData.code?.trim() ||
                  !formData.name?.trim() ||
                  !formData.value
                }
                className="flex-1 h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1.5" />
                {editingId ? "Save Changes" : "Create Discount"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Delete Confirmation
         ═══════════════════════════════════════════════════════════════ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Discount
                </h3>
                <p className="text-xs text-gray-500">This cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {discounts.find((d) => d.id === showDeleteConfirm)?.code}
              </span>
              ? This will remove it from the POS entirely.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
