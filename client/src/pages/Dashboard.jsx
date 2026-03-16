import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableBooking from '../components/Host/TableBooking';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'pending', 'cancelled'


  const fetchHostDashboard = useCallback(() => {
    fetch('/api/host/get-bookings')
      .then(res => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.hostHomes);
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => toast.error("Failed communicating with server"));
  }, []);

  useEffect(() => {
    fetchHostDashboard();

  }, [fetchHostDashboard]);

  // Combined Filtering Logic
  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status.toLowerCase() === filterStatus;
  });

  // Action Handlers
 


  // Date Handler


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Owner Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold text-gray-800">
            $ {bookings.filter(b => b.status === 'paid' || b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0)}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Active Bookings</p>
          <h2 className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status !== 'cancelled').length}</h2>
        </div>
        {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Cancellation Rate</p>
          <h2 className="text-2xl font-bold text-red-500">
            {bookings.length > 0 ? ((bookings.filter(b => b.status === 'cancelled').length / bookings.length) * 100).toFixed(1) : 0}%
          </h2>
        </div> */}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 bg-white p-1 rounded-lg shadow-sm w-fit border border-gray-200">
        {['all', 'paid', 'pending', 'cancelled', 'confirmed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterStatus === status
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <TableBooking filteredBookings={filteredBookings} fetchBooking={fetchHostDashboard} />
      </div>
    </div>
  );
};

export default Dashboard;