// ============================================================
// Purchase Orders Management Page
// Next.js App Router | TypeScript | Tailwind | shadcn/ui
// ============================================================

// --- Types & Interfaces ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  costPrice: number;
  unit: string;
  stock: number;
}

export interface POItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string;
  unit: string;
  costPrice: number;
  quantityOrdered: number;
  quantityReceived: number;
  subtotal: number;
}

export type POStatus =
  | "Draft"
  | "Ordered"
  | "Partially Delivered"
  | "Completed"
  | "Cancelled";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierId: string;
  orderDate: string;
  expectedDelivery: string;
  notes: string;
  createdBy: string;
  lastUpdated: string;
  items: POItem[];
  totalAmount: number;
  totalItems: number;
  tax: number;
  deliveryCost: number;
  balanceDue: number;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  status: POStatus;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
}

// --- Mock Data ---
export const mockSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "Manila Wholesale Trading",
    contact: "0917-123-4567",
    email: "orders@mwt.ph",
  },
  {
    id: "s2",
    name: "Cebu Fresh Produce Co.",
    contact: "0922-987-6543",
    email: "sales@cebufresh.ph",
  },
  {
    id: "s3",
    name: "Davao Hardware Supply",
    contact: "0933-555-1212",
    email: "procure@dhs.ph",
  },
  {
    id: "s4",
    name: "Laguna Electronics Hub",
    contact: "0918-444-3333",
    email: "b2b@lagunaehub.ph",
  },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Jasmine Rice 25kg",
    sku: "RICE-25KG",
    barcode: "4800123456789",
    costPrice: 850,
    unit: "sack",
    stock: 12,
  },
  {
    id: "p2",
    name: "Canned Sardines in Tomato 155g",
    sku: "SAR-155G",
    barcode: "4800123456790",
    costPrice: 18.5,
    unit: "can",
    stock: 200,
  },
  {
    id: "p3",
    name: "Refined Sugar 1kg",
    sku: "SUG-1KG",
    barcode: "4800123456791",
    costPrice: 65,
    unit: "pack",
    stock: 45,
  },
  {
    id: "p4",
    name: "Cooking Oil 1L",
    sku: "OIL-1L",
    barcode: "4800123456792",
    costPrice: 78,
    unit: "bottle",
    stock: 8,
  },
  {
    id: "p5",
    name: "All-Purpose Flour 1kg",
    sku: "FLR-1KG",
    barcode: "4800123456793",
    costPrice: 55,
    unit: "pack",
    stock: 30,
  },
  {
    id: "p6",
    name: "Instant Noodles Chicken 70g",
    sku: "NOOD-70G",
    barcode: "4800123456794",
    costPrice: 12,
    unit: "pack",
    stock: 500,
  },
  {
    id: "p7",
    name: "Condensed Milk 300ml",
    sku: "MILK-300ML",
    barcode: "4800123456795",
    costPrice: 42,
    unit: "can",
    stock: 60,
  },
  {
    id: "p8",
    name: "Soy Sauce 1L",
    sku: "SOY-1L",
    barcode: "4800123456796",
    costPrice: 35,
    unit: "bottle",
    stock: 25,
  },
  {
    id: "p9",
    name: "Detergent Powder 1kg",
    sku: "DET-1KG",
    barcode: "4800123456797",
    costPrice: 95,
    unit: "pack",
    stock: 15,
  },
  {
    id: "p10",
    name: "Toilet Paper 4 Rolls",
    sku: "TP-4RL",
    barcode: "4800123456798",
    costPrice: 58,
    unit: "pack",
    stock: 40,
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po1",
    poNumber: "PO-2024-001",
    supplier: "Manila Wholesale Trading",
    supplierId: "s1",
    orderDate: "2024-05-15",
    expectedDelivery: "2024-05-20",
    notes: "Urgent restock for weekend sale",
    createdBy: "Juan Dela Cruz",
    lastUpdated: "2024-05-15T09:30:00Z",
    items: [
      {
        id: "i1",
        productId: "p1",
        name: "Premium Jasmine Rice 25kg",
        sku: "RICE-25KG",
        barcode: "4800123456789",
        unit: "sack",
        costPrice: 850,
        quantityOrdered: 20,
        quantityReceived: 0,
        subtotal: 17000,
      },
      {
        id: "i2",
        productId: "p3",
        name: "Refined Sugar 1kg",
        sku: "SUG-1KG",
        barcode: "4800123456791",
        unit: "pack",
        costPrice: 65,
        quantityOrdered: 50,
        quantityReceived: 0,
        subtotal: 3250,
      },
    ],
    totalAmount: 20250,
    totalItems: 70,
    tax: 0,
    deliveryCost: 500,
    balanceDue: 20750,
    paymentStatus: "Unpaid",
    status: "Ordered",
  },
  {
    id: "po2",
    poNumber: "PO-2024-002",
    supplier: "Cebu Fresh Produce Co.",
    supplierId: "s2",
    orderDate: "2024-05-10",
    expectedDelivery: "2024-05-14",
    notes: "Regular monthly order",
    createdBy: "Maria Santos",
    lastUpdated: "2024-05-12T14:20:00Z",
    items: [
      {
        id: "i3",
        productId: "p2",
        name: "Canned Sardines in Tomato 155g",
        sku: "SAR-155G",
        barcode: "4800123456790",
        unit: "can",
        costPrice: 18.5,
        quantityOrdered: 100,
        quantityReceived: 60,
        subtotal: 1850,
      },
      {
        id: "i4",
        productId: "p6",
        name: "Instant Noodles Chicken 70g",
        sku: "NOOD-70G",
        barcode: "4800123456794",
        unit: "pack",
        costPrice: 12,
        quantityOrdered: 200,
        quantityReceived: 200,
        subtotal: 2400,
      },
    ],
    totalAmount: 4250,
    totalItems: 300,
    tax: 0,
    deliveryCost: 0,
    balanceDue: 4250,
    paymentStatus: "Partial",
    status: "Partially Delivered",
  },
  {
    id: "po3",
    poNumber: "PO-2024-003",
    supplier: "Davao Hardware Supply",
    supplierId: "s3",
    orderDate: "2024-05-01",
    expectedDelivery: "2024-05-05",
    notes: "",
    createdBy: "Juan Dela Cruz",
    lastUpdated: "2024-05-06T10:00:00Z",
    items: [
      {
        id: "i5",
        productId: "p9",
        name: "Detergent Powder 1kg",
        sku: "DET-1KG",
        barcode: "4800123456797",
        unit: "pack",
        costPrice: 95,
        quantityOrdered: 30,
        quantityReceived: 30,
        subtotal: 2850,
      },
    ],
    totalAmount: 2850,
    totalItems: 30,
    tax: 0,
    deliveryCost: 0,
    balanceDue: 0,
    paymentStatus: "Paid",
    status: "Completed",
  },
  {
    id: "po4",
    poNumber: "PO-2024-004",
    supplier: "Laguna Electronics Hub",
    supplierId: "s4",
    orderDate: "2024-05-18",
    expectedDelivery: "2024-05-25",
    notes: "Draft - awaiting manager approval",
    createdBy: "Maria Santos",
    lastUpdated: "2024-05-18T08:15:00Z",
    items: [
      {
        id: "i6",
        productId: "p4",
        name: "Cooking Oil 1L",
        sku: "OIL-1L",
        barcode: "4800123456792",
        unit: "bottle",
        costPrice: 78,
        quantityOrdered: 50,
        quantityReceived: 0,
        subtotal: 3900,
      },
    ],
    totalAmount: 3900,
    totalItems: 50,
    tax: 0,
    deliveryCost: 0,
    balanceDue: 3900,
    paymentStatus: "Unpaid",
    status: "Draft",
  },
  {
    id: "po5",
    poNumber: "PO-2024-005",
    supplier: "Manila Wholesale Trading",
    supplierId: "s1",
    orderDate: "2024-04-20",
    expectedDelivery: "2024-04-25",
    notes: "Cancelled due to supplier stock issue",
    createdBy: "Juan Dela Cruz",
    lastUpdated: "2024-04-22T11:00:00Z",
    items: [
      {
        id: "i7",
        productId: "p5",
        name: "All-Purpose Flour 1kg",
        sku: "FLR-1KG",
        barcode: "4800123456793",
        unit: "pack",
        costPrice: 55,
        quantityOrdered: 40,
        quantityReceived: 0,
        subtotal: 2200,
      },
    ],
    totalAmount: 2200,
    totalItems: 40,
    tax: 0,
    deliveryCost: 0,
    balanceDue: 0,
    paymentStatus: "Unpaid",
    status: "Cancelled",
  },
];

// --- Utility Functions ---
export const formatPHP = (amount: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    amount,
  );

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDateTime = (isoStr: string) =>
  new Date(isoStr).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getStatusColor = (status: POStatus) => {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Ordered":
      return "bg-[#2A3A9D]/10 text-[#2A3A9D] border-[#2A3A9D]/20";
    case "Partially Delivered":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-[#CE2A28]/10 text-[#CE2A28] border-[#CE2A28]/20";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const getPaymentStatusColor = (
  status: PurchaseOrder["paymentStatus"],
) => {
  switch (status) {
    case "Paid":
      return "text-emerald-600";
    case "Partial":
      return "text-amber-600";
    case "Unpaid":
      return "text-[#CE2A28]";
  }
};

export const generatePONumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(100 + Math.random() * 900);
  return `PO-${year}-${random.toString().padStart(3, "0")}`;
};
