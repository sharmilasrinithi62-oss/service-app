
import React, { useState } from 'react';
import { Booking, CarService } from '../types';
import { WORKSHOP } from '../constants';

interface AdminDashboardProps {
  bookings: Booking[];
  allServices: CarService[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, allServices, onUpdateStatus, onDelete }) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredBookings = bookings.filter(b => filter === 'All' || b.status === filter);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage customer bookings for {WORKSHOP.name}</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
          {['All', 'Pending', 'Confirmed', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
          <i className="fa-solid fa-calendar-xmark text-6xl text-gray-200 mb-4"></i>
          <p className="text-gray-500 text-lg">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{booking.customerName}</h3>
                  <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Date</span>
                    <span className="font-semibold">{booking.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Time</span>
                    <span className="font-semibold">{booking.time}</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm block mb-1">Services</span>
                  <div className="flex flex-wrap gap-1">
                    {booking.selectedServices.map(sid => (
                      <span key={sid} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs border border-blue-100">
                        {allServices.find(s => s.id === sid)?.name || sid}
                      </span>
                    ))}
                    {booking.selectedServices.length === 0 && <span className="text-gray-400 italic text-xs">General Check</span>}
                  </div>
                </div>

                {booking.carDetails && (
                  <div className="bg-gray-50 p-2 rounded text-sm italic">
                    <span className="text-gray-400 block non-italic mb-1">Car Info:</span>
                    {booking.carDetails}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <a href={`tel:${booking.phone}`} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-center py-2 rounded-lg transition-colors">
                    <i className="fa-solid fa-phone text-blue-600"></i>
                  </a>
                  <a href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-center py-2 rounded-lg transition-colors">
                    <i className="fa-brands fa-whatsapp text-green-600"></i>
                  </a>
                  <button 
                    onClick={() => onUpdateStatus(booking.id, booking.status === 'Pending' ? 'Confirmed' : 'Completed')}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-sm transition-colors text-xs"
                  >
                    {booking.status === 'Pending' ? 'Confirm' : 'Next Stage'}
                  </button>
                  <button 
                    onClick={() => onDelete(booking.id)}
                    className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-center py-2 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-trash text-red-600"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
