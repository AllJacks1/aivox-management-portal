"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/styles/colors";
import {
  Search,
  Users,
  Phone,
  Mail,
  Crown,
  ShoppingCart,
  Star,
  Clock,
  Plus,
  Pencil,
  Eye,
  Trash2,
  X,
  User,
  Check,
  AlertTriangle,
  Filter,
  ChevronDown,
  MapPin,
  Calendar,
  Receipt,
} from "lucide-react";
import Pagination from "@/components/sections/Pagination";

// ─── Types ─────────────────────────────────────────────────────────

type CustomerStatus = "new" | "returning" | "top" | "inactive";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  membershipId?: string;
  totalPurchases: number;
  loyaltyPoints: number;
  lastPurchase?: string;
  status: CustomerStatus;
  address?: string;
  createdAt: string;
  transactionCount: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────

const CUSTOMERS: Customer[] = [
  {
    id: "C001",
    name: "Juan Dela Cruz",
    phone: "0917-123-4567",
    email: "juan.dc@email.com",
    membershipId: "MEM-2026-0001",
    totalPurchases: 45680.0,
    loyaltyPoints: 456,
    lastPurchase: "2026-05-14T09:23:00",
    status: "top",
    address: "123 Main St, Quezon City",
    createdAt: "2026-01-15T08:00:00",
    transactionCount: 23,
  },
  {
    id: "C002",
    name: "Maria Santos",
    phone: "0918-234-5678",
    email: "maria.santos@email.com",
    membershipId: "MEM-2026-0002",
    totalPurchases: 32150.0,
    loyaltyPoints: 321,
    lastPurchase: "2026-05-13T16:00:00",
    status: "returning",
    address: "456 Oak Ave, Makati",
    createdAt: "2026-02-20T10:00:00",
    transactionCount: 18,
  },
  {
    id: "C003",
    name: "Pedro Reyes",
    phone: "0919-345-6789",
    totalPurchases: 8750.0,
    loyaltyPoints: 87,
    lastPurchase: "2026-05-10T11:00:00",
    status: "returning",
    createdAt: "2026-03-05T14:00:00",
    transactionCount: 8,
  },
  {
    id: "C004",
    name: "Ana Garcia",
    phone: "0920-456-7890",
    email: "ana.garcia@email.com",
    membershipId: "MEM-2026-0004",
    totalPurchases: 12800.0,
    loyaltyPoints: 128,
    lastPurchase: "2026-05-12T13:20:00",
    status: "returning",
    address: "789 Pine Rd, Pasig",
    createdAt: "2026-03-18T09:00:00",
    transactionCount: 12,
  },
  {
    id: "C005",
    name: "Roberto Lim",
    phone: "0921-567-8901",
    totalPurchases: 0,
    loyaltyPoints: 0,
    status: "new",
    createdAt: "2026-05-14T08:00:00",
    transactionCount: 0,
  },
  {
    id: "C006",
    name: "Elena Torres",
    phone: "0922-678-9012",
    email: "elena.torres@email.com",
    membershipId: "MEM-2026-0006",
    totalPurchases: 56200.0,
    loyaltyPoints: 562,
    lastPurchase: "2026-05-14T10:45:00",
    status: "top",
    address: "321 Elm St, Taguig",
    createdAt: "2025-11-10T08:00:00",
    transactionCount: 31,
  },
  {
    id: "C007",
    name: "Miguel Cruz",
    phone: "0923-789-0123",
    totalPurchases: 2340.0,
    loyaltyPoints: 23,
    lastPurchase: "2026-04-28T09:00:00",
    status: "inactive",
    createdAt: "2026-04-01T10:00:00",
    transactionCount: 3,
  },
  {
    id: "C008",
    name: "Sofia Mendoza",
    phone: "0924-890-1234",
    email: "sofia.m@email.com",
    membershipId: "MEM-2026-0008",
    totalPurchases: 18900.0,
    loyaltyPoints: 189,
    lastPurchase: "2026-05-11T15:30:00",
    status: "returning",
    address: "654 Maple Dr, Mandaluyong",
    createdAt: "2026-02-05T11:00:00",
    transactionCount: 15,
  },
  {
    id: "C009",
    name: "Carlos Rivera",
    phone: "0925-901-2345",
    totalPurchases: 0,
    loyaltyPoints: 0,
    status: "new",
    createdAt: "2026-05-14T07:30:00",
    transactionCount: 0,
  },
  {
    id: "C010",
    name: "Isabella Tan",
    phone: "0926-012-3456",
    email: "isabella.tan@email.com",
    membershipId: "MEM-2026-0010",
    totalPurchases: 67800.0,
    loyaltyPoints: 678,
    lastPurchase: "2026-05-14T11:12:00",
    status: "top",
    address: "987 Cedar Ln, San Juan",
    createdAt: "2025-08-20T08:00:00",
    transactionCount: 28,
  },
  {
    id: "C011",
    name: "Antonio Bautista",
    phone: "0927-123-4567",
    totalPurchases: 4500.0,
    loyaltyPoints: 45,
    lastPurchase: "2026-05-02T14:00:00",
    status: "inactive",
    createdAt: "2026-04-10T09:00:00",
    transactionCount: 5,
  },
  {
    id: "C012",
    name: "Patricia Lim",
    phone: "0928-234-5678",
    email: "patricia.lim@email.com",
    membershipId: "MEM-2026-0012",
    totalPurchases: 23400.0,
    loyaltyPoints: 234,
    lastPurchase: "2026-05-13T14:30:00",
    status: "returning",
    createdAt: "2026-01-28T10:00:00",
    transactionCount: 19,
  },
];

