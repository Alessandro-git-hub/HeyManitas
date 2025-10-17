import React from 'react';
import QuoteForm from './QuoteForm';

export default function QuoteCard({ 
  request, 
  isActive, 
  quoteForm, 
  onToggleQuote, 
  onUpdateForm, 
  onSubmitQuote, 
  onDeclineRequest,
  onCancelQuote 
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl group hover:border-primary-300 relative overflow-hidden transition-all duration-300 flex flex-col h-fit">
      {/* Subtle accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Request Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-secondary-600 mb-2">
            {request.serviceType}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium bg-white px-2 py-1 rounded-full" style={{ color: '#6F4E37' }}>
              From: {request.customerName}
            </span>
          </div>
          <p className="text-sm text-secondary-600">
            <span className="text-white font-bold">Requested:</span> {formatDate(request.createdAt)} at {formatTime(request.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-secondary-600 text-primary-700 mb-2 inline-block">
            Pending Quote
          </span>
          <p className="text-sm text-secondary-600">
            <span className="text-white font-bold">Base Rate:</span> €{request.hourlyRate}/hour
          </p>
        </div>
      </div>

      {/* Request Details */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="space-y-2 text-sm text-secondary-600 mb-4">
              <p><span className="text-white font-bold">Service:</span> {request.serviceType}</p>
              <p><span className="text-white font-bold">Date:</span> {request.date}</p>
              <p><span className="text-white font-bold">Time:</span> {request.time}</p>
              <p><span className="text-white font-bold">Duration:</span> {request.duration} hours</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-white mb-2">Customer Message</h4>
            <p className="text-sm text-white p-3 rounded-md mb-4 md:mb-4 flex-1 bg-primary-600 border border-white">
              {request.description || request.message || 'No additional message provided.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white">
          {isActive ? (
            <QuoteForm
              request={request}
              quoteForm={quoteForm}
              onUpdateForm={onUpdateForm}
              onSubmitQuote={onSubmitQuote}
              onCancel={onCancelQuote}
            />
          ) : (
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  console.log('Send Quote button clicked for:', request.id);
                  onToggleQuote(request.id, request.hourlyRate);
                }}
                className="bg-secondary-600 text-primary-700 px-6 py-3 rounded-3xl font-medium cursor-pointer"
              >
                Send Quote
              </button>
              <button
                onClick={() => onDeclineRequest(request.id)}
                className="bg-red-700 text-white transition-colors px-4 py-2 rounded cursor-pointer rounded-3xl"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}