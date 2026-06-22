"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  ClipboardList,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  ShelvingUnit,
  SquareTerminal,
  UserRoundPlus,
  Wallet,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { BrandName, SidebarLogoPath } from "@/lib/banding/brand";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: Wallet,
      items: [
        {
          title: "New Transaction",
          url: "/transactions/new",
        },
        {
          title: "Transaction History",
          url: "/transactions/history",
        },
        {
          title: "Track Status",
          url: "/transactions/status",
        },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: UserRoundPlus,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: ShelvingUnit,
      items: [
        {
          title: "Low Stock Alerts",
          url: "/inventory/low-stock",
        },
        {
          title: "Manage Inventory",
          url: "/inventory/manage",
        },
        {
          title: "Stock Movements",
          url: "/inventory/movements",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: ClipboardList,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Report Bug",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="relative w-full h-full">
                  <Image
                    src={SidebarLogoPath}
                    alt={`${BrandName} Logo`}
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