const ITEMS_PER_PAGE = 8;

// ─── Helpers ───────────────────────────────────────────────────────

const formatCurrency = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso?: string) => {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status: CustomerStatus) => {
  switch (status) {
    case "new":
      return {
        label: "New",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Plus,
      };
    case "returning":
      return {
        label: "Returning",
        color: "bg-green-50 text-green-700 border-green-200",
        icon: ShoppingCart,
      };
    case "top":
      return {
        label: "Top",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Crown,
      };
    case "inactive":
      return {
        label: "Inactive",
        color: "bg-gray-50 text-gray-600 border-gray-200",
        icon: Clock,
      };
  }
};

// ─── Component ───────────────────────────────────────────────────────

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // ── Filtered & Paginated ────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...customers];
    if (statusFilter !== "all") {
      data = data.filter((c) => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.membershipId?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q),
      );
    }
    return data;
  }, [customers, statusFilter, searchQuery]);

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
    setFormData({ name: "", phone: "", email: "", address: "" });
    setShowModal(true);
  };

  const openEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
    });
    setShowModal(true);
    setSelectedCustomer(null);
  };

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.phone?.trim()) return;

    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...formData,
                name: formData.name!.trim(),
                phone: formData.phone!.trim(),
              }
            : c,
        ),
      );
    } else {
      const newCustomer: Customer = {
        id: `C${Date.now().toString(36).toUpperCase()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        totalPurchases: 0,
        loyaltyPoints: 0,
        status: "new",
        createdAt: new Date().toISOString(),
        transactionCount: 0,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
    setSelectedCustomer(null);
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: COLORS.primary }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: COLORS.textPrimary }}
          >
            Customers
          </h2>
          <Badge
            variant="outline"
            className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
          >
            {totalItems}
          </Badge>
        </div>
        <Button
          onClick={openCreate}
          className="h-9 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search name, phone, or membership ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["all", "new", "returning", "top", "inactive"].map((status) => {
            const label =
              status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1);
            return (
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
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                  Purchases
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Points
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Last Purchase
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
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
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    No customers found.
                  </td>
                </tr>
              ) : (
                paginated.map((customer) => {
                  const statusCfg = getStatusConfig(customer.status);
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-[#2A3A9D] shrink-0">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: COLORS.textPrimary }}
                            >
                              {customer.name}
                            </p>
                            {customer.address && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {customer.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div
                            className="flex items-center gap-1.5 text-sm"
                            style={{ color: COLORS.textSecondary }}
                          >
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {customer.membershipId ? (
                          <div className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span
                              className="text-sm font-mono font-medium"
                              style={{ color: COLORS.primary }}
                            >
                              {customer.membershipId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td
                        className="py-3 px-4 text-right text-sm font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrency(customer.totalPurchases)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {customer.loyaltyPoints.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        {formatDateTime(customer.lastPurchase)}
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
                            onClick={() => setSelectedCustomer(customer)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-[#2A3A9D] hover:bg-blue-50"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(customer)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(customer.id)}
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
          MODAL: Add / Edit Customer
         ═══════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md bg-white max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Customer" : "Add Customer"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., 0917-123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-10"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Required for checkout lookup
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Optional"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <Input
                  placeholder="Optional"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="h-10"
                />
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
                disabled={!formData.name?.trim() || !formData.phone?.trim()}
                className="flex-1 h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-1.5" />
                {editingId ? "Save Changes" : "Add Customer"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: Customer Profile
         ═══════════════════════════════════════════════════════════════ */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg bg-white max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                Customer Profile
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-[#2A3A9D]">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    {selectedCustomer.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant="outline"
                      className={getStatusConfig(selectedCustomer.status).color}
                    >
                      {getStatusConfig(selectedCustomer.status).label}
                    </Badge>
                    {selectedCustomer.membershipId && (
                      <span className="text-xs font-mono text-amber-600 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {selectedCustomer.membershipId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCustomer.phone}
                  </p>
                </div>
                {selectedCustomer.email && (
                  <div className="p-3 rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer.email}
                    </p>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="p-3 rounded-lg bg-gray-50/50 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      Address
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-blue-50/50 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatCurrency(selectedCustomer.totalPurchases)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50/50 text-center">
                  <p className="text-xs text-gray-500 mb-1">Loyalty Points</p>
                  <p className="text-lg font-bold text-amber-600">
                    {selectedCustomer.loyaltyPoints.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50/50 text-center">
                  <p className="text-xs text-gray-500 mb-1">Transactions</p>
                  <p className="text-lg font-bold text-green-600">
                    {selectedCustomer.transactionCount}
                  </p>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Activity
                </h5>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Customer Since
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Receipt className="w-4 h-4 text-gray-400" />
                    Last Purchase
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedCustomer.lastPurchase
                      ? formatDateTime(selectedCustomer.lastPurchase)
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setSelectedCustomer(null)}
                className="flex-1 h-10"
              >
                Close
              </Button>
              <Button
                onClick={() => openEdit(selectedCustomer)}
                className="flex-1 h-10 bg-[#2A3A9D] hover:bg-[#252f7a] text-white"
              >
                <Pencil className="w-4 h-4 mr-1.5" />
                Edit Customer
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
                  Delete Customer
                </h3>
                <p className="text-xs text-gray-500">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">
                {customers.find((c) => c.id === showDeleteConfirm)?.name}
              </span>
              ?
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
