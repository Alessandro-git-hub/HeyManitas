# Components Organization

This directory contains all reusable UI components organized by functionality:

## 📁 Folder Structure

### `/common/`
Reusable UI components used across the application:
- `ActionButton.jsx` - Configurable button component with multiple variants
- `DottedBackground.jsx` - Reusable background component with subtle dots pattern
- `EmptyState.jsx` - Generic empty state component with icons and actions
- `ProtectedRoute.jsx` - Route wrapper for authentication protection

### `/customer/`
Customer/client management components:
- `CustomerCard.jsx` - Individual customer display card with contact info
- `CustomerDetailsModal.jsx` - Modal for viewing detailed customer information
- `CustomerFormModal.jsx` - Modal for creating/editing customer data

### `/job/`
Job-related components:
- `JobCard.jsx` - Individual job display card
- `JobDetailsModal.jsx` - Modal for viewing job and booking details (unified for both types)
- `JobFilters.jsx` - Filtering controls for job lists
- `JobFormModal.jsx` - Modal for creating/editing jobs (with customer integration)
- `JobsList.jsx` - List component for displaying jobs and bookings with grouping

### `/booking/`
Booking-related components:
- `CalendarWidget.jsx` - Interactive calendar for customer appointment booking
- `BookingCard.jsx` - Individual booking display card with status management
- `BookingsSection.jsx` - Complete booking management interface (legacy, integrated into Jobs page)

### `/service/`
Service-related components:
- `ServiceCard.jsx` - Individual service display card with actions

### `/layout/`
Layout and navigation components:
- `WorkerHeader.jsx` - Header component with user info and logout
- `WorkerNavigation.jsx` - Tab navigation for worker pages

## 🧹 Recent Cleanup

### Removed:
- `ServiceCardExamples.jsx` - Unused example code
- `AddJobButton.jsx` - Redundant wrapper around ActionButton
- `firebase-debug.js` - Debug file not needed in codebase

### Improved:
- Organized components by use case for better maintainability
- Updated all import paths to match new structure
- Simplified button components by using ActionButton directly
- Added comprehensive customer management system with CRUD operations
- Integrated customer data with job creation (auto-complete client names)
- **Unified Jobs & Bookings system**: Combined booking requests and job management into single workflow
- **Enhanced JobDetailsModal**: Now supports both jobs and bookings with appropriate field mapping
- **Smart routing**: Old `/worker/bookings` URL redirects to unified `/worker/jobs` page
- **Status transitions**: Bookings can be confirmed to automatically create jobs
