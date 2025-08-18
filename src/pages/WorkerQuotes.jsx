import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import WorkerNavigation from '../components/layout/WorkerNavigation';
import WorkerHeader from '../components/layout/WorkerHeader';

export default function WorkerQuotes() {
  const { user, loading: authLoading } = useAuth();
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: '',
    message: '',
    validUntil: ''
  });

  // Fetch pending booking requests
  const fetchBookingRequests = useCallback(async () => {
    if (!user) {
      console.log('No user, skipping fetch');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching booking requests for worker:', user.uid);
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', user.uid),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      const requests = [];
      
      console.log('Found', snapshot.size, 'pending booking requests');
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        console.log('Booking request:', data);
        requests.push(data);
      });
      
      // Sort by creation date (newest first)
      requests.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      console.log('Final booking requests:', requests);
      setBookingRequests(requests);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      setFeedback({ message: 'Error loading booking requests.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchBookingRequests();
    }
  }, [fetchBookingRequests, authLoading]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view quote requests.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleQuoteSubmit = async (bookingId) => {
    try {
      const quotedPrice = parseFloat(quoteForm.quotedPrice);
      
      if (!quotedPrice || quotedPrice <= 0) {
        setFeedback({ message: 'Please enter a valid quote amount.', type: 'error' });
        return;
      }

      if (!quoteForm.message.trim()) {
        setFeedback({ message: 'Please provide a message with your quote.', type: 'error' });
        return;
      }

      // Calculate default expiry (7 days from now)
      const validUntil = quoteForm.validUntil 
        ? new Date(quoteForm.validUntil)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Get the booking to check its current data
      const booking = bookingRequests.find(b => b.id === bookingId);
      console.log('Sending quote for booking:', booking);

      // Update the booking with quote information
      const updateData = {
        status: 'quoted',
        quotedPrice: quotedPrice,
        originalPrice: booking?.hourlyRate,
        workerQuoteMessage: quoteForm.message.trim(),
        quotedAt: Timestamp.now(),
        quoteExpiresAt: Timestamp.fromDate(validUntil)
      };
      
      console.log('Updating booking with:', updateData);
      
      await updateDoc(doc(db, 'bookings', bookingId), updateData);

      setFeedback({ message: 'Quote sent successfully!', type: 'success' });
      setActiveQuoteId(null);
      setQuoteForm({ quotedPrice: '', message: '', validUntil: '' });
      
      // Refresh the list
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error sending quote:', error);
      setFeedback({ message: 'Error sending quote. Please try again.', type: 'error' });
    }
  };

  const handleDeclineRequest = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'declined',
        declinedAt: Timestamp.now()
      });

      setFeedback({ message: 'Booking request declined.', type: 'success' });
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error declining request:', error);
      setFeedback({ message: 'Error declining request. Please try again.', type: 'error' });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <WorkerHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <WorkerNavigation />
        
        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-md ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-600">Review and respond to booking requests</p>
        </div>

        {/* Quote Requests List */}
        {bookingRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending quote requests</h3>
            <p className="text-gray-600">
              When customers request your services, they'll appear here for you to review and quote.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookingRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Request Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.serviceType} Service Request
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {request.customerEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        Requested: {formatDate(request.createdAt)} at {formatTime(request.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Quote
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Base Rate: €{request.hourlyRate}/hour
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Service:</span> {request.serviceType}</p>
                        <p><span className="text-gray-600">Date:</span> {request.date}</p>
                        <p><span className="text-gray-600">Time:</span> {request.time}</p>
                        <p><span className="text-gray-600">Duration:</span> {request.duration} hours</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer Message</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {request.description || request.message || 'No additional message provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-4">
                    {activeQuoteId === request.id ? (
                      <div className="flex-1">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-4">Send Quote</h4>
                          
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              rows="3"
                              placeholder="Thank you for your request. Based on your requirements, I can complete this service for..."
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleQuoteSubmit(request.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                            >
                              Send Quote
                            </button>
                            <button
                              onClick={() => {
                                setActiveQuoteId(null);
                                setQuoteForm({ quotedPrice: '', message: '', validUntil: '' });
                              }}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setActiveQuoteId(request.id);
                            setQuoteForm(prev => ({ ...prev, quotedPrice: request.hourlyRate?.toString() || '' }));
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                        >
                          Send Quote
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
