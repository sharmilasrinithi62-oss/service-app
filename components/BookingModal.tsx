
import React, { useState } from 'react';
import { Booking, CarService } from '../types';
import { WORKSHOP } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceIds: string[];
  allServices: CarService[];
  onSubmit: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedServiceIds, allServices, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    carDetails: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      selectedServices: selectedServiceIds
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Book Your Service</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">Selected Services:</p>
            <div className="flex flex-wrap gap-2">
              {selectedServiceIds.length > 0 ? (
                selectedServiceIds.map(id => (
                  <span key={id} className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {allServices.find(s => s.id === id)?.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-blue-600">No specific service selected (General Inspection)</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                required
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                required
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              required
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <select
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              >
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Car Details (Make, Model, Year)</label>
            <textarea
              placeholder="e.g. Maruti Suzuki Swift 2018 White"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              value={formData.carDetails}
              onChange={e => setFormData({ ...formData, carDetails: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
