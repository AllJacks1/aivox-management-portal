"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const PRIMARY_COLOR = "#20B757";

interface TrackedTransaction {
  id: string;
  date: string;
  cashier: string;
  customer?: string;
  items: number;
  total: number;
  status:
    | "Draft"
    | "Completed"
    | "Refunded"
    | "Partially Refunded"
    | "Voided"
    | "Cancelled";
  lastUpdated: string;
}

export default function TrackStatusPage() {
  const [transactions, setTransactions] = useState<TrackedTransaction[]>([
    {
      id: "TX-20250622-4782",
      date: "June 22, 2026 • 14:32",
      cashier: "Alex Rivera",
      customer: "Maria Santos",
      items: 4,
      total: 319.2,
      status: "Completed",
      lastUpdated: "Just now",
    },
    {
      id: "TX-20250622-4785",
      date: "June 22, 2026 • 15:10",
      cashier: "Alex Rivera",
      customer: undefined,
      items: 3,
      total: 245.5,
      status: "Draft",
      lastUpdated: "2 minutes ago",
    },
    {
      id: "TX-20250622-4784",
      date: "June 22, 2026 • 14:55",
      cashier: "Sarah Lim",
      customer: "John Dela Cruz",
      items: 5,
      total: 678.0,
      status: "Partially Refunded",
      lastUpdated: "18 minutes ago",
    },
    {
      id: "TX-20250622-4783",
      date: "June 22, 2026 • 14:40",
      cashier: "Alex Rivera",
      customer: undefined,
      items: 2,
      total: 151.2,
      status: "Completed",
      lastUpdated: "45 minutes ago",
    },
    {
      id: "TX-20250622-4780",
      date: "June 22, 2026 • 12:10",
      cashier: "Sarah Lim",
      customer: "Anna Reyes",
      items: 6,
      total: 856.0,
      status: "Voided",
      lastUpdated: "Yesterday",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Completed
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Draft
          </Badge>
        );
      case "Partially Refunded":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Partially Refunded
          </Badge>
        );
      case "Refunded":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Refunded
          </Badge>
        );
      case "Voided":
        return <Badge variant="destructive">Voided</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-emerald-600" size={18} />;
      case "Draft":
        return <Clock className="text-amber-600" size={18} />;
      case "Partially Refunded":
      case "Refunded":
        return <RefreshCw className="text-blue-600" size={18} />;
      case "Voided":
      case "Cancelled":
        return <XCircle className="text-red-600" size={18} />;
      default:
        return <AlertTriangle className="text-zinc-500" size={18} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Track Transaction Status
          </h1>
          <p className="text-zinc-600 mt-1">
            Monitor real-time status of all transactions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Transactions",
              value: transactions.length,
              color: "zinc",
            },
            {
              label: "Draft",
              value: transactions.filter((t) => t.status === "Draft").length,
              color: "amber",
            },
            {
              label: "Completed Today",
              value: transactions.filter((t) => t.status === "Completed")
                .length,
              color: "emerald",
            },
            {
              label: "Needs Attention",
              value: transactions.filter((t) =>
                ["Voided", "Refunded"].includes(t.status),
              ).length,
              color: "red",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="text-sm text-zinc-600">{stat.label}</p>
                <p className="text-4xl font-bold mt-2 text-zinc-900">
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
                  placeholder="Search by Transaction ID, Customer..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Partially Refunded">
                    Partially Refunded
                  </SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                  <SelectItem value="Voided">Voided</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Filter size={18} />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Live Transaction Status ({filteredTransactions.length})
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
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        {getStatusBadge(tx.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">
                      {tx.lastUpdated}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Opening details for ${tx.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
