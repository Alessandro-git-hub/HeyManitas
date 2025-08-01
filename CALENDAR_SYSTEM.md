# 📅 Calendar & Booking System

## Overview
We've implemented a complete calendar widget with real-time availability checking and booking persistence. This enables customers to see when professionals are available and book specific time slots.

## Components Added

### 1. CalendarWidget Component (`src/components/CalendarWidget.jsx`)
- **Interactive Calendar**: Month navigation, date selection
- **Real-time Availability**: Fetches professional's available time slots
- **Booking Conflict Prevention**: Shows booked vs available slots
- **Professional Time Slots**: 9 AM to 6 PM weekday availability
- **Visual Feedback**: Color-coded availability status

#### Features:
- ✅ Month navigation (previous/next)
- ✅ Prevents past date selection
- ✅ Shows today's date highlight
- ✅ Fetches real availability from Firebase
- ✅ Displays booked time slots
- ✅ Only shows available slots for selection

### 2. Booking Utilities (`src/utils/bookings.js`)
- **createBooking()**: Save new bookings to Firebase
- **getProfessionalBookings()**: Get existing bookings for conflict checking
- **updateBookingStatus()**: Change booking status (pending → confirmed)
- **isTimeSlotAvailable()**: Check if time slot is free

### 3. Availability Management (`src/utils/availability.js`)
- **setDefaultAvailability()**: Set up professional's weekly schedule
- **updateDayAvailability()**: Modify specific day availability
- **getProfessionalAvailability()**: Get professional's time slots

### 4. Enhanced CustomerBooking Page
- **Replaced**: Basic date/time inputs with interactive calendar
- **Added**: Real-time availability checking
- **Added**: Booking persistence to Firebase
- **Added**: Visual confirmation of selected appointment

## Database Structure

### Bookings Collection (`bookings`)
```javascript
{
  id: "auto-generated",
  professionalId: "user123",
  professionalName: "Alessandro Poggio",
  customerEmail: "customer@email.com",
  date: "2025-08-01", // YYYY-MM-DD
  time: "14:00", // HH:MM 24-hour format
  datetime: "2025-08-01T14:00:00.000Z",
  status: "pending", // pending | confirmed | completed | cancelled
  serviceType: "Home Repair",
  description: "Fix kitchen sink",
  address: "123 Main St",
  phone: "+1234567890",
  urgency: "normal",
  budget: "100-200",
  categoryName: "Home Repair",
  hourlyRate: 75,
  createdAt: "2025-07-31T...",
  updatedAt: "2025-07-31T..."
}
```

### User Availability (`users/{userId}`)
```javascript
{
  // ... existing user fields
  availability: {
    "2025-08-01": ["09:00", "10:00", "11:00", "13:00", "14:00"], // Available slots
    "2025-08-02": ["09:00", "10:00", "15:00", "16:00"],
    "2025-08-03": [] // Not available this day
  }
}
```

## How It Works

### 1. Customer Flow
1. Customer browses professionals
2. Clicks "Book Now" on a professional
3. **NEW**: Sees interactive calendar widget
4. Selects date → Calendar fetches that professional's availability
5. Selects available time slot
6. Fills out service details
7. Submits booking → Saved to Firebase with "pending" status

### 2. Availability Checking
1. When date selected → Query professional's availability settings
2. Query existing bookings for that date
3. Calculate available slots = (professional availability) - (booked slots)
4. Display only available time slots to customer

### 3. Booking Prevention
- Past dates are disabled
- Booked time slots are grayed out
- Only available slots are clickable
- Real-time conflict checking before booking creation

## Testing the System

### Setup Test Data
1. Open browser console on your app
2. Run: `setupTestAvailability()`
3. This sets default 9-6 weekday availability for Alessandro Poggio

### Test the Flow
1. Navigate to Services → Home Repair → Alessandro Poggio
2. Click "Book Now"
3. **NEW EXPERIENCE**: Interactive calendar instead of basic inputs
4. Select a date → See real availability
5. Select time slot → See confirmation
6. Complete booking → Saved to Firebase

## Next Steps for Production

### 🔴 Critical
- [ ] Connect to actual professional user IDs (not email strings)
- [ ] Add authentication check before booking
- [ ] Professional dashboard to manage their availability

### 🟡 Important  
- [ ] Email notifications when bookings created
- [ ] SMS reminders for appointments
- [ ] Professional booking approval/decline workflow

### 🟢 Enhancements
- [ ] Multiple time slot selection (longer appointments)
- [ ] Recurring availability patterns
- [ ] Booking cancellation/rescheduling
- [ ] Calendar integration (Google Calendar, etc.)

## Files Modified
- ✅ `src/components/CalendarWidget.jsx` - New interactive calendar
- ✅ `src/pages/CustomerBooking.jsx` - Updated to use calendar
- ✅ `src/utils/bookings.js` - Booking persistence utilities  
- ✅ `src/utils/availability.js` - Availability management
- ✅ `src/testSetup.js` - Development testing helpers
- ✅ `src/main.jsx` - Added test setup for development

The calendar system is now fully functional and ready for testing! 🎉
