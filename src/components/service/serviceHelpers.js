import { SERVICE_CATEGORIES } from '../../utils/serviceCategories';

/**
 * Service utilities for handling service categories and filtering
 */

// Convert SERVICE_CATEGORIES object to array format with consistent structure
export const getServiceCategories = () => {
  return Object.keys(SERVICE_CATEGORIES).map(key => ({
    id: key.toLowerCase().replace(/\s+/g, '-'),
    name: key,
    ...SERVICE_CATEGORIES[key]
  }));
};

// Filter services based on search term
export const filterServices = (categories, searchTerm) => {
  if (!searchTerm.trim()) {
    return categories;
  }

  const searchLower = searchTerm.toLowerCase();
  return categories.filter(category =>
    category.name.toLowerCase().includes(searchLower) ||
    category.description.toLowerCase().includes(searchLower)
  );
};

// Navigation helper for service selection
export const createServiceNavigation = (navigate, user) => {
  return (category) => {
    if (user) {
      // If user is logged in, go to professionals page
      navigate(`/customer/professionals/${category.id}`, { 
        state: { categoryName: category.name } 
      });
    } else {
      // If user is not logged in, redirect to login with return path
      navigate(`/login?userType=customer&returnTo=/customer/professionals/${category.id}`, {
        state: { categoryName: category.name }
      });
    }
  };
};

export default {
  getServiceCategories,
  filterServices,
  createServiceNavigation
};
