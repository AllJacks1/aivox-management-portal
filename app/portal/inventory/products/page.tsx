// app/inventory/products/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Pencil,
  Archive,
  ArrowUpDown,
  Package,
  ImageIcon,
  X,
  ChevronDown,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COLORS } from "@/styles/colors";
import Pagination from "@/components/sections/Pagination";

// ─── Types ───────────────────────────────────────────────────────
interface Product {
  id: string;
  image?: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplier?: string;
  isArchived?: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Michelin Pilot Sport 4",
    sku: "MICH-PS4-225",
    barcode: "123456789012",
    category: "Summer Tires",
    description: "Ultra-high performance summer tire",
    costPrice: 180.0,
    sellingPrice: 299.99,
    currentStock: 45,
    minimumStock: 10,
    unit: "pcs",
    status: "In Stock",
    supplier: "Michelin Corp",
  },
  {
    id: "2",
    name: "Bridgestone Potenza RE-71R",
    sku: "BRID-RE71-245",
    barcode: "123456789013",
    category: "Performance Tires",
    description: "Extreme performance summer tire",
    costPrice: 220.0,
    sellingPrice: 349.99,
    currentStock: 8,
    minimumStock: 12,
    unit: "pcs",
    status: "Low Stock",
    supplier: "Bridgestone Inc",
  },
  {
    id: "3",
    name: "Goodyear Eagle F1 Asymmetric",
    sku: "GOOD-F1A-235",
    barcode: "123456789014",
    category: "Summer Tires",
    description: "Premium ultra-high performance",
    costPrice: 195.0,
    sellingPrice: 319.99,
    currentStock: 0,
    minimumStock: 8,
    unit: "pcs",
    status: "Out of Stock",
    supplier: "Goodyear Tires",
  },
  {
    id: "4",
    name: "Pirelli P Zero",
    sku: "PIRE-PZ-255",
    barcode: "123456789015",
    category: "Performance Tires",
    description: "Max performance summer tire",
    costPrice: 250.0,
    sellingPrice: 399.99,
    currentStock: 23,
    minimumStock: 15,
    unit: "pcs",
    status: "In Stock",
    supplier: "Pirelli & C",
  },
  {
    id: "5",
    name: "Continental SportContact 7",
    sku: "CONT-SC7-245",
    barcode: "123456789016",
    category: "Ultra High Performance",
    description: "Latest generation sport tire",
    costPrice: 210.0,
    sellingPrice: 359.99,
    currentStock: 0,
    minimumStock: 5,
    unit: "pcs",
    status: "Out of Stock",
    supplier: "Continental AG",
  },
  {
    id: "6",
    name: "Yokohama Advan Neova AD09",
    sku: "YOKO-AD09-225",
    barcode: "123456789017",
    category: "Track Tires",
    description: "Competition-grade street tire",
    costPrice: 175.0,
    sellingPrice: 279.99,
    currentStock: 67,
    minimumStock: 20,
    unit: "pcs",
    status: "In Stock",
    supplier: "Yokohama Rubber",
  },
];

const categories = [
  "All",
  "Summer Tires",
  "Performance Tires",
  "Ultra High Performance",
  "Track Tires",
  "Winter Tires",
  "All-Season Tires",
];

const units = ["pcs", "box", "kg", "set", "pair"];

// ─── Status Badge Component ─────────────────────────────────────
function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
    "Out of Stock": "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      {status}
    </Badge>
  );
}

