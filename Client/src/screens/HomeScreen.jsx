import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Settings,
  MapPin,
  Clock,
  Star,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  ChefHat,
  UserPlus,
  ShoppingCart,
  Monitor,
  Menu,
} from 'lucide-react';
import Sidebar from '../screens/Sidebar'; // Adjust the path based on your file structure

const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('Today');
  const [notifications, setNotifications] = useState(8);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  console.log('HomeScreen rendering');

  const stats = [
    {
      title: 'Total Tables',
      value: '45',
      change: '+3 new',
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Occupancy Rate',
      value: '78.3%',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    },
    {
      title: 'Revenue Today',
      value: '$8,450',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      title: 'Avg. Order Value',
      value: '$34.60',
      change: '+5.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    },
  ];

  const recentReservations = [
    {
      id: 'RSV001',
      guest: 'Sarah Johnson',
      table: 'T-12',
      time: '7:30 PM',
      date: '2025-07-12',
      party: 4,
      status: 'confirmed',
      phone: '+1-555-0123',
    },
    {
      id: 'RSV002',
      guest: 'Michael Chen',
      table: 'T-8',
      time: '8:00 PM',
      date: '2025-07-12',
      party: 2,
      status: 'seated',
      phone: '+1-555-0456',
    },
    {
      id: 'RSV003',
      guest: 'Emma Rodriguez',
      table: 'T-15',
      time: '6:45 PM',
      date: '2025-07-12',
      party: 6,
      status: 'pending',
      phone: '+1-555-0789',
    },
    {
      id: 'RSV004',
      guest: 'David Wilson',
      table: 'T-20',
      time: '9:00 PM',
      date: '2025-07-12',
      party: 3,
      status: 'confirmed',
      phone: '+1-555-0321',
    },
  ];

  const tableStatus = [
    { status: 'Available', count: 18, color: 'bg-emerald-500' },
    { status: 'Occupied', count: 22, color: 'bg-blue-500' },
    { status: 'Reserved', count: 8, color: 'bg-purple-500' },
    { status: 'Cleaning', count: 3, color: 'bg-orange-500' },
    { status: 'Maintenance', count: 2, color: 'bg-red-500' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'seated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mainMargin = sidebarMinimized ? 'lg:ml-16' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
      />
      <div className={`${mainMargin} transition-all duration-300 min-h-screen bg-gray-50`}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    console.log('Opening sidebar');
                    setSidebarOpen(true);
                  }}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu size={24} />
                </button>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Bella Vista Restaurant & Bar</h1>
                  <p className="text-gray-600">Restaurant Management System</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search reservations, tables, menu..."
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gray-900">Alex Chef</p>
                      <p className="text-xs text-gray-600">Restaurant Manager</p>
                    </div>
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">AC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="px-6 py-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
                  <p className="text-blue-100 mb-4">Here's what's happening at your restaurant today</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{currentTime.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Downtown District</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>45 Tables Active</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-3xl font-bold">45</p>
                    <p className="text-blue-100">Total Tables</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">78%</p>
                    <p className="text-blue-100">Occupancy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
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
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Table Status</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Floor Plan
                </button>
              </div>
              <div className="space-y-4">
                {tableStatus.map((table, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${table.color}`}></div>
                      <span className="text-sm font-medium text-gray-900">{table.status}</span>
                    </div>
                    <span className="text-sm text-gray-600">{table.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Tables</span>
                  <span className="font-semibold text-gray-900">45</span>
                </div>
              </div>
            </div>
            {/* Recent Reservations */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Today's Reservations</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Guest</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Table</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Party</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((reservation) => (
                      <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {reservation.guest.split(' ').map((n) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{reservation.guest}</p>
                              <p className="text-xs text-gray-600">{reservation.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{reservation.table}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{reservation.time}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{reservation.party}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              reservation.status
                            )}`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{reservation.phone}</span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Quick Actions & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                  <UserPlus className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-900">Walk-in Guest</p>
                </button>
                <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group">
                  <Calendar className="h-8 w-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-900">New Reservation</p>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                  <ShoppingCart
                    className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform"
                  />
                  <p className="text-sm font-medium text-gray-900">Take Order</p>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
                  <Monitor className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-900">Kitchen Display</p>
                </button>
              </div>
            </div>
            {/* Recent Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Mark all read
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">New reservation confirmed</p>
                    <p className="text-xs text-gray-600">Sarah Johnson - Table 12, 7:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                    <p className="text-xs text-gray-600">Salmon portions running low</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <Star className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">New 5-star review</p>
                    <p className="text-xs text-gray-600">Emma Rodriguez praised the service</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order ready</p>
                    <p className="text-xs text-gray-600">Table 8 - Order #245 ready to serve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default HomeScreen;