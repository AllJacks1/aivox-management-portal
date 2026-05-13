"use client";
import Pagination from "@/components/sections/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COLORS } from "@/styles/colors";
import { ArrowRight, FileText, Monitor, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface StockMovementLog {
  id: string;
  pulloutId: string;
  product: string;
  quantity: number;
  from: string;
  to: string;
  type: "pullout";
  timestamp: string;
}

const movementLogs: StockMovementLog[] = [
  {
    id: "MOV-001",
    pulloutId: "PO-2026-0042",
    product: "Coca-Cola 500ml",
    quantity: 12,
    from: "Aisle 3 - Shelf B",
    to: "Disposal",
    type: "pullout",
    timestamp: "2026-05-13T10:15:00",
  },
  {
    id: "MOV-002",
    pulloutId: "PO-2026-0045",
    product: "Michelin Pilot Sport 4",
    quantity: 2,
    from: "Showroom - Tire Section",
    to: "Main Warehouse",
    type: "pullout",
    timestamp: "2026-05-12T09:10:00",
  },
  {
    id: "MOV-003",
    pulloutId: "PO-2026-0047",
    product: "Pirelli P Zero",
    quantity: 3,
    from: "Selling Area - Premium",
    to: "Main Warehouse",
    type: "pullout",
    timestamp: "2026-05-11T10:05:00",
  },
];

const ITEMS_PER_PAGE = 10;

export default function DisplayInventoryLogsPage() {
  const [logs, setLogs] = useState<StockMovementLog[]>(movementLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.id.toLowerCase().includes(q) ||
        log.pulloutId.toLowerCase().includes(q) ||
        log.product.toLowerCase().includes(q) ||
        log.from.toLowerCase().includes(q) ||
        log.to.toLowerCase().includes(q),
    );
  }, [logs, searchQuery]);

  // Pagination calculations
  const totalItems = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Reset to page 1 when search changes
  const safePage = Math.min(currentPage, totalPages);

  const paginatedLogs = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, safePage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" style={{ color: COLORS.primary }} />
        <h2
          className="text-lg font-semibold"
          style={{ color: COLORS.textPrimary }}
        >
          Stock Movement Logs
        </h2>
        <Badge
          variant="outline"
          className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
        >
          {totalItems} entries
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by ID, pullout ref, product, or location..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 h-10 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          />
        </div>
      </div>

      <Card
        className="border-gray-100 shadow-sm overflow-hidden"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Log ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pullout Ref
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                  Qty
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  From → To
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td
                      className="py-3 px-4 text-sm font-medium"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {log.id}
                    </td>
                    <td
                      className="py-3 px-4 text-sm"
                      style={{ color: COLORS.textMuted }}
                    >
                      {log.pulloutId}
                    </td>
                    <td
                      className="py-3 px-4 text-sm"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {log.product}
                    </td>
                    <td className="py-3 px-4 text-center text-sm font-bold text-red-600">
                      -{log.quantity}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Monitor className="w-3.5 h-3.5 text-gray-400" />
                        <span style={{ color: COLORS.textSecondary }}>
                          {log.from}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <span
                          style={{
                            color:
                              log.to === "Disposal" ? "#EF4444" : "#3B82F6",
                          }}
                        >
                          {log.to}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-xs"
                      style={{ color: COLORS.textMuted }}
                    >
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-4 text-center text-sm text-gray-400"
                  >
                    No matching logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </section>
  );
}
