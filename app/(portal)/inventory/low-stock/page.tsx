"use client";

import { useState } from "react";
import {
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
  RefreshCw,
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
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const PRIMARY_COLOR = "#20B757";

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  unit: string;
  lastRestocked: string;
  supplier?: string;
}

export default function LowStockAlertPage() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([
    {
      id: "ITEM-001",
      name: "Coca-Cola 1.5L",
      sku: "CKE150",
      category: "Beverages",
      currentStock: 8,
      reorderPoint: 20,
      unit: "bottles",
      lastRestocked: "June 18",
      supplier: "Coca-Cola PH",
    },
    {
      id: "ITEM-002",
      name: "Potato Chips Classic",
      sku: "CHP001",
      category: "Snacks",
      currentStock: 12,
      reorderPoint: 30,
      unit: "packs",
      lastRestocked: "June 20",
      supplier: "Universal Robina",
    },
    {
      id: "ITEM-003",
      name: "White Bread Loaf",
      sku: "BRD001",
      category: "Bakery",
      currentStock: 5,
      reorderPoint: 15,
      unit: "pieces",
      lastRestocked: "June 19",
      supplier: "Gardenia",
    },
    {
      id: "ITEM-004",
      name: "Mineral Water 1L",
      sku: "WTR001",
      category: "Beverages",
      currentStock: 18,
      reorderPoint: 40,
      unit: "bottles",
      lastRestocked: "June 15",
      supplier: "Nature's Spring",
    },
    {
      id: "ITEM-005",
      name: "Eggs Tray (30pcs)",
      sku: "EGG030",
      category: "Dairy & Eggs",
      currentStock: 3,
      reorderPoint: 10,
      unit: "trays",
      lastRestocked: "June 10",
      supplier: "Local Supplier",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<LowStockItem | null>(null);

  const filteredItems = lowStockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const criticalItems = lowStockItems.filter(
    (item) => item.currentStock <= item.reorderPoint / 2,
  );

  const getStockStatus = (current: number, reorder: number) => {
    const percentage = (current / reorder) * 100;
    if (percentage <= 25)
      return {
        label: "Critical",
        color: "bg-red-100 text-red-700",
        progress: "bg-red-500",
      };
    if (percentage <= 50)
      return {
        label: "Low",
        color: "bg-amber-100 text-amber-700",
        progress: "bg-amber-500",
      };
    return {
      label: "Low",
      color: "bg-orange-100 text-orange-700",
      progress: "bg-orange-500",
    };
  };

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Low Stock Alerts
            </h1>
            <p className="text-zinc-600 mt-1">
              Products that need immediate attention
            </p>
          </div>
          <Button style={{ backgroundColor: PRIMARY_COLOR }} className="gap-2">
            <RefreshCw size={18} />
            Refresh Stock
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Low Stock",
              value: lowStockItems.length,
              icon: <AlertTriangle className="text-amber-600" />,
            },
            {
              label: "Critical Items",
              value: criticalItems.length,
              icon: <AlertTriangle className="text-red-600" />,
            },
            {
              label: "Total Value at Risk",
              value: "₱28,450",
              icon: <Package className="text-zinc-600" />,
            },
            {
              label: "Avg. Stock Level",
              value: "12",
              icon: <TrendingDown className="text-amber-600" />,
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

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-3.5 text-zinc-400"
                  size={20}
                />
                <Input
                  placeholder="Search by product name, SKU, or category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Export Alert List</Button>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Table */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Reorder Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(
                    item.currentStock,
                    item.reorderPoint,
                  );
                  const percentage = Math.round(
                    (item.currentStock / item.reorderPoint) * 100,
                  );

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-zinc-50 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.currentStock}{" "}
                        <span className="text-xs text-zinc-500">
                          /{item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-zinc-600">
                        {item.reorderPoint}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge className={status.color}>{status.label}</Badge>
                          <div className="w-20">
                            <Progress value={percentage} className="h-1.5" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500">
                        {item.lastRestocked}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Reorder request sent for ${item.name}`);
                          }}
                        >
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Details</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                <p className="text-sm text-zinc-500 font-mono">
                  {selectedItem.sku}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-zinc-500 text-sm">Current Stock</p>
                  <p className="text-4xl font-bold mt-1">
                    {selectedItem.currentStock}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm">Reorder Point</p>
                  <p className="text-4xl font-bold mt-1 text-amber-600">
                    {selectedItem.reorderPoint}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">Stock Level</p>
                <Progress
                  value={Math.round(
                    (selectedItem.currentStock / selectedItem.reorderPoint) *
                      100,
                  )}
                  className="h-3"
                />
              </div>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Category</span>
                  <span>{selectedItem.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Unit</span>
                  <span>{selectedItem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Supplier</span>
                  <span>{selectedItem.supplier || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Last Restocked</span>
                  <span>{selectedItem.lastRestocked}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  View Full Inventory
                </Button>
                <Button
                  className="flex-1"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Place Reorder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
