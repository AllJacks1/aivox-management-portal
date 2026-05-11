import { COLORS } from "@/styles/colors";
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
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Package, label: "Inventory Management", active: false },
  { icon: Warehouse, label: "Warehouse Stocks", active: false },
  { icon: Monitor, label: "Display Stocks", active: false },
  { icon: ShoppingCart, label: "POS Sales", active: false },
  { icon: Users, label: "CRM Customers", active: false },
  { icon: Truck, label: "Supplier Management", active: false },
  { icon: UserCog, label: "Employee Management", active: false },
  { icon: Clock, label: "Attendance", active: false },
  { icon: DollarSign, label: "Payroll", active: false },
  { icon: FileText, label: "Payslip Generator", active: false },
  { icon: Receipt, label: "Expense Tracker", active: false },
  { icon: TrendingUp, label: "Reports Dashboard", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Sidebar() {
  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 flex flex-col overflow-y-auto"
      style={{ backgroundColor: COLORS.sidebar }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          TireShop ERP
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                item.active
                  ? "text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              style={item.active ? { backgroundColor: COLORS.activeItem } : {}}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${item.active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
