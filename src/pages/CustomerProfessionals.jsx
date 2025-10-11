import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { SERVICE_CATEGORIES } from '../utils/serviceCategories';
import AppHeader from '../components/layout/AppHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';

const CustomerProfessionals = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mapping for category backgrounds
  const colorMap = {
    primary: '#3B82F6',
    yellow: '#EAB308',
    green: '#10B981',
    orange: '#F97316',
    purple: '#8B5CF6',
    pink: '#EC4899',
    emerald: '#10B981',
    red: '#EF4444',
    cyan: '#06B6D4',
    amber: '#F59E0B',
    gray: '#6B7280'
  };

  const categoryName = location.state?.categoryName || 'Services';
  
  // Convert categoryId back to category name and get category info
  const categoryKey = Object.keys(SERVICE_CATEGORIES).find(key => 
    key.toLowerCase().replace(/\s+/g, '-') === categoryId
  );
  const category = categoryKey ? {
    id: categoryId,
    name: categoryKey,
    ...SERVICE_CATEGORIES[categoryKey]
  } : null;

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        
        // Convert categoryId back to the original category name for database query
        if (!categoryKey) {
          setProfessionals([]);
          setLoading(false);
          return;
        }

        // Query for services in this category
        console.log('🔍 Searching for services in category:', categoryKey);
        const servicesQuery = query(
          collection(db, 'services'),
          where('category', '==', categoryKey),
          where('isActive', '==', true)
        );
        
        const servicesSnapshot = await getDocs(servicesQuery);
        console.log('📊 Found services:', servicesSnapshot.size);
        
        if (servicesSnapshot.empty) {
          console.log('❌ No services found for category:', categoryKey);
          setProfessionals([]);
          setLoading(false);
          return;
        }

        // Get unique user IDs and their services
        const userServicesMap = new Map();
        servicesSnapshot.docs.forEach(doc => {
          const serviceData = doc.data();
          const userId = serviceData.userId;
          
          if (!userServicesMap.has(userId)) {
            userServicesMap.set(userId, []);
          }
          userServicesMap.get(userId).push({
            id: doc.id,
            ...serviceData
          });
        });

        const userIds = Array.from(userServicesMap.keys());
        
        if (userIds.length === 0) {
          setProfessionals([]);
          setLoading(false);
          return;
        }

        // Fetch user profiles for all service providers
        const professionalProfiles = [];
        
        for (const userId of userIds) {
          try {            
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              const userServices = userServicesMap.get(userId);
              
              // Calculate average price from user's services in this category
              const prices = userServices
                .map(service => parseFloat(service.basePrice))
                .filter(price => !isNaN(price));
              const avgPrice = prices.length > 0 
                ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
                : Math.floor(Math.random() * 50) + 30; // fallback

              professionalProfiles.push({
                id: userId,
                name: userData.displayName || userData.name || 'Professional',
                email: userData.email || '',
                rating: (4 + Math.random()).toFixed(1),
                reviewCount: Math.floor(Math.random() * 50) + 5,
                location: userData.location || 'Local Area',
                experience: userData.experience || `${Math.floor(Math.random() * 10) + 2} years`,
                hourlyRate: avgPrice,
                avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || 'User')}&background=random`,
                specialties: userServices.map(service => service.name),
                description: userData.bio || `Experienced ${categoryName.toLowerCase()} professional with expertise in residential and commercial projects.`,
                availability: ['Available Today', 'Available This Week', 'Busy'][Math.floor(Math.random() * 3)],
                services: userServices
              });
            }
          } catch (userError) {
            console.error(`Error fetching user ${userId}:`, userError);
          }
        }

        setProfessionals(professionalProfiles);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProfessionals();
    }
  }, [categoryId, categoryName, categoryKey]);

  const handleBookProfessional = (professional) => {
    navigate('/customer/book', {
      state: {
        professional,
        categoryName
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professionals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => navigate('/customer/services')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <CustomerNavigation />
        
        {/* Page Title */}
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-3">
            {category && (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                style={{ backgroundColor: colorMap[category.color] || colorMap.gray }}
              >
                {category.icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categoryName} Professionals</h1>
              <p className="text-gray-600">
                Found {professionals.length} {categoryName.toLowerCase()} professionals in your area
              </p>
            </div>
          </div>
        </div>

        {/* Professionals Grid */}
        {professionals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <div key={professional.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Professional Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{professional.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaStar className="text-yellow-400" />
                        <span>{professional.rating}</span>
                        <span>({professional.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <FaMapMarkerAlt />
                        <span>{professional.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800">
                      ${professional.hourlyRate}/hr
                    </div>
                    <div className="text-sm text-gray-500">
                      {professional.experience}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {professional.description}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <span className={`inline-flex px-3 py-1 text-xs rounded-full ${
                    professional.availability === 'Available Today' 
                      ? 'bg-green-100 text-green-700'
                      : professional.availability === 'Available This Week'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {professional.availability}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookProfessional(professional)}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Book Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaPhone />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaEnvelope />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No professionals found
            </h3>
            <p className="text-gray-500 mb-4">
              There are currently no professionals available for {categoryName.toLowerCase()} services.
            </p>
            
            <button
              onClick={() => navigate('/customer/services')}
              className="text-primary-600 hover:text-primary-700 font-medium mt-4"
            >
              Browse other services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfessionals;
