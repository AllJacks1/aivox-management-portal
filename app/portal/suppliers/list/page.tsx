"use client";

import React, { useState, useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
  MoreHorizontal,
  Archive,
  Edit3,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Building2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  ArrowUpRight,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  notes?: string;
  status: "active" | "archived" | "unpaid";
  productsSupplied: string[];
  productCategories: string[];
  balanceDue: number;
  lastDeliveryDate: string;
  totalDeliveries: number;
  outstandingOrders: number;
  createdAt: string;
  archivedAt?: string;
  archiveReason?: string;
}

interface SupplierFormData {
  name: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-2024-001",
    name: "Manila Fresh Produce Trading",
    contactPerson: "Jose Reyes",
    phoneNumber: "+63 917 234 5678",
    email: "orders@manilafresh.ph",
    address: "Unit 45, Farmers Market Complex, Quezon City",
    notes: "Preferred delivery: Tuesdays and Fridays before 10 AM. Always check expiry dates on dairy.",
    status: "active",
    productsSupplied: ["Fresh Vegetables", "Fruits", "Dairy Products", "Eggs"],
    productCategories: ["Produce", "Dairy"],
    balanceDue: 0,
    lastDeliveryDate: "2024-03-12T08:30:00",
    totalDeliveries: 156,
    outstandingOrders: 2,
    createdAt: "2023-01-15",
  },
  {
    id: "SUP-2024-002",
    name: "Cebu Premium Seafood Co.",
    contactPerson: "Maria Santos",
    phoneNumber: "+63 918 345 6789",
    email: "sales@cebu-seafood.com",
    address: "Pier 3, Cebu City Port Area",
    notes: "Requires 24-hour advance notice for large orders. Best quality tuna and prawns.",
    status: "active",
    productsSupplied: ["Fresh Fish", "Prawns", "Squid", "Crab"],
    productCategories: ["Seafood"],
    balanceDue: 12500,
    lastDeliveryDate: "2024-03-10T06:00:00",
    totalDeliveries: 89,
    outstandingOrders: 3,
    createdAt: "2023-03-20",
  },
  {
    id: "SUP-2024-003",
    name: "Davao Organic Grains Supply",
    contactPerson: "Pedro Lim",
    phoneNumber: "+63 919 456 7890",
    email: "info@davaograins.ph",
    address: "Warehouse 12, Davao City Industrial Zone",
    notes: "Organic certified. 50kg minimum order for rice. Long lead time: 5-7 days.",
    status: "unpaid",
    productsSupplied: ["Organic Rice", "Brown Rice", "Quinoa", "Oats"],
    productCategories: ["Grains", "Organic"],
    balanceDue: 45600,
    lastDeliveryDate: "2024-02-28T14:00:00",
    totalDeliveries: 67,
    outstandingOrders: 5,
    createdAt: "2023-05-10",
  },
  {
    id: "SUP-2024-004",
    name: "Bicol Spices & Condiments",
    contactPerson: "Ana Garcia",
    phoneNumber: "+63 920 567 8901",
    email: "bicolspices@yahoo.com",
    address: "Legazpi City Public Market, Albay",
    status: "active",
    productsSupplied: ["Chili", "Coconut Vinegar", "Bagoong", "Laing"],
    productCategories: ["Spices", "Condiments"],
    balanceDue: 3200,
    lastDeliveryDate: "2024-03-08T11:00:00",
    totalDeliveries: 203,
    outstandingOrders: 1,
    createdAt: "2022-11-01",
  },
  {
    id: "SUP-2024-005",
    name: "Iloilo Meat & Poultry Suppliers",
    contactPerson: "Ramon Cruz",
    phoneNumber: "+63 921 678 9012",
    email: "ramon.cruz@iloilomeat.ph",
    address: "Mandurriao, Iloilo City",
    notes: "Halal certified options available. Cold chain maintained. Delivery Mon/Wed/Fri.",
    status: "active",
    productsSupplied: ["Chicken", "Pork", "Beef", "Processed Meat"],
    productCategories: ["Meat", "Poultry"],
    balanceDue: 0,
    lastDeliveryDate: "2024-03-11T07:00:00",
    totalDeliveries: 245,
    outstandingOrders: 0,
    createdAt: "2022-08-15",
  },
  {
    id: "SUP-2024-006",
    name: "Laguna Beverage Distributors",
    contactPerson: "Elena Torres",
    phoneNumber: "+63 922 789 0123",
    email: "orders@lagunabev.com",
    address: "Calamba, Laguna Industrial Park",
    status: "archived",
    productsSupplied: ["Soft Drinks", "Bottled Water", "Juice", "Energy Drinks"],
    productCategories: ["Beverages"],
    balanceDue: 0,
    lastDeliveryDate: "2024-01-15T09:00:00",
    totalDeliveries: 412,
    outstandingOrders: 0,
    createdAt: "2021-06-01",
    archivedAt: "2024-02-01",
    archiveReason: "Switched to direct manufacturer supply",
  },
  {
    id: "SUP-2024-007",
    name: "Baguio Vegetable Wholesale",
    contactPerson: "Carlos Mendoza",
    phoneNumber: "+63 923 890 1234",
    email: "baguio.veg@gmail.com",
    address: "La Trinidad, Benguet",
    notes: "Highland vegetables only. Seasonal availability for strawberries.",
    status: "active",
    productsSupplied: ["Lettuce", "Strawberries", "Carrots", "Potatoes", "Baguio Beans"],
    productCategories: ["Produce", "Highland"],
    balanceDue: 8900,
    lastDeliveryDate: "2024-03-09T05:30:00",
    totalDeliveries: 178,
    outstandingOrders: 2,
    createdAt: "2023-02-14",
  },
  {
    id: "SUP-2024-008",
    name: "Cavite Packaging Materials",
    contactPerson: "Linda Ocampo",
    phoneNumber: "+63 924 901 2345",
    email: "linda@cvtepackaging.ph",
    address: "General Trias, Cavite",
    status: "unpaid",
    productsSupplied: ["Plastic Containers", "Paper Bags", "Food Boxes", "Labels"],
    productCategories: ["Packaging"],
    balanceDue: 23400,
    lastDeliveryDate: "2024-02-20T13:00:00",
    totalDeliveries: 98,
    outstandingOrders: 4,
    createdAt: "2023-07-22",
  },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM d, yyyy");
};

