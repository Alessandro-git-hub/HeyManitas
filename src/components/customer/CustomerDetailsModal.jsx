import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import ActionButton from '../common/ActionButton';

export default function CustomerDetailsModal({ isOpen, onClose, customer, onEdit }) {
  if (!isOpen || !customer) return null;

  const formatPhone = (phone) => {
    if (!phone) return '';
    // Simple phone formatting for display
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary font-semibold text-xl">
                  {getInitials(customer.name)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-deep">{customer.name || 'Unnamed Client'}</h2>
                {customer.company && (
                  <p className="text-lg text-gray-600 mt-1">{customer.company}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(customer);
                }}
                className="text-primary-600 hover:text-primary-800 transition-colors p-2 rounded-lg hover:bg-primary-50"
                title="Edit customer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-deep mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.email && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a href={`mailto:${customer.email}`} className="text-primary-600 hover:text-primary-800 transition-colors">
                      {customer.email}
                    </a>
                  </div>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <a href={`tel:${customer.phone}`} className="text-primary-600 hover:text-primary-800 transition-colors">
                      {formatPhone(customer.phone)}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {customer.address && (
            <div>
              <h3 className="text-lg font-semibold text-deep mb-4">Address</h3>
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-700 whitespace-pre-line">{customer.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div>
              <h3 className="text-lg font-semibold text-deep mb-4">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{customer.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {formatDateTime(customer.createdAt)}
              </div>
              {customer.updatedAt && customer.updatedAt !== customer.createdAt && (
                <div>
                  <span className="font-medium">Updated:</span>{' '}
                  {formatDateTime(customer.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <ActionButton
              onClick={onClose}
              variant="outline"
              size="medium"
            >
              Close
            </ActionButton>
            <ActionButton
              onClick={() => {
                onClose();
                onEdit(customer);
              }}
              size="modal"
            >
              Edit Client
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
