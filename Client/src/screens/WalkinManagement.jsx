import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Timer,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Utensils,
  Star,
  MessageSquare,
  Bell,
  RefreshCw,
  User,
  Calendar,
  Hash,
  Eye,
  ChefHat,
  Table,
  X,
  Menu,
} from 'lucide-react';
import Sidebar from '../screens/Sidebar'; // Adjust path if needed, e.g., '../components/Sidebar'

const WalkinManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [walkinQueue, setWalkinQueue] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newGuest, setNewGuest] = useState({
    guestName: '',
    partySize: 1,
    phone: '',
    email: '',
    specialRequests: '',
    preferredSeating: 'any',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch data from backend
  const fetchData = async (clearMessages = false, showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const params = { status: filterStatus, search: searchTerm };

      const [walkinsRes, tablesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/walkins', { params }),
        axios.get('http://localhost:8000/api/walkins/available-tables'),
      ]);

      console.log('Walk-ins:', walkinsRes.data);
      console.log('Available Tables:', tablesRes.data);

      setWalkinQueue(walkinsRes.data);
      setAvailableTables(tablesRes.data);
      
      // Only clear messages if explicitly requested (like initial load)
      if (clearMessages) {
        setError(null);
        setSuccessMessage(null);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Only set error if there isn't already a success message showing
      if (!successMessage) {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData(true); // Clear messages on initial load and filter changes
  }, [filterStatus, searchTerm]);

  const getWaitTime = (arrivalTime) => {
    const now = new Date();
    const arrivalDate = new Date(arrivalTime);
    const diffMs = now - arrivalDate;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'called':
        return 'bg-blue-100 text-blue-800';
      case 'seated':
        return 'bg-green-100 text-green-800';
      case 'left':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addWalkinGuest = async () => {
    try {
      setError(null); // Clear any previous errors
      setSuccessMessage(null); // Clear any previous success messages
      
      const response = await axios.post('http://localhost:8000/api/walkins', {
        guestName: newGuest.guestName,
        phone: newGuest.phone,
        email: newGuest.email,
        partySize: newGuest.partySize,
        specialRequests: newGuest.specialRequests,
        preferredSeating: newGuest.preferredSeating,
      });

      console.log('Walk-in guest added successfully:', response.data);
      
      // Reset form and close modal first
      setNewGuest({
        guestName: '',
        partySize: 1,
        phone: '',
        email: '',
        specialRequests: '',
        preferredSeating: 'any',
      });
      setShowAddModal(false);
      
      // Show success message
      setSuccessMessage(`${response.data.guestName} has been added to the queue successfully!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      // Then refresh data (don't clear success message and don't show loading)
      await fetchData(false, false);
      
    } catch (error) {
      console.error('Error adding walk-in guest:', error);
      
      // Check if the error is from the API call or from fetchData
      if (error.response) {
        // API error
        const errorMessage = error.response.data?.error || 'Failed to add walk-in guest. Please try again.';
        setError(errorMessage);
      } else if (error.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error (possibly from fetchData)
        setError('An unexpected error occurred. The guest may have been added - please refresh the page.');
      }
    }
  };

  const updateGuestStatus = async (guestId, newStatus) => {
    try {
      console.log('Updating guest status:', { guestId, newStatus });
      setError(null);
      
      const response = await axios.put(`http://localhost:8000/api/walkins/${guestId}/status`, { 
        status: newStatus 
      });
      
      console.log('Status update response:', response.data);
      
      setWalkinQueue(walkinQueue.map((guest) =>
        guest.id === guestId ? response.data : guest
      ));
      
      setSuccessMessage(`Guest status updated to ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchData(false, false); // Refresh data (don't clear messages, don't show loading)
    } catch (error) {
      console.error('Error updating guest status:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Failed to update guest status. Please try again.';
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const assignTable = async (guestId, tableId) => {
    try {
      console.log('Assigning table:', { guestId, tableId });
      setError(null);
      
      const response = await axios.put(`http://localhost:8000/api/walkins/${guestId}/assign-table`, { 
        tableId 
      });
      
      console.log('Table assignment response:', response.data);
      
      setShowAssignModal(false);
      setSelectedGuest(null);
      
      setSuccessMessage(`Table ${tableId} assigned successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchData(false, false); // Refresh data (don't clear messages, don't show loading)
    } catch (error) {
      console.error('Error assigning table:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Failed to assign table. Please try again.';
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const sendNotification = async (guestId) => {
    try {
      console.log('Sending notification to guest:', guestId);
      setError(null);
      
      const response = await axios.put(`http://localhost:8000/api/walkins/${guestId}/notify`);
      
      console.log('Notification response:', response.data);
      
      setSuccessMessage('Notification sent successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      await fetchData(false, false); // Refresh data (don't clear messages, don't show loading)
    } catch (error) {
      console.error('Error sending notification:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Failed to send notification. Please try again.';
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const removeGuest = async (guestId) => {
    try {
      await axios.delete(`http://localhost:8000/api/walkins/${guestId}`);
      setWalkinQueue(walkinQueue.filter((guest) => guest.id !== guestId));
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error removing guest:', error);
      setError('Failed to remove guest. Please try again.');
    }
  };

  const filteredQueue = walkinQueue.filter((guest) => {
    const matchesSearch =
      guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const queueStats = {
    totalWaiting: walkinQueue.filter((g) => g.status === 'waiting').length,
    totalCalled: walkinQueue.filter((g) => g.status === 'called').length,
    avgWaitTime:
      Math.round(
        walkinQueue.reduce((acc, g) => acc + getWaitTime(g.arrivalTime), 0) /
          (walkinQueue.length || 1)
      ) || 0,
    longestWait: walkinQueue.length > 0 ? Math.max(...walkinQueue.map((g) => getWaitTime(g.arrivalTime))) : 0,
  };

  const mainMargin = sidebarMinimized ? 'lg:ml-16' : 'lg:ml-64';

  console.log('WalkinManagement rendering');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading walk-in management...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
      />
      <div className={`${mainMargin} transition-all duration-300 min-h-screen bg-gray-50`}>
        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Header */}
          <div className="mb-8">
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
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Walk-in Management</h1>
                  <p className="text-gray-600">Manage walk-in guests and queue efficiently</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add Walk-in Guest</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-600 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Currently Waiting</p>
                  <p className="text-3xl font-bold text-gray-900">{queueStats.totalWaiting}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Called/Ready</p>
                  <p className="text-3xl font-bold text-gray-900">{queueStats.totalCalled}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-gray-900">{queueStats.avgWaitTime}m</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                  <Timer className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Longest Wait</p>
                  <p className="text-3xl font-bold text-gray-900">{queueStats.longestWait}m</p>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="waiting">Waiting</option>
                    <option value="called">Called</option>
                    <option value="seated">Seated</option>
                    <option value="left">Left</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  />
                </div>

                <button
                  onClick={() => fetchData()}
                  className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Current Queue</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchData()}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Guest</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Party Size</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Wait Time</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Priority</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Preferences</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueue.map((guest) => (
                      <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {guest.guestName.split(' ').map((n) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{guest.guestName}</p>
                              <p className="text-xs text-gray-600">{guest.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{guest.partySize}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{getWaitTime(guest.arrivalTime)}m</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              guest.status
                            )}`}
                          >
                            {guest.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {guest.priority !== 'normal' && (
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                guest.priority
                              )}`}
                            >
                              {guest.priority}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-xs text-gray-600 max-w-40 truncate">
                            {guest.preferredSeating !== 'any' && `${guest.preferredSeating} seating`}
                            {guest.specialRequests && ` • ${guest.specialRequests}`}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {guest.status === 'waiting' && (
                              <>
                                <button
                                  onClick={() => {
                                    console.log('Calling guest:', guest);
                                    updateGuestStatus(guest.id, 'called');
                                  }}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Call guest"
                                >
                                  <Bell className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Assigning table for guest:', guest);
                                    setSelectedGuest(guest);
                                    setShowAssignModal(true);
                                  }}
                                  className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Assign table"
                                >
                                  <Table className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {guest.status === 'called' && (
                              <button
                                onClick={() => {
                                  console.log('Seating guest:', guest);
                                  setSelectedGuest(guest);
                                  setShowAssignModal(true);
                                }}
                                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Assign table"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                console.log('Sending notification to guest:', guest);
                                sendNotification(guest.id);
                              }}
                              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Send notification"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Removing guest:', guest);
                                removeGuest(guest.id);
                              }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove guest"
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

          {/* Add Guest Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add Walk-in Guest</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                    <input
                      type="text"
                      value={newGuest.guestName}
                      onChange={(e) => setNewGuest({ ...newGuest, guestName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter guest name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newGuest.partySize}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, partySize: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+1-555-0123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="guest@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Seating
                    </label>
                    <select
                      value={newGuest.preferredSeating}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, preferredSeating: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="any">Any Available</option>
                      <option value="booth">Booth</option>
                      <option value="window">Window</option>
                      <option value="private">Private Room</option>
                      <option value="outdoor">Outdoor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      value={newGuest.specialRequests}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, specialRequests: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows="3"
                      placeholder="High chair, allergies, celebrations, etc."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addWalkinGuest}
                    disabled={!newGuest.guestName || !newGuest.phone}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Add to Queue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assign Table Modal */}
          {showAssignModal && selectedGuest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Assign Table</h3>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Guest: <span className="font-medium text-gray-900">{selectedGuest.guestName}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Party Size:{' '}
                    <span className="font-medium text-gray-900">{selectedGuest.partySize}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Preference:{' '}
                    <span className="font-medium text-gray-900">{selectedGuest.preferredSeating}</span>
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableTables
                    .filter((table) => table.capacity >= selectedGuest.partySize)
                    .map((table) => (
                      <button
                        key={table.id}
                        onClick={() => assignTable(selectedGuest.id, table.id)}
                        className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{table.id}</p>
                            <p className="text-sm text-gray-600">
                              {table.section} • {table.type}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600">Seats {table.capacity}</div>
                        </div>
                      </button>
                    ))}
                </div>

                {availableTables.filter((table) => table.capacity >= selectedGuest.partySize).length ===
                  0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No suitable tables available for party of {selectedGuest.partySize}
                  </p>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
};

export default WalkinManagement;