// ─── Product Form Component ─────────────────────────────────────
function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product?: Product;
  onSave: (product: Omit<Product, "id" | "status">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    category: product?.category || "",
    description: product?.description || "",
    costPrice: product?.costPrice?.toString() || "",
    sellingPrice: product?.sellingPrice?.toString() || "",
    currentStock: product?.currentStock?.toString() || "",
    minimumStock: product?.minimumStock?.toString() || "",
    unit: product?.unit || "pcs",
    supplier: product?.supplier || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      currentStock: parseInt(formData.currentStock) || 0,
      minimumStock: parseInt(formData.minimumStock) || 0,
    });
  };

  const inputClass =
    "bg-gray-50 border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className={inputClass}
            placeholder="Enter SKU"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) =>
              setFormData({ ...formData, barcode: e.target.value })
            }
            className={inputClass}
            placeholder="Enter barcode"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={cn(inputClass, "min-h-[80px]")}
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price ($) *</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) =>
              setFormData({ ...formData, costPrice: e.target.value })
            }
            className={inputClass}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price ($) *</Label>
          <Input
            id="sellingPrice"
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) =>
              setFormData({ ...formData, sellingPrice: e.target.value })
            }
            className={inputClass}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentStock">Current Stock *</Label>
          <Input
            id="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={(e) =>
              setFormData({ ...formData, currentStock: e.target.value })
            }
            className={inputClass}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumStock">Minimum Stock *</Label>
          <Input
            id="minimumStock"
            type="number"
            value={formData.minimumStock}
            onChange={(e) =>
              setFormData({ ...formData, minimumStock: e.target.value })
            }
            className={inputClass}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Select
            value={formData.unit}
            onValueChange={(v) => setFormData({ ...formData, unit: v })}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          value={formData.supplier}
          onChange={(e) =>
            setFormData({ ...formData, supplier: e.target.value })
          }
          className={inputClass}
          placeholder="Enter supplier name"
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          style={{ backgroundColor: COLORS.primary }}
          className="hover:opacity-90 text-white"
        >
          {product ? "Update Product" : "Add Product"}
        </Button>
      </DialogFooter>
    </form>
  );
}



// ─── Main Products Page ─────────────────────────────────────────
export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate status based on stock levels
  const calculateStatus = (
    current: number,
    minimum: number,
  ): Product["status"] => {
    if (current === 0) return "Out of Stock";
    if (current <= minimum) return "Low Stock";
    return "In Stock";
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => !p.isArchived);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [
    products,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAdd = (data: Omit<Product, "id" | "status">) => {
    const newProduct: Product = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: calculateStatus(data.currentStock, data.minimumStock),
    };
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (data: Omit<Product, "id" | "status">) => {
    if (!editingProduct) return;
    const updated: Product = {
      ...data,
      id: editingProduct.id,
      status: calculateStatus(data.currentStock, data.minimumStock),
    };
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? updated : p)),
    );
    setEditingProduct(null);
  };

  const handleArchive = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isArchived: true } : p)),
    );
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your tire inventory and track stock levels
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSave={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-white border-gray-200">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200">
              <Package className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">
                  Image
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("name")}
                >
                  <span className="flex items-center gap-1">
                    Product
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("sku")}
                >
                  <span className="flex items-center gap-1">
                    SKU
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("currentStock")}
                >
                  <span className="flex items-center gap-1">
                    Stock
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("sellingPrice")}
                >
                  <span className="flex items-center gap-1">
                    Price
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No products found
                    </p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        {product.barcode && (
                          <p className="text-xs text-gray-400">
                            {product.barcode}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {product.currentStock}
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.unit}
                        </span>
                        <span className="text-xs text-gray-400">
                          (min: {product.minimumStock})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${product.sellingPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Cost: ${product.costPrice.toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => setViewProduct(product)}
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600"
                            onClick={() => handleArchive(product.id)}
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSave={handleEdit}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewProduct}
        onOpenChange={(open) => !open && setViewProduct(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {viewProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500">{viewProduct.sku}</p>
                  <StatusBadge status={viewProduct.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">
                    {viewProduct.category}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Barcode</p>
                  <p className="font-medium text-gray-900">
                    {viewProduct.barcode || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Cost Price</p>
                  <p className="font-medium text-gray-900">
                    ${viewProduct.costPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Selling Price</p>
                  <p className="font-medium text-gray-900">
                    ${viewProduct.sellingPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Current Stock</p>
                  <p className="font-medium text-gray-900">
                    {viewProduct.currentStock} {viewProduct.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Minimum Stock</p>
                  <p className="font-medium text-gray-900">
                    {viewProduct.minimumStock} {viewProduct.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Supplier</p>
                  <p className="font-medium text-gray-900">
                    {viewProduct.supplier || "N/A"}
                  </p>
                </div>
              </div>

              {viewProduct.description && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Description</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {viewProduct.description}
                  </p>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setViewProduct(null);
                    setEditingProduct(viewProduct);
                  }}
                  style={{ backgroundColor: COLORS.primary }}
                  className="text-white hover:opacity-90"
                >
                  Edit Product
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
