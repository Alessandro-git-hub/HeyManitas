import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const CalendarWidget = ({ professionalId, onDateTimeSelect, selectedDateTime }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Time slots available for booking (9 AM to 6 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const formatTimeSlot = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null); // Clear selection when changing months
  };

  // Fetch professional's availability and bookings for selected date
  const fetchAvailabilityForDate = async (date) => {
    if (!professionalId || !date) return;

    setLoading(true);
    try {
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Fetch professional's availability settings
      const professionalRef = doc(db, 'users', professionalId);
      const professionalDoc = await getDoc(professionalRef);
      
      let professionalAvailability = timeSlots; // Default: all slots available
      if (professionalDoc.exists()) {
        const data = professionalDoc.data();
        if (data.availability && data.availability[dateString]) {
          professionalAvailability = data.availability[dateString];
        }
      }

      // Fetch existing bookings for this professional on this date
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', professionalId),
        where('date', '==', dateString),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookedTimes = bookingsSnapshot.docs.map(doc => doc.data().time);

      // Calculate available slots (professional available AND not booked)
      const available = professionalAvailability.filter(slot => !bookedTimes.includes(slot));

      setAvailableSlots(available);
      setBookedSlots(bookedTimes);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots(timeSlots); // Fallback to all slots
      setBookedSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date < new Date().setHours(0, 0, 0, 0)) return; // Prevent past dates
    
    setSelectedDate(date);
    fetchAvailabilityForDate(date);
  };

  // Handle time slot selection
  const handleTimeSelect = (time) => {
    if (!selectedDate || !availableSlots.includes(time)) return;
    
    const datetime = new Date(selectedDate);
    const [hour, minute] = time.split(':');
    datetime.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    onDateTimeSelect(datetime, time);
  };

  // Check if date is today or in the future
  const isDateSelectable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h3>
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <h4 className="text-lg font-medium text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && handleDateSelect(date)}
            disabled={!date || !isDateSelectable(date)}
            className={`
              h-10 w-10 rounded-lg text-sm font-medium transition-colors
              ${!date ? 'invisible' : ''}
              ${!isDateSelectable(date) 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-blue-100 cursor-pointer'
              }
              ${isToday(date) ? 'bg-blue-100 text-blue-600' : ''}
              ${isSelected(date) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
            `}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <div className="flex items-center mb-3">
            <FaClock className="text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-800">
              Available Times for {selectedDate.toLocaleDateString()}
            </h4>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading availability...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(time => {
                const isAvailable = availableSlots.includes(time);
                const isBooked = bookedSlots.includes(time);
                const isSelectedTime = selectedDateTime && 
                  selectedDateTime.toTimeString().slice(0, 5) === time;
                
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={!isAvailable}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-colors
                      ${!isAvailable 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : isSelectedTime
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-100 cursor-pointer'
                      }
                    `}
                  >
                    {formatTimeSlot(time)}
                    {isBooked && (
                      <span className="block text-xs text-red-500">Booked</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {selectedDate && availableSlots.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
              <p>No available time slots for this date.</p>
              <p className="text-sm">Please select another date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
