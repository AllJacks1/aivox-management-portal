"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIMARY_COLOR = "#20B757";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  unitPrice: number;
  unit: string;
  supplier: string;
}

export default function ManageInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "ITEM-001",
      name: "Coca-Cola 1.5L",
      sku: "CKE150",
      category: "Beverages",
      currentStock: 8,
      reorderPoint: 20,
      unitPrice: 95,
      unit: "bottles",
      supplier: "Coca-Cola PH",
    },
    {
      id: "ITEM-002",
      name: "Potato Chips Classic",
      sku: "CHP001",
      category: "Snacks",
      currentStock: 42,
      reorderPoint: 30,
      unitPrice: 40,
      unit: "packs",
      supplier: "Universal Robina",
    },
    {
      id: "ITEM-003",
      name: "White Bread Loaf",
      sku: "BRD001",
      category: "Bakery",
      currentStock: 15,
      reorderPoint: 15,
      unitPrice: 65,
      unit: "pieces",
      supplier: "Gardenia",
    },
    {
      id: "ITEM-004",
      name: "Mineral Water 1L",
      sku: "WTR001",
      category: "Beverages",
      currentStock: 68,
      reorderPoint: 40,
      unitPrice: 25,
      unit: "bottles",
      supplier: "Nature's Spring",
    },
    {
      id: "ITEM-005",
      name: "Eggs Tray (30pcs)",
      sku: "EGG030",
      category: "Dairy & Eggs",
      currentStock: 12,
      reorderPoint: 10,
      unitPrice: 180,
      unit: "trays",
      supplier: "Local Supplier",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  const categories = ["All", "Beverages", "Snacks", "Bakery", "Dairy & Eggs"];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = inventory.length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0,
  );
  const lowStockCount = inventory.filter(
    (item) => item.currentStock <= item.reorderPoint,
  ).length;

  const updateStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: Math.max(0, newStock) }
          : item,
      ),
    );
  };

  const saveNewItem = () => {
    if (!newItem.name || !newItem.sku) {
      alert("Name and SKU are required");
      return;
    }
    const item: InventoryItem = {
      id: `ITEM-${String(inventory.length + 1001).padStart(3, "0")}`,
      name: newItem.name,
      sku: newItem.sku,
      category: newItem.category || "Others",
      currentStock: newItem.currentStock || 0,
      reorderPoint: newItem.reorderPoint || 10,
      unitPrice: newItem.unitPrice || 0,
      unit: newItem.unit || "pcs",
      supplier: newItem.supplier || "Unknown",
    };
    setInventory([...inventory, item]);
    setIsAddOpen(false);
    setNewItem({});
    alert("Product added successfully!");
  };

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Manage Inventory
            </h1>
            <p className="text-zinc-600 mt-1">
              Add, update, and track all your products
            </p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Plus className="mr-2" size={20} />
            Add New Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Products",
              value: totalProducts,
              icon: <Package className="text-zinc-600" />,
            },
            {
              label: "Inventory Value",
              value: `₱${totalValue.toLocaleString()}`,
              icon: <Package className="text-emerald-600" />,
            },
            {
              label: "Low Stock Items",
              value: lowStockCount,
              icon: <AlertTriangle className="text-amber-600" />,
            },
            {
              label: "Categories",
              value: 5,
              icon: <Package className="text-zinc-600" />,
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-zinc-100 rounded-2xl">{stat.icon}</div>
                <div>
                  <p className="text-sm text-zinc-600">{stat.label}</p>
                  <p className="text-4xl font-bold text-zinc-900 mt-1">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-3.5 text-zinc-400"
                  size={20}
                />
                <Input
                  placeholder="Search by product name or SKU..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products ({filteredInventory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder Point</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const isLowStock = item.currentStock <= item.reorderPoint;
                  return (
                    <TableRow key={item.id} className="hover:bg-zinc-50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            value={item.currentStock}
                            onChange={(e) =>
                              updateStock(item.id, parseInt(e.target.value))
                            }
                            className="w-16 text-right border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="text-xs text-zinc-500">
                            {item.unit}
                          </span>
                          {isLowStock && (
                            <AlertTriangle
                              className="text-amber-500"
                              size={16}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-zinc-600">
                        {item.reorderPoint}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₱{item.unitPrice}
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600">
                        {item.supplier}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Edit2 size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm("Delete this product?")) {
                                setInventory(
                                  inventory.filter((i) => i.id !== item.id),
                                );
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog
        open={isAddOpen || !!selectedItem}
        onOpenChange={() => {
          setIsAddOpen(false);
          setSelectedItem(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={selectedItem?.name || newItem.name || ""}
                onChange={(e) =>
                  selectedItem
                    ? setSelectedItem({ ...selectedItem, name: e.target.value })
                    : setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SKU</Label>
                <Input
                  value={selectedItem?.sku || newItem.sku || ""}
                  onChange={(e) =>
                    selectedItem
                      ? setSelectedItem({
                          ...selectedItem,
                          sku: e.target.value,
                        })
                      : setNewItem({ ...newItem, sku: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={selectedItem?.category || newItem.category || ""}
                  onValueChange={(v) =>
                    selectedItem
                      ? setSelectedItem({ ...selectedItem, category: v })
                      : setNewItem({ ...newItem, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Beverages",
                      "Snacks",
                      "Bakery",
                      "Dairy & Eggs",
                      "Others",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Current Stock</Label>
                <Input
                  type="number"
                  value={
                    selectedItem?.currentStock || newItem.currentStock || ""
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    selectedItem
                      ? setSelectedItem({ ...selectedItem, currentStock: val })
                      : setNewItem({ ...newItem, currentStock: val });
                  }}
                />
              </div>
              <div>
                <Label>Reorder Point</Label>
                <Input
                  type="number"
                  value={
                    selectedItem?.reorderPoint || newItem.reorderPoint || ""
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    selectedItem
                      ? setSelectedItem({ ...selectedItem, reorderPoint: val })
                      : setNewItem({ ...newItem, reorderPoint: val });
                  }}
                />
              </div>
              <div>
                <Label>Unit Price (₱)</Label>
                <Input
                  type="number"
                  value={selectedItem?.unitPrice || newItem.unitPrice || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    selectedItem
                      ? setSelectedItem({ ...selectedItem, unitPrice: val })
                      : setNewItem({ ...newItem, unitPrice: val });
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Supplier</Label>
              <Input
                value={selectedItem?.supplier || newItem.supplier || ""}
                onChange={(e) =>
                  selectedItem
                    ? setSelectedItem({
                        ...selectedItem,
                        supplier: e.target.value,
                      })
                    : setNewItem({ ...newItem, supplier: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: PRIMARY_COLOR }}
              onClick={() => {
                if (selectedItem) {
                  setInventory(
                    inventory.map((item) =>
                      item.id === selectedItem.id ? selectedItem : item,
                    ),
                  );
                  setSelectedItem(null);
                  alert("Product updated successfully!");
                } else {
                  saveNewItem();
                }
              }}
            >
              {selectedItem ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
