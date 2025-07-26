// Service category configuration with icons and colors
export const SERVICE_CATEGORIES = {
  'Plumbing': {
    icon: '🔧',
    color: 'blue',
    description: 'Water systems, pipes, fixtures'
  },
  'Electrical': {
    icon: '⚡',
    color: 'yellow', 
    description: 'Wiring, lighting, outlets'
  },
  'Cleaning': {
    icon: '🧽',
    color: 'green',
    description: 'House, office, deep cleaning'
  },
  'Handyman': {
    icon: '🔨',
    color: 'orange',
    description: 'General repairs and maintenance'
  },
  'Home Repair': {
    icon: '🏠',
    color: 'purple',
    description: 'Structural and interior repairs'
  },
  'Painting': {
    icon: '🎨',
    color: 'pink',
    description: 'Interior and exterior painting'
  },
  'Gardening': {
    icon: '🌿',
    color: 'emerald',
    description: 'Landscaping and garden care'
  },
  'Auto Repair': {
    icon: '🚗',
    color: 'red',
    description: 'Vehicle maintenance and repair'
  },
  'HVAC': {
    icon: '🌡️',
    color: 'cyan',
    description: 'Heating, ventilation, air conditioning'
  },
  'Carpentry': {
    icon: '🪚',
    color: 'amber',
    description: 'Wood work and furniture'
  },
  'Other': {
    icon: '⚙️',
    color: 'gray',
    description: 'Specialized or miscellaneous services'
  }
};

// Helper function to get category info
export const getCategoryInfo = (categoryName) => {
  return SERVICE_CATEGORIES[categoryName] || SERVICE_CATEGORIES['Other'];
};

// Helper function to get all category names
export const getAllCategories = () => {
  return Object.keys(SERVICE_CATEGORIES);
};

// Helper function to get category styles
export const getCategoryStyles = (categoryName) => {
  const category = getCategoryInfo(categoryName);
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  
  return colorMap[category.color] || colorMap.gray;
};
