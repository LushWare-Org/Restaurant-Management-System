import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Calendar,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  UserPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  ChefHat,
  Utensils,
  X,
  Save,
  RefreshCw,
  Download,
  Upload,
  Bell,
  Heart,
  Gift,
  CreditCard,
  Coffee,
  Cake,
  Baby,
  Accessibility,
  Volume2,
  VolumeX,
  Menu,
} from 'lucide-react';
import Sidebar from '../screens/Sidebar'; // Adjust path if needed, e.g., '../components/Sidebar'

const TableReservation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('day'); // day, all
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { status: filterStatus, search: searchQuery };
      if (viewType === 'day') {
        params.date = selectedDate.toISOString().split('T')[0];
      }

      const [reservationsRes, tablesRes, timeSlotsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/tablereservationRoutes/reservations', { params }),
        axios.get('http://localhost:8000/api/tablereservationRoutes/tables'),
        axios.get('http://localhost:8000/api/tablereservation/time-slots'),
      ]);

      console.log('Reservations:', reservationsRes.data);
      console.log('Tables:', tablesRes.data);
      console.log('Time Slots:', timeSlotsRes.data);

      setReservations(reservationsRes.data);
      setTables(tablesRes.data);
      setTimeSlots(timeSlotsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, filterStatus, searchQuery, viewType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'seated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'seated':
        return Users;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'no-show':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const handleNewReservation = async (reservationData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tablereservation/reservations', {
        guest: reservationData.guest,
        email: reservationData.email,
        phone: reservationData.phone,
        table: reservationData.table,
        date: reservationData.date,
        time: reservationData.time,
        party: reservationData.party,
        notes: reservationData.notes,
        specialRequests: reservationData.specialRequests,
        deposit: reservationData.deposit,
        allergies: reservationData.allergies,
        source: 'online',
      });
      setReservations([...reservations, response.data]);
      setShowNewReservation(false);
      fetchData();
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError('Failed to create reservation. Please try again.');
    }
  };

  const handleUpdateReservation = async (updatedReservation) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tablereservation/reservations/${updatedReservation.id}`, {
        guest: updatedReservation.guest,
        email: updatedReservation.email,
        phone: updatedReservation.phone,
        table: updatedReservation.table,
        date: updatedReservation.date,
        time: updatedReservation.time,
        party: updatedReservation.party,
        notes: updatedReservation.notes,
        specialRequests: updatedReservation.specialRequests,
        deposit: updatedReservation.deposit,
        allergies: updatedReservation.allergies,
        status: updatedReservation.status,
      });
      setReservations(reservations.map((r) => (r.id === updatedReservation.id ? response.data : r)));
      setEditingReservation(null);
      fetchData();
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Failed to update reservation. Please try again.');
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tablereservation/reservations/${id}`);
      setReservations(reservations.filter((r) => r.id !== id));
      fetchData();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Failed to delete reservation. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tablereservation/reservations/${id}/status`, { status: newStatus });
      
      // Update the reservations array
      setReservations(reservations.map((r) => (r.id === id ? response.data : r)));
      
      // Update the selected reservation if it's the one being modified
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation(response.data);
      }
      
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const NewReservationForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState(
      initialData || {
        guest: '',
        email: '',
        phone: '',
        table: '',
        date: selectedDate.toISOString().split('T')[0],
        time: '',
        party: 1,
        notes: '',
        specialRequests: [],
        deposit: 0,
        allergies: [],
      }
    );
    const [newSpecialRequest, setNewSpecialRequest] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    const formRef = useRef(null);
    const scrollPositionRef = useRef(0);
    const activeInputRef = useRef(null);

    // Maintain scroll position
    useEffect(() => {
      const formElement = formRef.current;
      if (formElement) {
        formElement.scrollTop = scrollPositionRef.current;
        const handleScroll = () => {
          scrollPositionRef.current = formElement.scrollTop;
        };
        formElement.addEventListener('scroll', handleScroll);
        return () => formElement.removeEventListener('scroll', handleScroll);
      }
    }, []);

    // Maintain input focus
    useEffect(() => {
      if (activeInputRef.current) {
        activeInputRef.current.focus();
      }
    }, [formData]);

    const handleInputFocus = (e) => {
      activeInputRef.current = e.target;
    };

    const handleInputClick = (e) => {
      e.stopPropagation();
      activeInputRef.current = e.target;
      e.target.focus();
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const addSpecialRequest = () => {
      if (newSpecialRequest.trim()) {
        setFormData({ ...formData, specialRequests: [...formData.specialRequests, newSpecialRequest.trim()] });
        setNewSpecialRequest('');
      }
    };

    const removeSpecialRequest = (index) => {
      setFormData({
        ...formData,
        specialRequests: formData.specialRequests.filter((_, i) => i !== index),
      });
    };

    const addAllergy = () => {
      if (newAllergy.trim()) {
        setFormData({ ...formData, allergies: [...formData.allergies, newAllergy.trim()] });
        setNewAllergy('');
      }
    };

    const removeAllergy = (index) => {
      setFormData({
        ...formData,
        allergies: formData.allergies.filter((_, i) => i !== index),
      });
    };

    const availableTables = tables.filter((table) => table.status === 'available' && table.capacity >= formData.party);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scroll-smooth"
          ref={formRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? 'Edit Reservation' : 'New Reservation'}
              </h2>
              <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Guest Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guest}
                    onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter guest name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="guest@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Party Size *</label>
                  <select
                    required
                    value={formData.party}
                    onChange={(e) => setFormData({ ...formData, party: parseInt(e.target.value) })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Table</label>
                  <select
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Auto-assign</option>
                    {availableTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.id} - {table.capacity} seats ({table.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests & Allergies */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests & Notes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special notes or requests..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSpecialRequest}
                      onChange={(e) => setNewSpecialRequest(e.target.value)}
                      onClick={handleInputClick}
                      onFocus={handleInputFocus}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add special request"
                    />
                    <button
                      type="button"
                      onClick={addSpecialRequest}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialRequests.map((request, index) => (
                      <div
                        key={index}
                        className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {request}
                        <button
                          type="button"
                          onClick={() => removeSpecialRequest(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onClick={handleInputClick}
                      onFocus={handleInputFocus}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add allergy"
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) =>
                      setFormData({ ...formData, deposit: parseFloat(e.target.value) || 0 })
                    }
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {initialData ? 'Update Reservation' : 'Create Reservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ReservationDetails = ({ reservation, onClose, onEdit, onDelete, onStatusChange }) => {
    const StatusIcon = getStatusIcon(reservation.status);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {reservation.guest.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{reservation.guest}</h2>
                  <p className="text-sm text-gray-600">{reservation.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StatusIcon className="h-5 w-5 text-gray-600" />
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(reservation)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(reservation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{reservation.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{reservation.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reservation Details
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {formatDate(reservation.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{formatTime(reservation.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{reservation.party} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">Table {reservation.table}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Profile</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {reservation.loyaltyMember ? 'Loyalty Member' : 'Regular Guest'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {reservation.previousVisits} previous visits
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {reservation.deposit > 0 ? `$${reservation.deposit} deposit` : 'No deposit'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <span className="text-sm text-gray-900 capitalize">{reservation.source}</span>
                </div>
              </div>
            </div>

            {reservation.specialRequests && reservation.specialRequests.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <div className="flex flex-wrap gap-2">
                  {reservation.specialRequests.map((request, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {request}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {reservation.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{reservation.notes}</p>
              </div>
            )}

            {reservation.allergies && reservation.allergies.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {reservation.allergies.map((allergy, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Quick Actions</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onStatusChange(reservation.id, 'confirmed')}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-lg hover:bg-green-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => onStatusChange(reservation.id, 'seated')}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg hover:bg-blue-200"
                >
                  Seat Guests
                </button>
                <button
                  onClick={() => onStatusChange(reservation.id, 'completed')}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200"
                >
                  Complete
                </button>
                <button
                  onClick={() => onStatusChange(reservation.id, 'cancelled')}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-lg hover:bg-red-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const mainMargin = sidebarMinimized ? 'lg:ml-16' : 'lg:ml-64';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
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
        <div className="bg-white shadow-sm border-b border-gray-200">
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
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Table Reservations</h1>
                  <p className="text-gray-600">Manage your restaurant bookings</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search reservations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowNewReservation(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Reservation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-100 border-b border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('day')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewType === 'day' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewType('all')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewType === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  All Reservations
                </button>
              </div>

              <button
                onClick={() => fetchData()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reservations.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter((r) => r.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {reservations.filter((r) => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reservations.filter((r) => r.status === 'seated').length}
              </p>
              <p className="text-sm text-gray-600">Seated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {reservations.filter((r) => r.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {reservations.filter((r) => r.status === 'cancelled').length}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto">
          {viewType === 'day' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reservations for {formatDate(selectedDate)}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchData()}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                    <p className="text-gray-600 mb-6">
                      No reservations match your current filters for this date.
                    </p>
                    <button
                      onClick={() => setShowNewReservation(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Reservation</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Guest</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Table</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Party</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((reservation) => {
                            const StatusIcon = getStatusIcon(reservation.status);
                            return (
                              <tr
                                key={reservation.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {formatTime(reservation.time)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">
                                        {reservation.guest.split(' ').map((n) => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{reservation.guest}</p>
                                      <p className="text-xs text-gray-600">{reservation.id}</p>
                                      {reservation.loyaltyMember && (
                                        <div className="flex items-center space-x-1 mt-1">
                                          <Star className="h-3 w-3 text-yellow-500" />
                                          <span className="text-xs text-yellow-600">VIP</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Utensils className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-900">{reservation.table}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-900">{reservation.party}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className="h-4 w-4 text-gray-500" />
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                        reservation.status
                                      )}`}
                                    >
                                      {reservation.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">{reservation.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">{reservation.email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="max-w-32">
                                    {reservation.notes && (
                                      <p
                                        className="text-xs text-gray-600 truncate"
                                        title={reservation.notes}
                                      >
                                        {reservation.notes}
                                      </p>
                                    )}
                                    {reservation.specialRequests && reservation.specialRequests.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {reservation.specialRequests.slice(0, 2).map((request, index) => (
                                          <span
                                            key={index}
                                            className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                          >
                                            {request}
                                          </span>
                                        ))}
                                        {reservation.specialRequests.length > 2 && (
                                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                            +{reservation.specialRequests.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => {
                                        setSelectedReservation(reservation);
                                        setShowReservationDetails(true);
                                      }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingReservation(reservation)}
                                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReservation(reservation.id)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewType === 'all' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">All Reservations</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fetchData()}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                    <p className="text-gray-600 mb-6">No reservations in the database.</p>
                    <button
                      onClick={() => setShowNewReservation(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Reservation</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Guest</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Table</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Party</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations
                          .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time))
                          .map((reservation) => {
                            const StatusIcon = getStatusIcon(reservation.status);
                            return (
                              <tr
                                key={reservation.id}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {formatDate(reservation.date)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">
                                      {formatTime(reservation.time)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">
                                        {reservation.guest.split(' ').map((n) => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{reservation.guest}</p>
                                      <p className="text-xs text-gray-600">{reservation.id}</p>
                                      {reservation.loyaltyMember && (
                                        <div className="flex items-center space-x-1 mt-1">
                                          <Star className="h-3 w-3 text-yellow-500" />
                                          <span className="text-xs text-yellow-600">VIP</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Utensils className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-900">{reservation.table}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-900">{reservation.party}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <StatusIcon className="h-4 w-4 text-gray-500" />
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                        reservation.status
                                      )}`}
                                    >
                                      {reservation.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">{reservation.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">{reservation.email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="max-w-32">
                                    {reservation.notes && (
                                      <p
                                        className="text-xs text-gray-600 truncate"
                                        title={reservation.notes}
                                      >
                                        {reservation.notes}
                                      </p>
                                    )}
                                    {reservation.specialRequests && reservation.specialRequests.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {reservation.specialRequests.slice(0, 2).map((request, index) => (
                                          <span
                                            key={index}
                                            className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                          >
                                            {request}
                                          </span>
                                        ))}
                                        {reservation.specialRequests.length > 2 && (
                                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                            +{reservation.specialRequests.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => {
                                        setSelectedReservation(reservation);
                                        setShowReservationDetails(true);
                                      }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingReservation(reservation)}
                                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                      title="Edit"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReservation(reservation.id)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {showNewReservation && (
            <NewReservationForm
              onSave={handleNewReservation}
              onCancel={() => setShowNewReservation(false)}
            />
          )}

          {showReservationDetails && selectedReservation && (
            <ReservationDetails
              reservation={selectedReservation}
              onClose={() => {
                setShowReservationDetails(false);
                setSelectedReservation(null);
              }}
              onEdit={(reservation) => {
                setEditingReservation(reservation);
                setShowReservationDetails(false);
              }}
              onDelete={handleDeleteReservation}
              onStatusChange={handleStatusChange}
            />
          )}

          {editingReservation && (
            <NewReservationForm
              initialData={editingReservation}
              onSave={handleUpdateReservation}
              onCancel={() => setEditingReservation(null)}
            />
          )}

          {showCalendar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(new Date(e.target.value));
                    setShowCalendar(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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

export default TableReservation;