const formatRelative = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

const getStatusConfig = (status: Supplier["status"]) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle2,
      };
    case "unpaid":
      return {
        label: "Unpaid",
        className: "bg-amber-100 text-amber-800 border-amber-200",
        icon: AlertCircle,
      };
    case "archived":
      return {
        label: "Archived",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        icon: Archive,
      };
    default:
      return {
        label: "Unknown",
        className: "bg-gray-100 text-gray-600 border-gray-200",
        icon: XCircle,
      };
  }
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function SupplierAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-[#2A3A9D] text-white font-bold",
        className
      )}
    >
      {initials}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-[#2A3A9D]"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : `Copy ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            "h-8 w-8 p-0 text-xs",
            currentPage === page && "bg-[#2A3A9D] hover:bg-[#04397C]"
          )}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function StatusBadge({ status }: { status: Supplier["status"] }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium gap-1", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function BalanceAlert({ amount }: { amount: number }) {
  if (amount === 0) return null;
  if (amount > 20000) {
    return (
      <div className="flex items-center gap-1.5 text-[#CE2A28]">
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="text-xs font-semibold">{formatCurrency(amount)}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-amber-600">
      <AlertCircle className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold">{formatCurrency(amount)}</span>
    </div>
  );
}

function SupplierCard({
  supplier,
  onEdit,
  onArchive,
  onView,
}: {
  supplier: Supplier;
  onEdit: (s: Supplier) => void;
  onArchive: (s: Supplier) => void;
  onView: (s: Supplier) => void;
}) {
  return (
    <Card className="border-slate-100 hover:border-[#2A3A9D]/20 hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <SupplierAvatar name={supplier.name} className="h-10 w-10 text-sm" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{supplier.name}</h3>
              <p className="text-xs text-slate-500">{supplier.contactPerson}</p>
            </div>
          </div>
          <StatusBadge status={supplier.status} />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Phone</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-slate-700">{supplier.phoneNumber}</span>
              <CopyButton text={supplier.phoneNumber} label="phone number" />
            </div>
          </div>

          {supplier.email && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Email</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
                  {supplier.email}
                </span>
                <CopyButton text={supplier.email} label="email" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Balance Due</span>
            {supplier.balanceDue > 0 ? (
              <BalanceAlert amount={supplier.balanceDue} />
            ) : (
              <span className="text-xs font-semibold text-emerald-600">Paid</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Last Delivery</span>
            <span className="text-xs font-medium text-slate-700">
              {formatRelative(supplier.lastDeliveryDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Products</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {supplier.productCategories.slice(0, 2).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {cat}
                </Badge>
              ))}
              {supplier.productCategories.length > 2 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{supplier.productCategories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#2A3A9D]"
              onClick={() => window.location.href = `tel:${supplier.phoneNumber}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
            {supplier.email && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#2A3A9D]"
                onClick={() => window.location.href = `mailto:${supplier.email}`}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-slate-600"
              onClick={() => onView(supplier)}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-slate-600"
              onClick={() => onEdit(supplier)}
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupplierTableRow({
  supplier,
  onEdit,
  onArchive,
  onView,
}: {
  supplier: Supplier;
  onEdit: (s: Supplier) => void;
  onArchive: (s: Supplier) => void;
  onView: (s: Supplier) => void;
}) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <SupplierAvatar name={supplier.name} className="h-9 w-9 text-xs" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{supplier.name}</p>
            <p className="text-xs text-slate-500">{supplier.contactPerson}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Phone className="h-3 w-3 text-slate-400" />
            {supplier.phoneNumber}
          </div>
          {supplier.email && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[160px]">{supplier.email}</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {supplier.productCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-[10px] px-1.5 py-0">
              {cat}
            </Badge>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          {supplier.productsSupplied.length} products
        </p>
      </td>
      <td className="py-3 px-4">
        {supplier.balanceDue > 0 ? (
          <BalanceAlert amount={supplier.balanceDue} />
        ) : (
          <span className="text-xs font-semibold text-emerald-600">Paid</span>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-slate-700">
            {formatRelative(supplier.lastDeliveryDate)}
          </p>
          <p className="text-[10px] text-slate-500">
            {supplier.totalDeliveries} total deliveries
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={supplier.status} />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#2A3A9D]"
                  onClick={() => window.location.href = `tel:${supplier.phoneNumber}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {supplier.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#2A3A9D]"
                    onClick={() => window.location.href = `mailto:${supplier.email}`}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Email</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(supplier)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(supplier)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Supplier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onArchive(supplier)}>
                <Archive className="h-4 w-4 mr-2" />
                {supplier.status === "archived" ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

function SupplierForm({
  initialData,
  onSubmit,
  onCancel,
  title,
}: {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
  onCancel: () => void;
  title: string;
}) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: initialData?.name || "",
    contactPerson: initialData?.contactPerson || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Supplier name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Supplier Name <span className="text-[#CE2A28]">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Manila Fresh Produce"
          className={cn("border-slate-200", errors.name && "border-[#CE2A28]")}
        />
        {errors.name && <p className="text-xs text-[#CE2A28]">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Contact Person</label>
        <Input
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          placeholder="e.g., Juan Dela Cruz"
          className="border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Phone Number <span className="text-[#CE2A28]">*</span>
        </label>
        <Input
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          placeholder="e.g., +63 912 345 6789"
          className={cn("border-slate-200", errors.phoneNumber && "border-[#CE2A28]")}
        />
        {errors.phoneNumber && <p className="text-xs text-[#CE2A28]">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email Address</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="e.g., orders@supplier.ph"
          className="border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Address</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Business address"
          className="border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Delivery preferences, special terms..."
          className="border-slate-200"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-[#2A3A9D] hover:bg-[#04397C]">
          {title}
        </Button>
      </div>
    </form>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 6;

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.contactPerson.toLowerCase().includes(query) ||
          s.phoneNumber.toLowerCase().includes(query) ||
          s.email?.toLowerCase().includes(query) ||
          s.productCategories.some((c) => c.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    return filtered;
  }, [suppliers, searchQuery, statusFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = useMemo(() => {
    const active = suppliers.filter((s) => s.status === "active").length;
    const unpaid = suppliers.filter((s) => s.status === "unpaid").length;
    const archived = suppliers.filter((s) => s.status === "archived").length;
    const totalBalance = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);
    return { active, unpaid, archived, totalBalance };
  }, [suppliers]);

  const handleAddSupplier = (data: SupplierFormData) => {
    setLoading(true);
    setTimeout(() => {
      const newSupplier: Supplier = {
        id: `SUP-2024-${String(suppliers.length + 1).padStart(3, "0")}`,
        ...data,
        status: "active",
        productsSupplied: [],
        productCategories: [],
        balanceDue: 0,
        lastDeliveryDate: new Date().toISOString(),
        totalDeliveries: 0,
        outstandingOrders: 0,
        createdAt: new Date().toISOString(),
      };
      setSuppliers([newSupplier, ...suppliers]);
      setLoading(false);
      setIsAddSheetOpen(false);
    }, 800);
  };

  const handleEditSupplier = (data: SupplierFormData) => {
    if (!selectedSupplier) return;
    setLoading(true);
    setTimeout(() => {
      setSuppliers(
        suppliers.map((s) =>
          s.id === selectedSupplier.id
            ? { ...s, ...data }
            : s
        )
      );
      setLoading(false);
      setIsEditSheetOpen(false);
      setSelectedSupplier(null);
    }, 800);
  };

  const handleArchive = () => {
    if (!selectedSupplier) return;
    setLoading(true);
    setTimeout(() => {
      setSuppliers(
        suppliers.map((s) =>
          s.id === selectedSupplier.id
            ? {
                ...s,
                status: s.status === "archived" ? "active" : "archived",
                archivedAt: s.status === "archived" ? undefined : new Date().toISOString(),
                archiveReason: s.status === "archived" ? undefined : archiveReason,
              }
            : s
        )
      );
      setLoading(false);
      setIsArchiveDialogOpen(false);
      setArchiveReason("");
      setSelectedSupplier(null);
    }, 800);
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Name", "Contact Person", "Phone", "Email", "Status", "Balance Due", "Last Delivery"].join(","),
      ...filteredSuppliers.map((s) =>
        [s.id, s.name, s.contactPerson, s.phoneNumber, s.email || "", s.status, s.balanceDue, s.lastDeliveryDate].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
            <p className="text-sm text-slate-500">Manage supplier relationships and track deliveries</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-[#2A3A9D] hover:bg-[#04397C]"
              onClick={() => setIsAddSheetOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Active</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                </div>
                <div className="rounded-lg bg-emerald-100 p-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Unpaid</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.unpaid}</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Archived</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.archived}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-2">
                  <Archive className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Due</p>
                  <p className="text-lg font-bold text-[#CE2A28]">{formatCurrency(stats.totalBalance)}</p>
                </div>
                <div className="rounded-lg bg-red-100 p-2">
                  <CreditCard className="h-4 w-4 text-[#CE2A28]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search suppliers by name, contact, phone, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "unpaid", "archived"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={cn(
                  "text-xs capitalize",
                  statusFilter === status && "bg-[#2A3A9D] hover:bg-[#04397C]"
                )}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card className="border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Supplier</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Products</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Balance Due</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Last Delivery</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSuppliers.length > 0 ? (
                    paginatedSuppliers.map((supplier) => (
                      <SupplierTableRow
                        key={supplier.id}
                        supplier={supplier}
                        onEdit={(s) => {
                          setSelectedSupplier(s);
                          setIsEditSheetOpen(true);
                        }}
                        onArchive={(s) => {
                          setSelectedSupplier(s);
                          setIsArchiveDialogOpen(true);
                        }}
                        onView={(s) => {
                          setSelectedSupplier(s);
                          setIsViewDialogOpen(true);
                        }}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Building2 className="h-10 w-10" />
                          <div>
                            <p className="text-sm font-medium text-slate-600">No suppliers found</p>
                            <p className="text-xs text-slate-500">Try adjusting your search or filters</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {paginatedSuppliers.length > 0 ? (
            paginatedSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onEdit={(s) => {
                  setSelectedSupplier(s);
                  setIsEditSheetOpen(true);
                }}
                onArchive={(s) => {
                  setSelectedSupplier(s);
                  setIsArchiveDialogOpen(true);
                }}
                onView={(s) => {
                  setSelectedSupplier(s);
                  setIsViewDialogOpen(true);
                }}
              />
            ))
          ) : (
            <Card className="border-slate-100">
              <CardContent className="py-12 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Building2 className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-medium text-slate-600">No suppliers found</p>
                    <p className="text-xs text-slate-500">Try adjusting your search or filters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Supplier Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add New Supplier</SheetTitle>
            <SheetDescription>
              Only name and phone are required. Add more details as needed.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <SupplierForm
              onSubmit={handleAddSupplier}
              onCancel={() => setIsAddSheetOpen(false)}
              title="Create Supplier"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Supplier Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit Supplier</SheetTitle>
            <SheetDescription>Update supplier information</SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {selectedSupplier && (
              <SupplierForm
                initialData={{
                  name: selectedSupplier.name,
                  contactPerson: selectedSupplier.contactPerson,
                  phoneNumber: selectedSupplier.phoneNumber,
                  email: selectedSupplier.email || "",
                  address: selectedSupplier.address || "",
                  notes: selectedSupplier.notes || "",
                }}
                onSubmit={handleEditSupplier}
                onCancel={() => {
                  setIsEditSheetOpen(false);
                  setSelectedSupplier(null);
                }}
                title="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Archive/Unarchive Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSupplier?.status === "archived" ? "Unarchive Supplier" : "Archive Supplier"}
            </DialogTitle>
            <DialogDescription>
              {selectedSupplier?.status === "archived"
                ? `Restore ${selectedSupplier?.name} to active status?`
                : `Archive ${selectedSupplier?.name}? Archived suppliers will be hidden from active lists.`}
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier?.status !== "archived" && (
            <div className="space-y-2 py-4">
              <label className="text-sm font-medium text-slate-700">Reason (optional)</label>
              <Input
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                placeholder="e.g., Switched to direct supply"
                className="border-slate-200"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleArchive}
              disabled={loading}
              className={
                selectedSupplier?.status === "archived"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-600 hover:bg-slate-700"
              }
            >
              {loading
                ? "Processing..."
                : selectedSupplier?.status === "archived"
                ? "Unarchive"
                : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2A3A9D]" />
              Supplier Details
            </DialogTitle>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <SupplierAvatar name={selectedSupplier.name} className="h-12 w-12 text-base" />
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedSupplier.name}</h3>
                  <StatusBadge status={selectedSupplier.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total Deliveries</p>
                  <p className="text-lg font-bold text-[#2A3A9D]">{selectedSupplier.totalDeliveries}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Outstanding Orders</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSupplier.outstandingOrders}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Contact:</span>
                  <span className="font-medium text-slate-900">{selectedSupplier.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-medium text-slate-900">{selectedSupplier.phoneNumber}</span>
                  <CopyButton text={selectedSupplier.phoneNumber} label="phone" />
                </div>
                {selectedSupplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-900">{selectedSupplier.email}</span>
                    <CopyButton text={selectedSupplier.email} label="email" />
                  </div>
                )}
                {selectedSupplier.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <span className="text-slate-600">Address:</span>
                    <span className="font-medium text-slate-900">{selectedSupplier.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Customer since:</span>
                  <span className="font-medium text-slate-900">{formatDate(selectedSupplier.createdAt)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#2A3A9D]" />
                  Products Supplied
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.productsSupplied.map((product) => (
                    <Badge key={product} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedSupplier.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#2A3A9D]" />
                      Notes
                    </h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {selectedSupplier.notes}
                    </p>
                  </div>
                </>
              )}

              {selectedSupplier.status === "archived" && selectedSupplier.archiveReason && (
                <div className="p-3 bg-slate-100 rounded-lg">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Archive Reason:</span>{" "}
                    {selectedSupplier.archiveReason}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Archived on {selectedSupplier.archivedAt ? formatDate(selectedSupplier.archivedAt) : "N/A"}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#2A3A9D] hover:bg-[#04397C]"
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedSupplier) {
                  setSelectedSupplier(selectedSupplier);
                  setIsEditSheetOpen(true);
                }
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}