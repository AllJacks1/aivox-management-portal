"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Gift,
  Star,
  MessageSquare,
  Plus,
  Minus,
  Edit3,
  Copy,
  Check,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Package,
  Tag,
  Award,
  Heart,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Cake,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from "@/components/sections/Pagination";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Customer {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  birthday: string;
  address?: string;
  customerSince: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  preferences?: string[];
}

interface LoyaltySummary {
  currentPoints: number;
  redeemedPoints: number;
  availableRewards: number;
  tier: "Bronze" | "Silver" | "Gold" | "VIP" | "Platinum";
  tierProgress: number; // 0-100
  nextTierPoints: number;
}

interface CustomerStats {
  totalPurchases: number;
  totalSpend: number;
  averagePurchaseValue: number;
  lastVisitDate: string;
  visitFrequency: string;
  totalTransactions: number;
}

interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Transaction {
  id: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  cashierName: string;
  items: TransactionItem[];
  status: "completed" | "refunded" | "voided" | "pending";
  voidReason?: string;
  refundTimestamp?: string;
  pointsEarned: number;
}

interface ActivityEvent {
  id: string;
  type:
    | "purchase"
    | "points_earned"
    | "points_redeemed"
    | "reward_claimed"
    | "note_added"
    | "profile_updated";
  description: string;
  timestamp: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

interface FavoriteProduct {
  id: string;
  name: string;
  category: string;
  purchaseCount: number;
  lastPurchased: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_CUSTOMER: Customer = {
  id: "CUST-2024-001",
  fullName: "Maria Clara Santos",
  mobileNumber: "+63 912 345 6789",
  email: "maria.santos@email.com",
  birthday: "1992-03-15",
  address: "123 Mabini Street, Barangay San Jose, Quezon City, Metro Manila",
  customerSince: "2023-01-15",
  tags: ["VIP", "Regular", "Birthday Month"],
  notes:
    "Prefers eco-friendly packaging. Always asks for extra sauce. Birthday is March 15th - send greeting!",
  preferences: ["Eco-friendly", "Extra spicy", "No plastic straws"],
};

const MOCK_LOYALTY: LoyaltySummary = {
  currentPoints: 2450,
  redeemedPoints: 1200,
  availableRewards: 3,
  tier: "Gold",
  tierProgress: 72,
  nextTierPoints: 500,
};

const MOCK_STATS: CustomerStats = {
  totalPurchases: 47,
  totalSpend: 128450,
  averagePurchaseValue: 2733,
  lastVisitDate: "2024-03-10T14:30:00",
  visitFrequency: "Weekly",
  totalTransactions: 52,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2024-0152",
    date: "2024-03-10T14:30:00",
    totalAmount: 3450,
    paymentMethod: "GCash",
    cashierName: "Juan Dela Cruz",
    items: [
      {
        id: "ITEM-001",
        name: "Organic Brown Rice (5kg)",
        quantity: 2,
        unitPrice: 450,
        total: 900,
      },
      {
        id: "ITEM-002",
        name: "Fresh Milk 1L",
        quantity: 3,
        unitPrice: 120,
        total: 360,
      },
      {
        id: "ITEM-003",
        name: "Premium Ground Coffee",
        quantity: 1,
        unitPrice: 890,
        total: 890,
      },
      {
        id: "ITEM-004",
        name: "Whole Wheat Bread",
        quantity: 2,
        unitPrice: 150,
        total: 300,
      },
    ],
    status: "completed",
    pointsEarned: 35,
  },
  {
    id: "TXN-2024-0148",
    date: "2024-03-05T10:15:00",
    totalAmount: 1280,
    paymentMethod: "Cash",
    cashierName: "Ana Reyes",
    items: [
      {
        id: "ITEM-005",
        name: "Detergent Powder (1kg)",
        quantity: 2,
        unitPrice: 180,
        total: 360,
      },
      {
        id: "ITEM-006",
        name: "Fabric Conditioner",
        quantity: 1,
        unitPrice: 220,
        total: 220,
      },
      {
        id: "ITEM-007",
        name: "Dishwashing Liquid",
        quantity: 2,
        unitPrice: 120,
        total: 240,
      },
    ],
    status: "completed",
    pointsEarned: 13,
  },
  {
    id: "TXN-2024-0145",
    date: "2024-02-28T16:45:00",
    totalAmount: 5670,
    paymentMethod: "Credit Card",
    cashierName: "Juan Dela Cruz",
    items: [
      {
        id: "ITEM-008",
        name: "Premium Cooking Oil (5L)",
        quantity: 1,
        unitPrice: 1200,
        total: 1200,
      },
      {
        id: "ITEM-009",
        name: "Assorted Snacks Bundle",
        quantity: 3,
        unitPrice: 450,
        total: 1350,
      },
      {
        id: "ITEM-010",
        name: "Sparkling Water (Case)",
        quantity: 1,
        unitPrice: 850,
        total: 850,
      },
    ],
    status: "completed",
    pointsEarned: 57,
  },
  {
    id: "TXN-2024-0140",
    date: "2024-02-20T09:00:00",
    totalAmount: 890,
    paymentMethod: "GCash",
    cashierName: "Pedro Santos",
    items: [
      {
        id: "ITEM-011",
        name: "Instant Noodles (Pack of 5)",
        quantity: 4,
        unitPrice: 85,
        total: 340,
      },
      {
        id: "ITEM-012",
        name: "Canned Tuna",
        quantity: 5,
        unitPrice: 55,
        total: 275,
      },
    ],
    status: "refunded",
    refundTimestamp: "2024-02-21T11:30:00",
    pointsEarned: 0,
  },
  {
    id: "TXN-2024-0135",
    date: "2024-02-15T13:20:00",
    totalAmount: 2340,
    paymentMethod: "Cash",
    cashierName: "Ana Reyes",
    items: [
      {
        id: "ITEM-013",
        name: "Fresh Vegetables Bundle",
        quantity: 1,
        unitPrice: 450,
        total: 450,
      },
      {
        id: "ITEM-014",
        name: "Chicken Breast (1kg)",
        quantity: 2,
        unitPrice: 280,
        total: 560,
      },
      {
        id: "ITEM-015",
        name: "Fish Fillet (500g)",
        quantity: 1,
        unitPrice: 320,
        total: 320,
      },
    ],
    status: "completed",
    pointsEarned: 23,
  },
  {
    id: "TXN-2024-0128",
    date: "2024-02-08T15:10:00",
    totalAmount: 4560,
    paymentMethod: "Credit Card",
    cashierName: "Juan Dela Cruz",
    items: [
      {
        id: "ITEM-016",
        name: "Rice Cooker (Digital)",
        quantity: 1,
        unitPrice: 3200,
        total: 3200,
      },
      {
        id: "ITEM-017",
        name: "Kitchen Towels (Pack)",
        quantity: 2,
        unitPrice: 180,
        total: 360,
      },
    ],
    status: "completed",
    pointsEarned: 46,
  },
  {
    id: "TXN-2024-0120",
    date: "2024-01-30T11:00:00",
    totalAmount: 1780,
    paymentMethod: "GCash",
    cashierName: "Maria Garcia",
    items: [
      {
        id: "ITEM-018",
        name: "Laundry Detergent (3kg)",
        quantity: 2,
        unitPrice: 450,
        total: 900,
      },
      {
        id: "ITEM-019",
        name: "Bleach (1L)",
        quantity: 2,
        unitPrice: 120,
        total: 240,
      },
    ],
    status: "voided",
    voidReason: "Customer changed mind",
    pointsEarned: 0,
  },
  {
    id: "TXN-2024-0115",
    date: "2024-01-25T14:45:00",
    totalAmount: 2890,
    paymentMethod: "Cash",
    cashierName: "Ana Reyes",
    items: [
      {
        id: "ITEM-020",
        name: "Premium Chocolate Box",
        quantity: 2,
        unitPrice: 650,
        total: 1300,
      },
      {
        id: "ITEM-021",
        name: "Wine (Red)",
        quantity: 1,
        unitPrice: 890,
        total: 890,
      },
    ],
    status: "completed",
    pointsEarned: 29,
  },
];

const MOCK_ACTIVITIES: ActivityEvent[] = [
  {
    id: "ACT-001",
    type: "purchase",
    description: "Completed purchase worth ₱3,450",
    timestamp: "2024-03-10T14:30:00",
    amount: 3450,
  },
  {
    id: "ACT-002",
    type: "points_earned",
    description: "Earned 35 loyalty points",
    timestamp: "2024-03-10T14:30:00",
    amount: 35,
  },
  {
    id: "ACT-003",
    type: "purchase",
    description: "Completed purchase worth ₱1,280",
    timestamp: "2024-03-05T10:15:00",
    amount: 1280,
  },
  {
    id: "ACT-004",
    type: "points_redeemed",
    description: "Redeemed 500 points for ₱500 discount",
    timestamp: "2024-03-01T09:00:00",
    amount: 500,
  },
  {
    id: "ACT-005",
    type: "reward_claimed",
    description: "Claimed 'Free Coffee' reward",
    timestamp: "2024-02-28T16:45:00",
  },
  {
    id: "ACT-006",
    type: "note_added",
    description: "Added preference: No plastic straws",
    timestamp: "2024-02-20T10:00:00",
  },
  {
    id: "ACT-007",
    type: "profile_updated",
    description: "Updated mobile number",
    timestamp: "2024-02-15T08:30:00",
  },
];

const MOCK_FAVORITES: FavoriteProduct[] = [
  {
    id: "FAV-001",
    name: "Organic Brown Rice",
    category: "Grains",
    purchaseCount: 12,
    lastPurchased: "2024-03-10",
  },
  {
    id: "FAV-002",
    name: "Fresh Milk 1L",
    category: "Dairy",
    purchaseCount: 18,
    lastPurchased: "2024-03-10",
  },
  {
    id: "FAV-003",
    name: "Premium Ground Coffee",
    category: "Beverages",
    purchaseCount: 8,
    lastPurchased: "2024-03-10",
  },
  {
    id: "FAV-004",
    name: "Whole Wheat Bread",
    category: "Bakery",
    purchaseCount: 15,
    lastPurchased: "2024-03-10",
  },
  {
    id: "FAV-005",
    name: "Detergent Powder",
    category: "Household",
    purchaseCount: 6,
    lastPurchased: "2024-03-05",
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

const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), "MMM d, yyyy • h:mm a");
};

