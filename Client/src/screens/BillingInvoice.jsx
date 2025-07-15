import React, { useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  CreditCard,
  Download,
  Printer,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Receipt,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Hash,
  Percent,
  Calculator,
  Save,
  Send,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Users,
  Utensils,
  ShoppingCart,
  X,
  Menu,
} from 'lucide-react';
import Sidebar from '../screens/Sidebar'; // Adjust path if needed, e.g., '../components/Sidebar'

const BillingInvoice = () => {
  const [activeView, setActiveView] = useState('invoices'); // invoices, create, view, payments
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    tableNumber: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    paymentMethod: 'cash',
    notes: '',
  });

  const invoices = [
    {
      id: 'INV-2025-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+1-555-0123',
      tableNumber: 'T-12',
      date: '2025-07-13',
      time: '19:30',
      items: [
        { name: 'Grilled Salmon', quantity: 2, price: 28.50, total: 57.00 },
        { name: 'Caesar Salad', quantity: 2, price: 12.00, total: 24.00 },
        { name: 'Wine - Chardonnay', quantity: 1, price: 35.00, total: 35.00 },
      ],
      subtotal: 116.00,
      tax: 11.60,
      discount: 5.80,
      total: 121.80,
      status: 'paid',
      paymentMethod: 'credit_card',
      notes: 'Customer requested extra sauce',
    },
    {
      id: 'INV-2025-002',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      customerPhone: '+1-555-0456',
      tableNumber: 'T-8',
      date: '2025-07-13',
      time: '20:00',
      items: [
        { name: 'Ribeye Steak', quantity: 1, price: 45.00, total: 45.00 },
        { name: 'Mashed Potatoes', quantity: 1, price: 8.00, total: 8.00 },
        { name: 'Beer - IPA', quantity: 2, price: 6.50, total: 13.00 },
      ],
      subtotal: 66.00,
      tax: 6.60,
      discount: 0,
      total: 72.60,
      status: 'pending',
      paymentMethod: 'cash',
      notes: 'Medium rare steak',
    },
    {
      id: 'INV-2025-003',
      customerName: 'Emma Rodriguez',
      customerEmail: 'emma.rodriguez@email.com',
      customerPhone: '+1-555-0789',
      tableNumber: 'T-15',
      date: '2025-07-13',
      time: '18:45',
      items: [
        { name: 'Pasta Carbonara', quantity: 3, price: 22.00, total: 66.00 },
        { name: 'Garlic Bread', quantity: 2, price: 6.50, total: 13.00 },
        { name: 'Soft Drinks', quantity: 3, price: 3.50, total: 10.50 },
      ],
      subtotal: 89.50,
      tax: 8.95,
      discount: 8.95,
      total: 89.50,
      status: 'overdue',
      paymentMethod: 'credit_card',
      notes: 'Birthday celebration - 10% discount applied',
    },
  ];

  const menuItems = [
    { id: 1, name: 'Grilled Salmon', price: 28.50, category: 'Main Course' },
    { id: 2, name: 'Ribeye Steak', price: 45.00, category: 'Main Course' },
    { id: 3, name: 'Pasta Carbonara', price: 22.00, category: 'Main Course' },
    { id: 4, name: 'Caesar Salad', price: 12.00, category: 'Appetizer' },
    { id: 5, name: 'Garlic Bread', price: 6.50, category: 'Appetizer' },
    { id: 6, name: 'Mashed Potatoes', price: 8.00, category: 'Side' },
    { id: 7, name: 'Wine - Chardonnay', price: 35.00, category: 'Beverage' },
    { id: 8, name: 'Beer - IPA', price: 6.50, category: 'Beverage' },
    { id: 9, name: 'Soft Drinks', price: 3.50, category: 'Beverage' },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    },
    {
      title: 'Invoices Today',
      value: '28',
      change: '+5',
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Pending Payments',
      value: '$1,240',
      change: '3 invoices',
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    },
    {
      title: 'Avg Order Value',
      value: '$34.60',
      change: '+5.8%',
      icon: Calculator,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const addItemToInvoice = (item) => {
    const existingItem = newInvoice.items.find((i) => i.name === item.name);
    if (existingItem) {
      const updatedItems = newInvoice.items.map((i) =>
        i.name === item.name ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i
      );
      setNewInvoice((prev) => ({ ...prev, items: updatedItems }));
    } else {
      setNewInvoice((prev) => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1, total: item.price }],
      }));
    }
  };

  const removeItemFromInvoice = (itemName) => {
    setNewInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.name !== itemName),
    }));
  };

  const updateItemQuantity = (itemName, quantity) => {
    if (quantity <= 0) {
      removeItemFromInvoice(itemName);
      return;
    }

    const updatedItems = newInvoice.items.map((item) =>
      item.name === itemName ? { ...item, quantity: quantity, total: quantity * item.price } : item
    );
    setNewInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  const calculateTotals = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.10; // 10% tax
    const discount = newInvoice.discount || 0;
    const total = subtotal + tax - discount;

    setNewInvoice((prev) => ({
      ...prev,
      subtotal: subtotal,
      tax: tax,
      total: total,
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [newInvoice.items, newInvoice.discount]);

  const handleCreateInvoice = () => {
    console.log('Creating invoice:', newInvoice);
    alert('Invoice created successfully!');
    setActiveView('invoices');
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      tableNumber: '',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      paymentMethod: 'cash',
      notes: '',
    });
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting invoice:', invoiceToDelete.id);
    alert('Invoice deleted successfully!');
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  // Invoice List View
  const InvoiceListView = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => setActiveView('create')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Invoice ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Table</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{invoice.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{invoice.tableNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-900">{invoice.date}</p>
                      <p className="text-sm text-gray-500">{invoice.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">${invoice.total.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="capitalize">{invoice.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setActiveView('view');
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => console.log('Print invoice:', invoice.id)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        title="Delete Invoice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Create Invoice View
  const CreateInvoiceView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('invoices')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateInvoice}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save & Send</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={newInvoice.customerName}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newInvoice.customerEmail}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={newInvoice.customerPhone}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
              <input
                type="text"
                value={newInvoice.tableNumber}
                onChange={(e) => setNewInvoice((prev) => ({ ...prev, tableNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter table number"
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Menu Items</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addItemToInvoice(item)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Items */}
      {newInvoice.items.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Items</h3>
          <div className="space-y-3">
            {newInvoice.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="font-medium text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-medium text-gray-900 min-w-[4rem] text-right">${item.total.toFixed(2)}</span>
                  <button
                    onClick={() => removeItemFromInvoice(item.name)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Totals */}
          <div className="border-t border-gray-200 mt-6 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">${newInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-medium text-gray-900">${newInvoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={newInvoice.discount}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3">
              <span>Total:</span>
              <span>${newInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-gray-200 mt-6 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={newInvoice.paymentMethod}
              onChange={(e) => setNewInvoice((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="digital_wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Notes */}
          <div className="border-t border-gray-200 mt-6 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={newInvoice.notes}
              onChange={(e) => setNewInvoice((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any special notes or instructions..."
            />
          </div>
        </div>
      )}
    </div>
  );

  // View Invoice Details
  const ViewInvoiceDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('invoices')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Send className="h-4 w-4" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {selectedInvoice && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Invoice Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-1">Bella Vista Restaurant & Bar</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{selectedInvoice.id}</p>
                <div className="flex items-center justify-end mt-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      selectedInvoice.status
                    )}`}
                  >
                    {getStatusIcon(selectedInvoice.status)}
                    <span className="capitalize">{selectedInvoice.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{selectedInvoice.customerName}</p>
                <p className="text-gray-600">{selectedInvoice.customerEmail}</p>
                <p className="text-gray-600">{selectedInvoice.customerPhone}</p>
                <p className="text-gray-600">Table: {selectedInvoice.tableNumber}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-gray-900">{selectedInvoice.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900 capitalize">{selectedInvoice.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Unit Price</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium text-gray-900">${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-${selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-3">
                  <span>Total:</span>
                  <span>${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {selectedInvoice.notes && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-600">{selectedInvoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8 text-center text-gray-500 text-sm">
            <p>Thank you for dining with us!</p>
            <p>Bella Vista Restaurant & Bar | Downtown District | Phone: (555) 123-4567</p>
          </div>
        </div>
      )}
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Invoice</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete invoice {invoiceToDelete?.id}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const mainMargin = sidebarMinimized ? 'lg:ml-16' : 'lg:ml-64';

  console.log('BillingInvoice rendering');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
      />
      <div className={`${mainMargin} transition-all duration-300 min-h-screen bg-gray-50 p-6`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => {
                console.log('Opening sidebar');
                setSidebarOpen(true);
              }}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing & Invoice Management</h1>
              <p className="text-gray-600">Manage invoices, payments, and billing processes</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveView('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Invoices
              </button>
              <button
                onClick={() => setActiveView('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Invoice
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'invoices' && <InvoiceListView />}
        {activeView === 'create' && <CreateInvoiceView />}
        {activeView === 'view' && <ViewInvoiceDetails />}

        {/* Delete Modal */}
        {showDeleteModal && <DeleteModal />}

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => {
              console.log('Closing sidebar');
              setSidebarOpen(false);
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default BillingInvoice;