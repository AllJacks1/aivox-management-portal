"use client";

import { useState } from "react";
import { Search, Filter, Printer, Eye, Download } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const PRIMARY_COLOR = "#20B757";

interface Transaction {
  id: string;
  date: string;
  cashier: string;
  customer?: string;
  items: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: "Completed" | "Refunded" | "Voided";
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TX-20250622-4782",
      date: "June 22, 2026 • 14:32",
      cashier: "Alex Rivera",
      customer: "Maria Santos",
      items: 4,
      subtotal: 285,
      total: 319.2,
      paymentMethod: "Cash + GCash",
      status: "Completed",
    },
    {
      id: "TX-20250622-4781",
      date: "June 22, 2026 • 13:45",
      cashier: "Alex Rivera",
      customer: undefined,
      items: 2,
      subtotal: 135,
      total: 151.2,
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: "TX-20250622-4780",
      date: "June 22, 2026 • 12:10",
      cashier: "Sarah Lim",
      customer: "John Dela Cruz",
      items: 6,
      subtotal: 890,
      total: 856.0,
      paymentMethod: "Card",
      status: "Refunded",
    },
    {
      id: "TX-20250621-3921",
      date: "June 21, 2026 • 17:55",
      cashier: "Alex Rivera",
      customer: undefined,
      items: 3,
      subtotal: 220,
      total: 246.4,
      paymentMethod: "GCash",
      status: "Completed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.customer &&
        tx.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.cashier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Completed")
      return (
        <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
      );
    if (status === "Refunded")
      return <Badge className="bg-amber-100 text-amber-700">Refunded</Badge>;
    return <Badge variant="destructive">Voided</Badge>;
  };

  return (
    <div className="flex h-screen bg-zinc-50 flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Transaction History
              </h1>
              <p className="text-zinc-600 mt-1">
                View, search, and manage all completed sales
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <Download size={18} />
              Export Report
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-3 text-zinc-400"
                    size={20}
                  />
                  <Input
                    placeholder="Search by Transaction ID, Customer, or Cashier..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-52">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                    <SelectItem value="Voided">Voided</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Filter size={18} />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Recent Transactions ({filteredTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-zinc-50">
                      <TableCell className="font-mono font-medium">
                        {tx.id}
                      </TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.cashier}</TableCell>
                      <TableCell>
                        {tx.customer || (
                          <span className="text-zinc-400">Walk-in</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{tx.items}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₱{tx.total.toFixed(2)}
                      </TableCell>
                      <TableCell>{tx.paymentMethod}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedTx(tx)}
                          >
                            <Eye size={18} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-xl font-semibold">
                    {selectedTx.id}
                  </p>
                  <p className="text-sm text-zinc-500">{selectedTx.date}</p>
                </div>
                {getStatusBadge(selectedTx.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Cashier</p>
                  <p className="font-medium">{selectedTx.cashier}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Customer</p>
                  <p className="font-medium">
                    {selectedTx.customer || "Walk-in"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">Payment Method</p>
                  <p className="font-medium">{selectedTx.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Total Items</p>
                  <p className="font-medium">{selectedTx.items}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-3">Order Summary</p>
                <div className="space-y-3">
                  {/* Mock items - In real app these would be part of the transaction object */}
                  <div className="flex justify-between text-sm">
                    <span>2× Coca-Cola 1.5L</span>
                    <span>₱190.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1× Potato Chips</span>
                    <span>₱40.00</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold pt-4 border-t">
                <span>Grand Total</span>
                <span style={{ color: PRIMARY_COLOR }}>
                  ₱{selectedTx.total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" variant="outline">
                  <Printer className="mr-2" /> Reprint Receipt
                </Button>
                {selectedTx.status === "Completed" && (
                  <Button className="flex-1" variant="destructive">
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
