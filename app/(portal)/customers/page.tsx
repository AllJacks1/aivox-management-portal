"use client";

import { useState } from "react";
import { Search, Plus, Phone, Mail, Calendar, User, Award } from "lucide-react";
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

const PRIMARY_COLOR = "#20B757";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  visits: number;
  loyaltyTier: "Regular" | "Silver" | "Gold" | "VIP";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-1001",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "+63 917 555 0123",
      lastVisit: "Today",
      totalSpent: 2840,
      visits: 12,
      loyaltyTier: "Gold",
    },
    {
      id: "CUST-1002",
      name: "John Dela Cruz",
      email: "john.dc@email.com",
      phone: "+63 918 222 0456",
      lastVisit: "Yesterday",
      totalSpent: 1250,
      visits: 8,
      loyaltyTier: "Silver",
    },
    {
      id: "CUST-1003",
      name: "Anna Reyes",
      email: undefined,
      phone: "+63 915 777 8910",
      lastVisit: "June 20",
      totalSpent: 875,
      visits: 5,
      loyaltyTier: "Regular",
    },
    {
      id: "CUST-1004",
      name: "Robert Lim",
      email: "robert.lim@email.com",
      phone: "+63 922 333 4455",
      lastVisit: "June 18",
      totalSpent: 4520,
      visits: 18,
      loyaltyTier: "VIP",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      VIP: "bg-purple-100 text-purple-700",
      Gold: "bg-amber-100 text-amber-700",
      Silver: "bg-zinc-100 text-zinc-700",
      Regular: "bg-emerald-100 text-emerald-700",
    };
    return (
      <Badge className={colors[tier] || "bg-zinc-100 text-zinc-700"}>
        {tier}
      </Badge>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Customers
            </h1>
            <p className="text-zinc-600 mt-1">
              Manage your customer relationships and loyalty
            </p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Plus className="mr-2" size={20} />
            Add New Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Customers", value: customers.length },
            {
              label: "Active This Month",
              value: customers.filter((c) => c.visits > 2).length,
            },
            {
              label: "VIP & Gold",
              value: customers.filter((c) =>
                ["VIP", "Gold"].includes(c.loyaltyTier),
              ).length,
            },
            { label: "Avg. Spend", value: "₱2,871" },
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
                  placeholder="Search customers by name, phone, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Export List</Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Loyalty Tier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-zinc-50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-zinc-500 font-mono">
                        {customer.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={14} /> {customer.phone}
                          </span>
                        )}
                        {customer.email && (
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Mail size={14} /> {customer.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      {customer.visits}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₱{customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>{getTierBadge(customer.loyaltyTier)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Customer Detail Modal */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <User size={32} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-zinc-500 font-mono">
                    {selectedCustomer.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-zinc-500">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Email</p>
                  <p className="font-medium">{selectedCustomer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Loyalty Tier</p>
                  {getTierBadge(selectedCustomer.loyaltyTier)}
                </div>
                <div>
                  <p className="text-zinc-500">Total Visits</p>
                  <p className="font-medium">{selectedCustomer.visits}</p>
                </div>
              </div>

              <div>
                <p className="text-zinc-500 mb-1">Lifetime Value</p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  ₱{selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline">Edit Profile</Button>
                <Button style={{ backgroundColor: PRIMARY_COLOR }}>
                  New Transaction
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Customer Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Enter customer name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+63 9XX XXX XXXX" />
              </div>
              <div>
                <Label>Email (Optional)</Label>
                <Input type="email" placeholder="customer@email.com" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: PRIMARY_COLOR }}
              onClick={() => {
                alert("Customer added successfully!");
                setIsAddOpen(false);
              }}
            >
              Save Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
