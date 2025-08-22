import React from 'react';
import { getStatusStyles, formatDateTimeDetailed, formatDateDetailed } from '../../utils/formatters';

export default function JobDetailsModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  // Check if this is a booking or a job
  const isBooking = job.itemType === 'booking';
  const title = isBooking ? 'Booking Details' : 'Job Details';

  const formatTime = (time) => {
    if (!time) return 'Not specified';
    return time;
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {job.clientName || job.client || job.customerName || job.customerEmail || 'Not specified'}
                </p>
              </div>
              {(job.customerEmail || job.clientEmail) && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{job.customerEmail || job.clientEmail}</p>
                </div>
              )}
              {(job.customerPhone || job.clientPhone || job.phone) && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{job.customerPhone || job.clientPhone || job.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusStyles(job.status, true)}`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>

          {/* Job/Booking Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {isBooking ? 'Service Request Details' : 'Job Details'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium text-gray-900">
                  {job.description || job.notes || 'No description provided'}
                </p>
              </div>
              
              {/* Service Information */}
              {(job.serviceName || job.serviceType) && (
                <div className="bg-primary-50 p-3 rounded border border-primary-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-primary-600">Service</p>
                      <p className="font-medium text-primary-900">{job.serviceName || job.serviceType}</p>
                    </div>
                    {job.basePrice && (
                      <div>
                        <p className="text-sm text-primary-600">Base Price</p>
                        <p className="font-medium text-primary-900">€{job.basePrice}</p>
                      </div>
                    )}
                  </div>
                  {isBooking && job.budget && (
                    <div className="mt-2">
                      <p className="text-sm text-primary-600">Budget</p>
                      <p className="font-medium text-primary-900">{job.budget}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {isBooking ? 'Hourly Rate' : 'Final Price'}
                  </p>
                  <p className="font-medium text-gray-900 text-lg">
                    {isBooking 
                      ? (job.hourlyRate ? `€${job.hourlyRate}/hour` : 'Not specified')
                      : `€${job.finalPrice || job.price || 'Not specified'}`
                    }
                  </p>
                </div>
                {job.serviceId && (
                  <div>
                    <p className="text-sm text-gray-600">Service ID</p>
                    <p className="font-medium text-gray-500 text-sm">{job.serviceId}</p>
                  </div>
                )}
                {isBooking && job.duration && (
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{job.duration}</p>
                  </div>
                )}
              </div>
              
              {/* Location for bookings */}
              {isBooking && (job.address || job.location) && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{job.address || job.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Scheduling Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Scheduling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Scheduled Date</p>
                <p className="font-medium text-gray-900">
                  {job.scheduledDate || job.date 
                    ? formatDateDetailed((job.scheduledDate || job.date) + 'T00:00:00') 
                    : 'Not scheduled'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Appointment Time</p>
                <p className="font-medium text-gray-900">{formatTime(job.scheduledTime || job.time)}</p>
              </div>
              {isBooking && job.datetime && (
                <div>
                  <p className="text-sm text-gray-600">Original Booking Time</p>
                  <p className="font-medium text-gray-900">{formatDateTimeDetailed(job.datetime)}</p>
                </div>
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium text-gray-900">{formatDateTimeDetailed(job.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{isBooking ? 'Booking ID' : 'Job ID'}</p>
                <p className="font-medium text-gray-900 font-mono text-sm">{job.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900 capitalize">{isBooking ? 'Booking Request' : 'Job'}</p>
              </div>
              {job.originalBookingId && (
                <div>
                  <p className="text-sm text-gray-600">Original Booking ID</p>
                  <p className="font-medium text-gray-900 font-mono text-sm">{job.originalBookingId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
