# Service Components

This directory contains modular, reusable components for handling service-related functionality across the application.

## Components

### Core Components

- **`ServiceSearchSection.jsx`** - Search input with styling for finding services
- **`PopularServicesSection.jsx`** - Popular services carousel/grid with responsive design
- **`ServicesGrid.jsx`** - Main grid display for all service categories
- **`ServiceCategoryCard.jsx`** - Individual service category card with hover effects
- **`ServiceCard.jsx`** - Worker dashboard service card (existing)
- **`NoServicesFound.jsx`** - Empty state when no services match search criteria

### Utilities

- **`serviceHelpers.js`** - Pure functions for service data transformation and navigation
  - `getServiceCategories()` - Converts SERVICE_CATEGORIES to array format
  - `filterServices()` - Filters services based on search term
  - `createServiceNavigation()` - Navigation helper for authenticated/unauthenticated users

## Design Principles

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be used across different pages
3. **Maintainability** - Clear separation of concerns and consistent patterns
4. **Scalability** - Easy to extend with new features and variations

## Usage

### Basic Import
```jsx
import { ServiceSearchSection, ServicesGrid } from '../components/service';
```

### Individual Imports
```jsx
import ServiceSearchSection from '../components/service/ServiceSearchSection';
import { getServiceCategories } from '../components/service/serviceHelpers';
```

## Styling Conventions

- Uses consistent Tailwind classes
- Primary color scheme: `primary-700`, `secondary-600`
- Brown accent colors: `#6F4E37`, `#f4dfb8`
- Hover effects and transitions for interactive elements
- Responsive design with mobile-first approach

## File Structure

```
src/components/service/
├── index.js                     # Barrel exports
├── README.md                    # This file
├── ServiceSearchSection.jsx     # Search functionality
├── PopularServicesSection.jsx   # Popular services display
├── ServicesGrid.jsx            # Main services grid
├── ServiceCategoryCard.jsx     # Individual service cards
├── ServiceCard.jsx             # Worker dashboard card (existing)
├── NoServicesFound.jsx         # Empty state
└── serviceHelpers.js           # Utility functions
```
