"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({
  onMenuClick,
  showMenuButton = false,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Button (only shows when sidebar is hidden) */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Search - Desktop always visible, Mobile collapsible */}
        <div
          className={cn(
            "flex items-center flex-1 transition-all duration-200",
            isSearchOpen
              ? "max-w-full absolute left-0 right-0 px-4 z-30 bg-white h-16"
              : "max-w-md hidden sm:flex",
          )}
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3A9D]/20 focus:border-[#2A3A9D] transition-all"
            />
            {/* Mobile close search */}
            {isSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Toggle */}
        {!isSearchOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden h-9 w-9 text-gray-500 hover:bg-gray-100"
          >
            <Search className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#2A3A9D] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* User Profile - Desktop Dropdown, Mobile Compact */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 hover:bg-gray-50 rounded-lg py-1.5 pr-2 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  admin@tireshop.com
                </p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2A3A9D]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A3A9D]" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@tireshop.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
