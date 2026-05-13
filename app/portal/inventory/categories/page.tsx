"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { COLORS } from "@/styles/colors";

// ─── Types ───────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  productCount: number;
}

// ─── Mock Data ──────────────────────────────────────────────────
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Summer Tires",
    description: "High-performance tires for warm weather conditions",
    isActive: true,
    productCount: 24,
  },
  {
    id: "2",
    name: "Winter Tires",
    description: "Specialized tires for snow and cold temperatures",
    isActive: true,
    productCount: 18,
  },
  {
    id: "3",
    name: "All-Season Tires",
    description: "Versatile tires for year-round use",
    isActive: true,
    productCount: 31,
  },
  {
    id: "4",
    name: "Performance Tires",
    description: "Ultra-high performance for sports vehicles",
    isActive: true,
    productCount: 12,
  },
  {
    id: "5",
    name: "Off-Road Tires",
    description: "Heavy-duty tires for trucks and SUVs",
    isActive: false,
    productCount: 0,
  },
  {
    id: "6",
    name: "Track Tires",
    description: "Competition-grade tires for racing",
    isActive: true,
    productCount: 8,
  },
];

// ─── Category Form ──────────────────────────────────────────────
function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category?: Category;
  onSave: (data: Omit<Category, "id" | "productCount">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
          placeholder="e.g. Summer Tires"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20 min-h-[80px]"
          placeholder="Brief description of this category"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="active" className="text-sm font-medium">
            Active Status
          </Label>
          <p className="text-xs text-gray-500">
            Inactive categories won't appear in product dropdowns
          </p>
        </div>
        <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
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
          {category ? "Update Category" : "Add Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Main Categories Page ───────────────────────────────────────
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  const handleAdd = (data: Omit<Category, "id" | "productCount">) => {
    const newCategory: Category = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      productCount: 0,
    };
    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (data: Omit<Category, "id" | "productCount">) => {
    if (!editingCategory) return;
    setCategories(
      categories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...data } : c,
      ),
    );
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const toggleActive = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your products into simple groups
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSave={handleAdd}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {categories.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {activeCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white border-gray-200 focus:border-[#2A3A9D] focus:ring-[#2A3A9D]/20"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No categories found</p>
          <p className="text-sm text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : "Add your first category to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "bg-white rounded-xl border p-5 shadow-sm transition-all duration-200",
                category.isActive
                  ? "border-gray-100 hover:shadow-md"
                  : "border-gray-200 bg-gray-50/50",
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    category.isActive ? "bg-[#2A3A9D]/10" : "bg-gray-200",
                  )}
                >
                  <Tag
                    className={cn(
                      "w-5 h-5",
                      category.isActive ? "text-[#2A3A9D]" : "text-gray-400",
                    )}
                  />
                </div>

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
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => toggleActive(category.id)}
                    >
                      {category.isActive ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3
                className={cn(
                  "font-semibold text-gray-900",
                  !category.isActive && "text-gray-500",
                )}
              >
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {category.description || "No description"}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {category.productCount} product
                  {category.productCount !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-1.5">
                  {category.isActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-xs font-medium text-gray-500">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSave={handleEdit}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
