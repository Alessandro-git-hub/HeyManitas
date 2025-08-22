import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaCalendar, FaClock } from 'react-icons/fa';
import CalendarWidget from '../components/CalendarWidget';
import FileUploader from '../components/common/FileUploader';
import { createBooking } from '../utils/bookings';
import AppHeader from '../components/layout/AppHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';
import { useAuth } from '../contexts/AuthContext';

const CustomerBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { professional, categoryName } = location.state || {};
  
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    address: '',
    phone: '',
    email: user?.email || '', // Auto-populate with user's email
    contactName: ''
  });

  // Update email when user loads
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);
  
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!professional) {
    return (
      <div className="min-h-screen bg-light">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CustomerNavigation />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Professional Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the professional you're trying to book.</p>
            <button
              onClick={() => navigate('/customer/services')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeSelect = (datetime, timeSlot) => {
    setSelectedDateTime(datetime);
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDateTime || !selectedTimeSlot) {
      alert('Please select a date and time for your appointment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the booking with real data
      const bookingData = {
        ...formData,
        professionalId: professional.id,
        professionalName: professional.name,
        customerEmail: user.email, // Use auth email directly for consistency
        date: selectedDateTime.toISOString().split('T')[0], // YYYY-MM-DD
        time: selectedTimeSlot, // HH:MM format
        datetime: selectedDateTime.toISOString(),
        status: 'pending',
        categoryName,
        hourlyRate: professional.hourlyRate,
        attachments: attachedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          uploadedAt: new Date().toISOString()
        }))
      };

      // Save to Firebase bookings collection
      const result = await createBooking(bookingData);
      
      if (result.success) {
        // Show success and redirect
        const timeDisplay = (() => {
          const [hour, minute] = selectedTimeSlot.split(':');
          const hourNum = parseInt(hour);
          const ampm = hourNum >= 12 ? 'PM' : 'AM';
          const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
          return `${displayHour}:${minute} ${ampm}`;
        })();
        
        alert(`Booking request sent successfully! Your appointment is scheduled for ${selectedDateTime.toLocaleDateString()} at ${timeDisplay}. The professional will contact you shortly.`);
        navigate('/customer/services');
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <CustomerNavigation />
        
        {/* Page Title */}
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
            <p className="text-gray-600">Schedule your appointment with {professional.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professional Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <img
                  src={professional.avatar}
                  alt={professional.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{professional.name}</h3>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span>{professional.rating}</span>
                  <span>({professional.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <FaMapMarkerAlt />
                  <span>{professional.location}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{categoryName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rate</span>
                  <span className="font-medium">${professional.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{professional.experience}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className={`inline-flex px-3 py-1 text-xs rounded-full ${
                  professional.availability === 'Available Today' 
                    ? 'bg-green-100 text-green-700'
                    : professional.availability === 'Available This Week'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {professional.availability}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Service Request Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of {categoryName.toLowerCase()} service do you need?
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select service type</option>
                    {professional.specialties.map((specialty, index) => (
                      <option key={index} value={specialty}>{specialty}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your project
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Please provide details about what you need done..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Add photos, documents, or sketches to help explain your project requirements
                  </p>
                  <FileUploader 
                    onFilesChange={setAttachedFiles}
                    maxFiles={5}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
                  />
                </div>

                {/* Calendar Widget for Date and Time Selection */}
                <div>
                  <CalendarWidget 
                    professionalId={professional.id}
                    onDateTimeSelect={handleDateTimeSelect}
                    selectedDateTime={selectedDateTime}
                  />
                  {selectedDateTime && selectedTimeSlot && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                      <h4 className="font-medium text-primary-800 mb-2">Selected Appointment</h4>
                      <p className="text-primary-700">
                        <FaCalendar className="inline mr-2" />
                        {selectedDateTime.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-primary-700">
                        <FaClock className="inline mr-2" />
                        {selectedTimeSlot && (() => {
                          const [hour, minute] = selectedTimeSlot.split(':');
                          const hourNum = parseInt(hour);
                          const ampm = hourNum >= 12 ? 'PM' : 'AM';
                          const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
                          return `${displayHour}:${minute} ${ampm}`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                      <span className="text-xs text-gray-500 ml-2">(From your account)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      title="This email is automatically set from your account"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    required
                    placeholder="Enter the full address where service is needed..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Urgency */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBooking;
