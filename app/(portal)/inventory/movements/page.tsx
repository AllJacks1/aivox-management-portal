"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  Edit,
  Calendar,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRIMARY_COLOR = "#20B757";

interface StockMovement {
  id: string;
  date: string;
  product: string;
  sku: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "RETURN";
  quantity: number;
  reference: string;
  user: string;
  notes?: string;
  balanceAfter: number;
}

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([
    {
      id: "MOV-20260622-001",
      date: "June 22, 2026 • 15:45",
      product: "Coca-Cola 1.5L",
      sku: "CKE150",
      type: "OUT",
      quantity: 12,
      reference: "TX-20250622-4782",
      user: "Alex Rivera",
      notes: "Sold via POS",
      balanceAfter: 8,
    },
    {
      id: "MOV-20260622-002",
      date: "June 22, 2026 • 14:20",
      product: "Potato Chips Classic",
      sku: "CHP001",
      type: "IN",
      quantity: 50,
      reference: "PO-20260620-045",
      user: "Sarah Lim",
      notes: "Restock from supplier",
      balanceAfter: 42,
    },
    {
      id: "MOV-20260622-003",
      date: "June 22, 2026 • 11:10",
      product: "White Bread Loaf",
      sku: "BRD001",
      type: "OUT",
      quantity: 8,
      reference: "TX-20250622-4779",
      user: "Alex Rivera",
      notes: "",
      balanceAfter: 15,
    },
    {
      id: "MOV-20260621-089",
      date: "June 21, 2026 • 17:30",
      product: "Eggs Tray (30pcs)",
      sku: "EGG030",
      type: "ADJUSTMENT",
      quantity: -3,
      reference: "ADJ-20260621",
      user: "Robert Lim",
      notes: "Damaged items",
      balanceAfter: 12,
    },
    {
      id: "MOV-20260621-088",
      date: "June 21, 2026 • 09:15",
      product: "Mineral Water 1L",
      sku: "WTR001",
      type: "RETURN",
      quantity: 5,
      reference: "TX-20250621-3921",
      user: "Alex Rivera",
      notes: "Customer return",
      balanceAfter: 68,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedMovement, setSelectedMovement] =
    useState<StockMovement | null>(null);

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "All" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string, quantity: number) => {
    if (type === "IN" || (type === "RETURN" && quantity > 0)) {
      return <Badge className="bg-emerald-100 text-emerald-700">+ IN</Badge>;
    }
    if (type === "OUT") {
      return <Badge className="bg-red-100 text-red-700">- OUT</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-700">ADJUSTMENT</Badge>;
  };

  const totalIn = movements
    .filter((m) => m.type === "IN" || m.type === "RETURN")
    .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Stock Movements
            </h1>
            <p className="text-zinc-600 mt-1">
              Track all inventory inflows, outflows, and adjustments
            </p>
          </div>
          <Button style={{ backgroundColor: PRIMARY_COLOR }} className="gap-2">
            <Download size={18} />
            Export Movements
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Movements", value: movements.length },
            { label: "Stock In", value: `+${totalIn}`, color: "emerald" },
            { label: "Stock Out", value: `-${totalOut}`, color: "red" },
            {
              label: "Net Change",
              value: totalIn - totalOut,
              color: totalIn - totalOut >= 0 ? "emerald" : "red",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="text-sm text-zinc-600">{stat.label}</p>
                <p
                  className={`text-4xl font-bold mt-2 ${stat.color === "red" ? "text-red-600" : stat.color === "emerald" ? "text-emerald-600" : "text-zinc-900"}`}
                >
                  {stat.value}
                </p>
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
                  placeholder="Search product, SKU, or reference..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Movement Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Movements</SelectItem>
                  <SelectItem value="IN">Stock In</SelectItem>
                  <SelectItem value="OUT">Stock Out</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="RETURN">Return</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Calendar size={18} />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Recent Stock Movements ({filteredMovements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow
                    key={movement.id}
                    className="hover:bg-zinc-50 cursor-pointer"
                    onClick={() => setSelectedMovement(movement)}
                  >
                    <TableCell className="text-sm">{movement.date}</TableCell>
                    <TableCell className="font-medium">
                      {movement.product}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {movement.sku}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(movement.type, movement.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {movement.type === "IN" || movement.type === "RETURN"
                        ? "+"
                        : ""}
                      {movement.quantity}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-zinc-600">
                      {movement.reference}
                    </TableCell>
                    <TableCell>{movement.user}</TableCell>
                    <TableCell className="font-medium">
                      {movement.balanceAfter}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Movement Detail Modal */}
      <Dialog
        open={!!selectedMovement}
        onOpenChange={() => setSelectedMovement(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Stock Movement Details</DialogTitle>
          </DialogHeader>

          {selectedMovement && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold">
                    {selectedMovement.id}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {selectedMovement.date}
                  </p>
                </div>
                {getTypeBadge(selectedMovement.type, selectedMovement.quantity)}
              </div>

              <div className="bg-zinc-100 rounded-2xl p-6">
                <p className="text-sm text-zinc-500 mb-1">Product</p>
                <p className="text-xl font-semibold">
                  {selectedMovement.product}
                </p>
                <p className="text-sm text-zinc-500 font-mono">
                  {selectedMovement.sku}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-zinc-500">Movement Type</p>
                  <p className="font-medium capitalize">
                    {selectedMovement.type.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Quantity</p>
                  <p className="font-semibold text-lg">
                    {selectedMovement.type === "IN" ||
                    selectedMovement.type === "RETURN"
                      ? "+"
                      : ""}
                    {selectedMovement.quantity} units
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Reference</p>
                  <p className="font-mono">{selectedMovement.reference}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Processed By</p>
                  <p className="font-medium">{selectedMovement.user}</p>
                </div>
              </div>

              {selectedMovement.notes && (
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Notes</p>
                  <p className="bg-zinc-50 p-4 rounded-xl border">
                    {selectedMovement.notes}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-zinc-500">
                  Stock Balance After Movement
                </p>
                <p className="text-4xl font-bold text-zinc-900 mt-1">
                  {selectedMovement.balanceAfter} units
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
