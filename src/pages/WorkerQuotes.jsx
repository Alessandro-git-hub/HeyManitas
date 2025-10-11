import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import WorkerLayout from '../components/layout/WorkerLayout';
import EmptyState from '../components/common/EmptyState';

export default function WorkerQuotes() {
  const { user } = useAuth();
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: '',
    message: '',
    validUntil: ''
  });

  // Fetch pending booking requests
  const fetchBookingRequests = useCallback(async () => {
    if (!user) {
      return;
    }
    
    try {
      setLoading(true);
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', user.uid),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      const requests = [];
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        requests.push(data);
      });
      
      // Sort by creation date (newest first)
      requests.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      

      setBookingRequests(requests);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookingRequests();
  }, [fetchBookingRequests]);

  const handleQuoteSubmit = async (bookingId, showFeedback) => {
    try {
      const quotedPrice = parseFloat(quoteForm.quotedPrice);
      
      if (!quotedPrice || quotedPrice <= 0) {
        showFeedback('Please enter a valid quote amount.', 'error');
        return;
      }

      if (!quoteForm.message.trim()) {
        showFeedback('Please provide a message with your quote.', 'error');
        return;
      }

      // Calculate default expiry (7 days from now)
      const validUntil = quoteForm.validUntil 
        ? new Date(quoteForm.validUntil)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Get the booking to check its current data
      const booking = bookingRequests.find(b => b.id === bookingId);

      // Update the booking with quote information
      const updateData = {
        status: 'quoted',
        quotedPrice: quotedPrice,
        originalPrice: booking?.hourlyRate,
        workerQuoteMessage: quoteForm.message.trim(),
        quotedAt: Timestamp.now(),
        quoteExpiresAt: Timestamp.fromDate(validUntil)
      };
      
      await updateDoc(doc(db, 'bookings', bookingId), updateData);

      showFeedback('Quote sent successfully!', 'success');
      setActiveQuoteId(null);
      setQuoteForm({ quotedPrice: '', message: '', validUntil: '' });
      
      // Refresh the list
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error sending quote:', error);
      showFeedback('Error sending quote. Please try again.', 'error');
    }
  };

  const handleDeclineRequest = async (bookingId, showFeedback) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'declined',
        declinedAt: Timestamp.now()
      });
      
      showFeedback('Booking request declined.', 'success');
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error declining request:', error);
      showFeedback('Error declining request. Please try again.', 'error');
    }
  };
  
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



  const renderContent = (showFeedback) => {
    return (
      <>
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Quote Requests</h1>
            <p className="text-lg text-primary-700">Review and respond to booking requests</p>
          </div>
        </div>

        {/* Quote Requests List */}
        {bookingRequests.length === 0 ? (
          <div className="text-center py-16">
            <EmptyState
              icon={
                <svg className="w-16 h-16 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              }
              title="No pending quote requests"
              description="When customers request your services, they'll appear here for you to review and quote."
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {bookingRequests.map((request) => {
              return (
              <div key={request.id} className="bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl group hover:border-primary-300 relative overflow-hidden transition-all duration-300 flex flex-col">
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
                      <p className="text-sm text-white p-3 rounded-md mb-4 md:mb-4 flex-1" style={{ background: '#6F4E37' }}>
                        {request.description || request.message || 'No additional message provided.'}
                      </p>
                    </div>
                  </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white">
                  {activeQuoteId === request.id ? (
                    <div className="flex-1">
                      <div className="bg-primary-600 p-4 rounded-lg">
                        <h4 className="font-bold text-white mb-4">Send Quote</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quote Amount (€)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={quoteForm.quotedPrice}
                                onChange={(e) => setQuoteForm(prev => ({ ...prev, quotedPrice: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="150.00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valid Until (optional)
                              </label>
                              <input
                                type="date"
                                value={quoteForm.validUntil}
                                onChange={(e) => setQuoteForm(prev => ({ ...prev, validUntil: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Message to Customer
                            </label>
                            <textarea
                              value={quoteForm.message}
                              onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              rows="3"
                              placeholder="Thank you for your request. Based on your requirements, I can complete this service for..."
                            />
                          </div>
                          
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleQuoteSubmit(request.id, showFeedback)}
                            className="bg-secondary-600 text-primary-700 px-6 py-3 rounded-3xl font-medium cursor-pointer"
                          >
                            Send Quote
                          </button>
                          <button
                            onClick={() => {
                              setActiveQuoteId(null);
                              setQuoteForm({ quotedPrice: '', message: '', validUntil: '' });
                            }}
                            className="text-white hover:text-secondary-600 px-4 py-2 rounded-md font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          setActiveQuoteId(request.id);
                          setQuoteForm(prev => ({ ...prev, quotedPrice: request.hourlyRate?.toString() || '' }));
                        }}
                        className="bg-secondary-600 text-primary-700 px-6 py-3 rounded-3xl font-medium cursor-pointer"
                      >
                        Send Quote
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.id, showFeedback)}
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
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <WorkerLayout
      title="Quote Requests"
      loading={loading}
    >
      {renderContent}
    </WorkerLayout>
  );
}
