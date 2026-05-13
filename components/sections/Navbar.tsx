"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Monitor,
  ShoppingCart,
  Users,
  Truck,
  UserCog,
  Clock,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
import { COLORS } from "@/styles/colors";

// ─── Types ───────────────────────────────────────────────────────
interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SubItem[];
}

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

// ─── Navigation Data ────────────────────────────────────────────
const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  {
    icon: Package,
    label: "Inventory",
    href: "/portal/inventory",
    subItems: [
      { label: "Products", href: "/portal/inventory/products" },
      { label: "Categories", href: "/portal/inventory/categories" },
      { label: "Stock Levels", href: "/portal/inventory/stock-levels" },
      { label: "Stock Adjustments", href: "/portal/inventory/adjustments" },
      { label: "Low Stock Alerts", href: "/portal/inventory/alerts" },
      { label: "Inventory Reports", href: "/portal/inventory/reports" },
    ],
  },
  {
    icon: Warehouse,
    label: "Warehouse",
    href: "/portal/warehouse",
    subItems: [
      { label: "Incoming Stocks", href: "/portal/warehouse/incoming" },
      { label: "Outgoing Stocks", href: "/portal/warehouse/outgoing" },
      { label: "Transfers", href: "/portal/warehouse/transfers" },
      { label: "Warehouse Reports", href: "/portal/warehouse/reports" },
    ],
  },
  {
    icon: Monitor,
    label: "Display",
    href: "/display",
    subItems: [
      { label: "Display Inventory", href: "/display/inventory" },
      { label: "Restocking", href: "/display/restocking" },
      { label: "Pullouts", href: "/display/pullouts" },
    ],
  },
  {
    icon: ShoppingCart,
    label: "POS Sales",
    href: "/pos",
    subItems: [
      { label: "New Sale", href: "/pos/new" },
      { label: "Transactions", href: "/pos/transactions" },
      { label: "Receipts", href: "/pos/receipts" },
      { label: "Discounts", href: "/pos/discounts" },
      { label: "Daily Sales Report", href: "/pos/daily-report" },
    ],
  },
  {
    icon: Users,
    label: "CRM",
    href: "/crm",
    subItems: [
      { label: "Customer List", href: "/crm/customers" },
      { label: "Customer Profiles", href: "/crm/profiles" },
      { label: "Purchase History", href: "/crm/history" },
      { label: "Loyalty Points", href: "/crm/loyalty" },
    ],
  },
  {
    icon: Truck,
    label: "Suppliers",
    href: "/suppliers",
    subItems: [
      { label: "Supplier List", href: "/suppliers/list" },
      { label: "Purchase Orders", href: "/suppliers/orders" },
      { label: "Deliveries", href: "/suppliers/deliveries" },
      { label: "Supplier Payments", href: "/suppliers/payments" },
    ],
  },
  {
    icon: UserCog,
    label: "Employees",
    href: "/employees",
    subItems: [
      { label: "Employee List", href: "/employees/list" },
      { label: "Departments", href: "/employees/departments" },
      { label: "Roles", href: "/employees/roles" },
    ],
  },
  {
    icon: Clock,
    label: "Attendance",
    href: "/attendance",
    subItems: [
      { label: "Time In/Out", href: "/attendance/time-clock" },
      { label: "Attendance Logs", href: "/attendance/logs" },
      { label: "Leave Requests", href: "/attendance/leave" },
      { label: "Overtime", href: "/attendance/overtime" },
    ],
  },
  {
    icon: DollarSign,
    label: "Payroll",
    href: "/payroll",
    subItems: [
      { label: "Salary Computation", href: "/payroll/computation" },
      { label: "Deductions", href: "/payroll/deductions" },
      { label: "Payroll History", href: "/payroll/history" },
    ],
  },
  {
    icon: FileText,
    label: "Payslips",
    href: "/payslips",
    subItems: [
      { label: "Generate Payslip", href: "/payslips/generate" },
      { label: "Download PDF", href: "/payslips/download" },
      { label: "Payslip History", href: "/payslips/history" },
    ],
  },
  {
    icon: Receipt,
    label: "Expenses",
    href: "/expenses",
    subItems: [
      { label: "Add Expense", href: "/expenses/add" },
      { label: "Expense Categories", href: "/expenses/categories" },
      { label: "Expense Reports", href: "/expenses/reports" },
    ],
  },
  { icon: TrendingUp, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

// ─── NavItem Component ──────────────────────────────────────────
function NavItemComponent({
  item,
  isCollapsed,
  expandedItems,
  toggleExpand,
  pathname,
}: {
  item: NavItem;
  isCollapsed: boolean;
  expandedItems: Set<string>;
  toggleExpand: (label: string) => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedItems.has(item.label);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const isSubActive = item.subItems?.some((sub) => pathname === sub.href);

  if (isCollapsed) {
    return (
      <div className="relative group">
        <Link
          href={item.href || "#"}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              toggleExpand(item.label);
            }
          }}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg mx-auto transition-all duration-200",
            isActive || isSubActive
              ? "text-white shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/10",
          )}
          style={
            isActive || isSubActive
              ? { backgroundColor: COLORS.activeItem }
              : {}
          }
          title={item.label}
        >
          <Icon className="w-5 h-5" />
        </Link>

        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
          {item.label}
        </div>

        {/* Submenu popover for collapsed state */}
        {hasSubItems && isExpanded && (
          <div
            className="absolute left-full top-0 ml-2 w-48 rounded-lg shadow-xl border border-white/10 py-2 z-50"
            style={{ backgroundColor: COLORS.sidebar }}
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-1">
              {item.label}
            </div>
            {item.subItems!.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                className={cn(
                  "block px-3 py-2 text-sm transition-colors",
                  pathname === sub.href
                    ? "text-white bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {hasSubItems ? (
        // ─── Parent Category (has subitems) ─────────────────────────
        // Clicking toggles expand/collapse. Subitems are Links inside.
        <button
          onClick={() => toggleExpand(item.label)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive || isSubActive
              ? "text-white shadow-sm"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          style={
            isActive || isSubActive
              ? { backgroundColor: COLORS.activeItem }
              : {}
          }
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon
              className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive || isSubActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white",
              )}
            />
            <span className="truncate">{item.label}</span>
          </div>

          <div
            className={cn(
              "flex-shrink-0 text-slate-400 group-hover:text-white transition-transform duration-300",
              isExpanded && "rotate-180",
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>
      ) : (
        // ─── Leaf Item (no subitems) ────────────────────────────────
        // Clicking navigates via next/link. No expand behavior.
        <Link
          href={item.href || "#"}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive
              ? "text-white shadow-sm"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          style={isActive ? { backgroundColor: COLORS.activeItem } : {}}
        >
          <Icon
            className={cn(
              "w-5 h-5 flex-shrink-0",
              isActive ? "text-white" : "text-slate-400 group-hover:text-white",
            )}
          />
          <span className="truncate">{item.label}</span>
        </Link>
      )}

      {/* Sub Items - only render for parent categories */}
      {hasSubItems && (
        <div
          className="grid transition-all duration-300 ease-in-out"
          style={{
            gridTemplateRows: isExpanded ? "1fr" : "0fr",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="pl-11 pr-2 space-y-0.5 py-1">
              {item.subItems!.map((sub, subIdx) => (
                <Link
                  key={subIdx}
                  href={sub.href}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150",
                    pathname === sub.href
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full flex-shrink-0",
                        pathname === sub.href ? "bg-white" : "bg-slate-500",
                      )}
                    />
                    <span className="truncate">{sub.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Sidebar Component ─────────────────────────────────────
export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  isCollapsed = false,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["Inventory"]),
  );

  // Use external state if provided, otherwise internal
  const mobileSheetOpen = mobileOpen ?? internalMobileOpen;
  const setMobileSheetOpen = setMobileOpen ?? setInternalMobileOpen;

  // Auto-expand parent if child is active
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subItems?.some((sub) => pathname === sub.href)) {
        setExpandedItems((prev) => new Set([...prev, item.label]));
      }
    });
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleCollapseToggle = () => {
    setIsCollapsed?.(!isCollapsed);
  };

  // ─── Mobile Sidebar (Sheet) ─────────────────────────────────
  const MobileSidebar = () => (
    <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 p-0 border-r-0 flex flex-col overflow-hidden"
        style={{ backgroundColor: COLORS.sidebar }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.activeItem }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="relative h-12 w-36 overflow-hidden flex-shrink-0">
              <Image
                src="/astra_management_logo.png"
                alt="Astra Management Hub Logo"
                fill={true}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Mobile Nav - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <NavItemComponent
                key={idx}
                item={item}
                isCollapsed={false}
                expandedItems={expandedItems}
                toggleExpand={(label) => toggleExpand(label)}
                pathname={pathname}
              />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  // ─── Desktop Sidebar ────────────────────────────────────────
  const DesktopSidebar = () => (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64",
      )}
      style={{ backgroundColor: COLORS.sidebar }}
    >
      {/* Logo Area */}
      <div
        className={cn(
          "flex items-center border-b border-white/10 transition-all duration-300 flex-shrink-0",
          isCollapsed ? "justify-center px-2 py-4" : "px-5 py-5 gap-3",
        )}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: COLORS.activeItem }}
        >
          <Package className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="relative h-10 w-32 overflow-hidden flex-shrink-0">
            <Image
              src="/astra_management_logo.png"
              alt="Astra Management Hub Logo"
              fill={true}
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <div
        className={cn(
          "flex border-b border-white/5 flex-shrink-0",
          isCollapsed ? "justify-center py-2" : "justify-end px-3 py-2",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapseToggle}
          className="text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation - Scrollable with custom scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <nav className={cn("space-y-1", isCollapsed && "space-y-3")}>
          {navItems.map((item, idx) => (
            <NavItemComponent
              key={idx}
              item={item}
              isCollapsed={isCollapsed}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}
