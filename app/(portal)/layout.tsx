"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/sections/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Page({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Generate dynamic breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { href, label };
  });

  // Optional: Custom route titles (more polished names)
  const routeTitles: Record<string, string> = {
    reports: "Reports",
    dashboard: "Dashboard",
    inventory: "Inventory",
    products: "Products",
    sales: "Sales",
    customers: "Customers",
    // Add more as needed
  };

  const currentPageTitle =
    routeTitles[pathSegments[pathSegments.length - 1] || ""] ||
    breadcrumbs[breadcrumbs.length - 1]?.label ||
    "Dashboard";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />

              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>

                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>

              {/* Optional: Page Title on the right */}
              <div className="ml-auto text-lg font-semibold text-zinc-900 hidden sm:block">
                {currentPageTitle}
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}