const getTierColor = (tier: string): string => {
  switch (tier) {
    case "Bronze":
      return "bg-amber-700 text-white";
    case "Silver":
      return "bg-slate-400 text-white";
    case "Gold":
      return "bg-yellow-500 text-white";
    case "VIP":
      return "bg-[#2A3A9D] text-white";
    case "Platinum":
      return "bg-[#04397C] text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "refunded":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "voided":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "purchase":
      return ShoppingCart;
    case "points_earned":
      return TrendingUp;
    case "points_redeemed":
      return Minus;
    case "reward_claimed":
      return Gift;
    case "note_added":
      return FileText;
    case "profile_updated":
      return Edit3;
    default:
      return Clock;
  }
};

const getActivityColor = (type: string): string => {
  switch (type) {
    case "purchase":
      return "bg-[#2A3A9D] text-white";
    case "points_earned":
      return "bg-emerald-500 text-white";
    case "points_redeemed":
      return "bg-[#CE2A28] text-white";
    case "reward_claimed":
      return "bg-purple-500 text-white";
    case "note_added":
      return "bg-amber-500 text-white";
    case "profile_updated":
      return "bg-slate-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function CustomerAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[#2A3A9D] text-white font-bold",
        className,
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
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : `Copy ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  loading = false,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="border-slate-100">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-100 hover:border-[#2A3A9D]/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-[#CE2A28]" />
                )}
                <span
                  className={trendUp ? "text-emerald-600" : "text-[#CE2A28]"}
                >
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-[#2A3A9D]/10 p-2">
            <Icon className="h-4 w-4 text-[#2A3A9D]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionStatusBadge({ status }: { status: Transaction["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", getStatusColor(status))}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function TransactionCard({
  transaction,
  onViewDetails,
}: {
  transaction: Transaction;
  onViewDetails: (txn: Transaction) => void;
}) {
  return (
    <Card
      className="border-slate-100 hover:border-[#2A3A9D]/30 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onViewDetails(transaction)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {transaction.id}
            </p>
            <p className="text-xs text-slate-500">
              {formatDateTime(transaction.date)}
            </p>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Total</span>
            <span className="text-base font-bold text-[#2A3A9D]">
              {formatCurrency(transaction.totalAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Payment</span>
            <span className="text-xs font-medium text-slate-700">
              {transaction.paymentMethod}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Cashier</span>
            <span className="text-xs font-medium text-slate-700">
              {transaction.cashierName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Items</span>
            <span className="text-xs font-medium text-slate-700">
              {transaction.items.length} item
              {transaction.items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {transaction.status === "refunded" && transaction.refundTimestamp && (
          <div className="mt-3 p-2 bg-amber-50 rounded-md border border-amber-100">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Refunded on {formatDate(transaction.refundTimestamp)}
            </p>
          </div>
        )}

        {transaction.status === "voided" && transaction.voidReason && (
          <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-100">
            <p className="text-xs text-red-700 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Voided: {transaction.voidReason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionTableRow({
  transaction,
  onViewDetails,
}: {
  transaction: Transaction;
  onViewDetails: (txn: Transaction) => void;
}) {
  return (
    <tr
      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
      onClick={() => onViewDetails(transaction)}
    >
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium text-slate-900">{transaction.id}</p>
          <p className="text-xs text-slate-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-semibold text-[#2A3A9D]">
          {formatCurrency(transaction.totalAmount)}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-slate-600">
          {transaction.paymentMethod}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-slate-600">
          {transaction.cashierName}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs text-slate-600">
          {transaction.items.length} item
          {transaction.items.length !== 1 ? "s" : ""}
        </span>
      </td>
      <td className="py-3 px-4">
        <TransactionStatusBadge status={transaction.status} />
      </td>
      <td className="py-3 px-4">
        <span className="text-xs font-medium text-emerald-600">
          +{transaction.pointsEarned}
        </span>
      </td>
    </tr>
  );
}

function LoyaltyTierBadge({ tier }: { tier: string }) {
  return (
    <Badge className={cn("font-semibold px-3 py-1", getTierColor(tier))}>
      <Award className="h-3 w-3 mr-1" />
      {tier}
    </Badge>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CustomerProfilePage() {
  const [customer] = useState<Customer>(MOCK_CUSTOMER);
  const [loyalty] = useState<LoyaltySummary>(MOCK_LOYALTY);
  const [stats] = useState<CustomerStats>(MOCK_STATS);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [activities] = useState<ActivityEvent[]>(MOCK_ACTIVITIES);
  const [favorites] = useState<FavoriteProduct[]>(MOCK_FAVORITES);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [pointsAction, setPointsAction] = useState<"add" | "redeem">("add");
  const [pointsAmount, setPointsAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Check if birthday is this month
  const isBirthdayMonth = useMemo(() => {
    const today = new Date();
    const birthday = new Date(customer.birthday);
    return today.getMonth() === birthday.getMonth();
  }, [customer.birthday]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.paymentMethod.toLowerCase().includes(query) ||
          t.cashierName.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    return filtered;
  }, [transactions, searchQuery, statusFilter]);

  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePointsAction = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsPointsDialogOpen(false);
      setPointsAmount("");
    }, 1000);
  };

  const calculateAge = (birthday: string | Date) => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  };

  return (
    <section>
      {/* Birthday Banner */}
      {isBirthdayMonth && (
        <div className="bg-[#2A3A9D] text-white px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Cake className="h-4 w-4" />
            <span className="text-sm font-medium">
              🎉 Birthday Month! {customer.fullName} celebrates on{" "}
              {format(new Date(customer.birthday), "MMMM do")}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Customer Profile
              </h1>
              <p className="text-sm text-slate-500">
                View and manage customer details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-[#2A3A9D] text-[#2A3A9D] hover:bg-[#2A3A9D]/10"
              onClick={() => setIsEditSheetOpen(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button className="bg-[#2A3A9D] hover:bg-[#04397C]">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-slate-100 overflow-hidden">
              <div className="bg-[#2A3A9D] h-24" />
              <CardContent className="px-6 pb-6 -mt-12">
                <div className="flex flex-col items-center">
                  <CustomerAvatar
                    name={customer.fullName}
                    className="h-24 w-24 text-2xl border-4 border-white shadow-lg"
                  />
                  <div className="mt-3 text-center">
                    <h2 className="text-xl font-bold text-slate-900">
                      {customer.fullName}
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <LoyaltyTierBadge tier={loyalty.tier} />
                      {isBirthdayMonth && (
                        <Badge className="bg-pink-500 text-white">
                          <Cake className="h-3 w-3 mr-1" />
                          Birthday
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {customer.mobileNumber}
                    </span>
                    <CopyButton
                      text={customer.mobileNumber}
                      label="mobile number"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {customer.email}
                    </span>
                    <CopyButton text={customer.email} label="email" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {formatDate(customer.birthday)} (
                      {calculateAge(customer.birthday)} years)
                    </span>
                  </div>
                  {customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <span className="text-sm text-slate-700">
                        {customer.address}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      Customer since {formatDate(customer.customerSince)}
                    </span>
                  </div>
                </div>

                {customer.tags.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Loyalty Summary */}
            <Card className="border-slate-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#2A3A9D]" />
                  Loyalty Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Current Points</span>
                  <span className="text-2xl font-bold text-[#2A3A9D]">
                    {loyalty.currentPoints.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Progress to{" "}
                      {loyalty.tier === "Platinum" ? "Max" : "Next Tier"}
                    </span>
                    <span className="font-medium text-slate-700">
                      {loyalty.tierProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2A3A9D] rounded-full transition-all"
                      style={{ width: `${loyalty.tierProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {loyalty.nextTierPoints} points needed for next tier
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-slate-900">
                      {loyalty.redeemedPoints.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Redeemed</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-[#2A3A9D]">
                      {loyalty.availableRewards}
                    </p>
                    <p className="text-xs text-slate-500">Rewards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    setPointsAction("add");
                    setIsPointsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Points
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#CE2A28]/20 text-[#CE2A28] hover:bg-red-50"
                  onClick={() => {
                    setPointsAction("redeem");
                    setIsPointsDialogOpen(true);
                  }}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Redeem Points
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#2A3A9D]/20 text-[#2A3A9D] hover:bg-[#2A3A9D]/10"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Reward
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            {customer.notes && (
              <Card className="border-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2A3A9D]" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {customer.notes}
                  </p>
                  {customer.preferences && customer.preferences.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {customer.preferences.map((pref) => (
                        <Badge key={pref} variant="outline" className="text-xs">
                          <Heart className="h-3 w-3 mr-1 text-[#CE2A28]" />
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Spend"
                value={formatCurrency(stats.totalSpend)}
                icon={CreditCard}
                trend="+12%"
                trendUp={true}
              />
              <StatCard
                title="Total Purchases"
                value={stats.totalPurchases.toString()}
                icon={ShoppingCart}
                trend="+5"
                trendUp={true}
              />
              <StatCard
                title="Avg. Purchase"
                value={formatCurrency(stats.averagePurchaseValue)}
                icon={TrendingUp}
              />
              <StatCard
                title="Transactions"
                value={stats.totalTransactions.toString()}
                icon={Package}
              />
              <StatCard
                title="Last Visit"
                value={formatDate(stats.lastVisitDate)}
                icon={Clock}
              />
              <StatCard
                title="Frequency"
                value={stats.visitFrequency}
                icon={Calendar}
              />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-[#2A3A9D] data-[state=active]:text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-[#2A3A9D] data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-[#2A3A9D] data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
              </TabsList>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="mt-4 space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 border-slate-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(["all", "completed", "refunded", "voided"] as const).map(
                      (status) => (
                        <Button
                          key={status}
                          variant={
                            statusFilter === status ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setStatusFilter(status);
                            setCurrentPage(1);
                          }}
                          className={cn(
                            "text-xs capitalize",
                            statusFilter === status &&
                              "bg-[#2A3A9D] hover:bg-[#04397C]",
                          )}
                        >
                          {status}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                  <Card className="border-slate-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Transaction
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Payment
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Cashier
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Items
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((transaction) => (
                              <TransactionTableRow
                                key={transaction.id}
                                transaction={transaction}
                                onViewDetails={setSelectedTransaction}
                              />
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="py-8 text-center">
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                  <ShoppingCart className="h-8 w-8" />
                                  <p className="text-sm">
                                    No transactions found
                                  </p>
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
                <div className="sm:hidden space-y-3">
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onViewDetails={setSelectedTransaction}
                      />
                    ))
                  ) : (
                    <Card className="border-slate-100">
                      <CardContent className="py-8 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <ShoppingCart className="h-8 w-8" />
                          <p className="text-sm">No transactions found</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredTransactions.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-4">
                <Card className="border-slate-100">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-full flex items-center justify-center",
                                  getActivityColor(activity.type),
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              {index < activities.length - 1 && (
                                <div className="w-px h-full bg-slate-200 mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="text-sm font-medium text-slate-900">
                                {activity.description}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {formatDateTime(activity.timestamp)}
                              </p>
                              {activity.amount &&
                                activity.type === "purchase" && (
                                  <p className="text-sm font-semibold text-[#2A3A9D] mt-1">
                                    {formatCurrency(activity.amount)}
                                  </p>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((product) => (
                    <Card
                      key={product.id}
                      className="border-slate-100 hover:border-[#2A3A9D]/20 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.category}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-[#2A3A9D]/10 text-[#2A3A9D]"
                          >
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {product.purchaseCount}x
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>Last purchased</span>
                          <span className="font-medium text-slate-700">
                            {formatDate(product.lastPurchased)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#2A3A9D]" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              {selectedTransaction && formatDateTime(selectedTransaction.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Transaction ID</span>
                <span className="text-sm font-mono font-medium">
                  {selectedTransaction.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Total Amount</p>
                  <p className="text-lg font-bold text-[#2A3A9D]">
                    {formatCurrency(selectedTransaction.totalAmount)}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Points Earned</p>
                  <p className="text-lg font-bold text-emerald-600">
                    +{selectedTransaction.pointsEarned}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Payment Method</span>
                  <span className="font-medium">
                    {selectedTransaction.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Cashier</span>
                  <span className="font-medium">
                    {selectedTransaction.cashierName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Status</span>
                  <TransactionStatusBadge status={selectedTransaction.status} />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Items Purchased</h4>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTransaction.status === "refunded" &&
                selectedTransaction.refundTimestamp && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Refunded on{" "}
                      {formatDateTime(selectedTransaction.refundTimestamp)}
                    </p>
                  </div>
                )}

              {selectedTransaction.status === "voided" &&
                selectedTransaction.voidReason && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Void Reason: {selectedTransaction.voidReason}
                    </p>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTransaction(null)}
            >
              Close
            </Button>
            <Button className="bg-[#2A3A9D] hover:bg-[#04397C]">
              <FileText className="h-4 w-4 mr-2" />
              View Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Points Dialog */}
      <Dialog open={isPointsDialogOpen} onOpenChange={setIsPointsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pointsAction === "add"
                ? "Add Loyalty Points"
                : "Redeem Loyalty Points"}
            </DialogTitle>
            <DialogDescription>
              {pointsAction === "add"
                ? "Add points to customer's loyalty account"
                : "Redeem points from customer's loyalty account"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Current Balance</p>
              <p className="text-2xl font-bold text-[#2A3A9D]">
                {loyalty.currentPoints.toLocaleString()} pts
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Points to {pointsAction === "add" ? "Add" : "Redeem"}
              </label>
              <Input
                type="number"
                placeholder="Enter points amount"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                className="border-slate-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPointsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePointsAction}
              disabled={!pointsAmount || loading}
              className={cn(
                pointsAction === "add"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#CE2A28] hover:bg-red-700",
              )}
            >
              {loading
                ? "Processing..."
                : pointsAction === "add"
                  ? "Add Points"
                  : "Redeem Points"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit Customer Profile</SheetTitle>
            <SheetDescription>Update customer information</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <Input
                defaultValue={customer.fullName}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Mobile Number
              </label>
              <Input
                defaultValue={customer.mobileNumber}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                defaultValue={customer.email}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Birthday
              </label>
              <Input
                type="date"
                defaultValue={customer.birthday}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input
                defaultValue={customer.address}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Notes
              </label>
              <Input
                defaultValue={customer.notes}
                className="border-slate-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#2A3A9D] hover:bg-[#04397C]"
              onClick={() => setIsEditSheetOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
