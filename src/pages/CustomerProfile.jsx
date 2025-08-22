import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCheck, FaArrowLeft, FaQuoteLeft } from 'react-icons/fa';
import CustomerHeader from '../components/layout/CustomerHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Check for tab parameter in URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'quotes') {
      setActiveTab('quotes');
    }
  }, [searchParams]);

  // Fetch quotes for the customer
  const fetchQuotes = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const quotesQuery = query(
        collection(db, 'bookings'),
        where('customerEmail', '==', user.email),
        where('status', 'in', ['quoted', 'quote_accepted', 'quote_declined'])
      );
      
      const snapshot = await getDocs(quotesQuery);
      const quotesList = [];
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        quotesList.push(data);
      });
      
      // Sort by quote date (newest first)
      quotesList.sort((a, b) => {
        const dateA = a.quotedAt?.toDate ? a.quotedAt.toDate() : new Date(a.quotedAt || 0);
        const dateB = b.quotedAt?.toDate ? b.quotedAt.toDate() : new Date(b.quotedAt || 0);
        return dateB - dateA;
      });
      
      setQuotes(quotesList);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setFeedback({ message: 'Error loading quotes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && activeTab === 'quotes') {
      fetchQuotes();
    }
  }, [fetchQuotes, authLoading, activeTab]);

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = async () => {
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileData.displayName
      });

      // Here you could also update additional profile info in Firestore if needed
      // For now, we'll just update the auth profile

      setFeedback({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFeedback({ message: 'Error updating profile. Please try again.', type: 'error' });
    }
  };

  const handleQuoteResponse = async (quoteId, action) => {
    try {
      const newStatus = action === 'accept' ? 'quote_accepted' : 'quote_declined';
      const bookingRef = doc(db, 'bookings', quoteId);
      
      await updateDoc(bookingRef, {
        status: newStatus,
        customerResponse: action === 'accept' 
          ? 'Quote accepted by customer' 
          : 'Quote declined by customer',
        respondedAt: Timestamp.now(),
        ...(action === 'accept' && { 
          finalPrice: quotes.find(q => q.id === quoteId)?.quotedPrice,
          paymentStatus: 'pending'
        })
      });

      setFeedback({ 
        message: action === 'accept' ? 'Quote accepted! You can now proceed with payment.' : 'Quote declined.',
        type: 'success' 
      });
      
      // Refresh quotes
      fetchQuotes();
      
    } catch (error) {
      console.error('Error responding to quote:', error);
      setFeedback({ message: 'Error updating quote response. Please try again.', type: 'error' });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuoteStatusColor = (status) => {
    switch (status) {
      case 'quoted':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'quote_accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'quote_declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQuoteStatusText = (status) => {
    switch (status) {
      case 'quoted':
        return 'Pending Response';
      case 'quote_accepted':
        return 'Accepted';
      case 'quote_declined':
        return 'Declined';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <CustomerHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <CustomerNavigation />
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your profile and quotes</p>
        </div>

        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-md ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaUser className="inline mr-2" />
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quotes'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaQuoteLeft className="inline mr-2" />
            My Quotes
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleProfileSave}
                      className="flex items-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                    >
                      <FaSave className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset to original data
                        setProfileData({
                          displayName: user.displayName || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          address: user.address || ''
                        });
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-md font-medium transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.displayName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <p className="text-gray-900 py-2 bg-gray-50 px-3 rounded-md">
                    {profileData.email}
                    <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profileData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading quotes...</p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                <p className="text-gray-600 mb-4">
                  When professionals send you quotes, they'll appear here.
                </p>
                <button
                  onClick={() => navigate('/customer/services')}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {quote.serviceType} Service
                          </h3>
                          <p className="text-sm text-gray-600">
                            Professional: {quote.professionalName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quote received: {formatDate(quote.quotedAt)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQuoteStatusColor(quote.status)}`}>
                          {getQuoteStatusText(quote.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Date:</span> {quote.date}</p>
                            <p><span className="text-gray-600">Time:</span> {quote.time}</p>
                            {quote.duration && (
                              <p><span className="text-gray-600">Duration:</span> {quote.duration} hours</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Quote Details</h4>
                          <div className="space-y-1 text-sm">
                            {quote.hourlyRate && (
                              <p><span className="text-gray-600">Original Rate:</span> €{quote.hourlyRate}</p>
                            )}
                            <p className="text-lg font-semibold text-primary-900">
                              Quote Price: €{quote.quotedPrice}
                            </p>
                            {quote.quoteExpiresAt && (
                              <p className="text-xs text-gray-500">
                                Valid until: {formatDate(quote.quoteExpiresAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {quote.workerQuoteMessage && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Message from Professional</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                            {quote.workerQuoteMessage}
                          </p>
                        </div>
                      )}

                      {quote.status === 'quoted' && (
                        <div className="mt-6 flex space-x-3">
                          <button
                            onClick={() => handleQuoteResponse(quote.id, 'decline')}
                            className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md font-medium transition-colors"
                          >
                            <FaTimes className="mr-2" />
                            Decline Quote
                          </button>
                          <button
                            onClick={() => handleQuoteResponse(quote.id, 'accept')}
                            className="flex items-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
                          >
                            <FaCheck className="mr-2" />
                            Accept Quote
                          </button>
                        </div>
                      )}

                      {quote.status === 'quote_accepted' && (
                        <div className="mt-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 font-medium">Quote Accepted!</p>
                            <p className="text-green-600 text-sm">You can now proceed with payment from your dashboard.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
