import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> products
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={idx}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={cn(
                "h-8 w-8 p-0 text-sm font-medium",
                currentPage === page
                  ? "bg-[#2A3A9D] text-white hover:bg-[#252f7a] hover:text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              )}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}