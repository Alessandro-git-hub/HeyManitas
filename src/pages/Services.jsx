import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import WorkerNavigation from '../components/WorkerNavigation';
import WorkerHeader from '../components/WorkerHeader';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  // const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    duration: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Service categories
  const serviceCategories = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Handyman',
    'Home Repair',
    'Painting',
    'Gardening',
    'Auto Repair',
    'HVAC',
    'Carpentry',
    'Other'
  ];

  // Test data - we'll use this initially
  const testServices = useMemo(() => [
    {
      id: 'test-1',
      name: 'Basic Plumbing Repair',
      description: 'Fix leaky faucets, unclog drains, minor pipe repairs',
      category: 'Plumbing',
      basePrice: 75,
      duration: '1-2 hours',
      isActive: true,
      createdAt: new Date('2025-01-20')
    },
    {
      id: 'test-2', 
      name: 'Electrical Installation',
      description: 'Install light fixtures, outlets, switches, and basic wiring',
      category: 'Electrical',
      basePrice: 120,
      duration: '2-3 hours',
      isActive: true,
      createdAt: new Date('2025-01-18')
    },
    {
      id: 'test-3',
      name: 'Home Deep Cleaning',
      description: 'Complete house cleaning including bathrooms, kitchen, and all rooms',
      category: 'Cleaning',
      basePrice: 150,
      duration: '4-6 hours',
      isActive: true,
      createdAt: new Date('2025-01-15')
    },
    {
      id: 'test-4',
      name: 'Furniture Assembly',
      description: 'Assemble furniture, mount TVs, hang pictures and shelves',
      category: 'Handyman',
      basePrice: 60,
      duration: '1-3 hours',
      isActive: false,
      createdAt: new Date('2025-01-10')
    }
  ], []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Fetch services from Firestore
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        
        // If no services exist in Firestore, add test data
        if (servicesData.length === 0) {
          console.log('No services found in Firestore. Adding test data...');
          const addPromises = testServices.map(async (service) => {
            // eslint-disable-next-line no-unused-vars
            const { id, ...serviceData } = service; // Remove the test id
            const docRef = await addDoc(collection(db, 'services'), serviceData);
            return { id: docRef.id, ...serviceData };
          });
          
          const addedServices = await Promise.all(addPromises);
          setServices(addedServices);
        } else {
          setServices(servicesData);
        }
        
      } catch (error) {
        console.error('Error fetching services:', error);
        setFeedback({ message: 'Error loading services. Please try again.', type: 'error' });
        // Fallback to test data if Firestore fails
        setServices(testServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [testServices]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Service name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required'; 
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
    }
    if (!formData.duration.trim()) {
      errors.duration = 'Duration is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingService) {
        // Update existing service in Firestore
        const serviceData = {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          updatedAt: new Date()
        };
        
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
        
        // Update local state
        const updatedServices = services.map(service =>
          service.id === editingService.id
            ? { ...service, ...serviceData }
            : service
        );
        setServices(updatedServices);
        setFeedback({ message: 'Service updated successfully!', type: 'success' });
      } else {
        // Add new service to Firestore
        const serviceData = {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'services'), serviceData);
        const newService = { id: docRef.id, ...serviceData };
        
        // Update local state
        setServices(prev => [newService, ...prev]);
        setFeedback({ message: 'Service added successfully!', type: 'success' });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      setFeedback({ message: 'Error saving service. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'services', serviceId));
      
      // Update local state
      const updatedServices = services.filter(service => service.id !== serviceId);
      setServices(updatedServices);
      setFeedback({ message: 'Service deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting service:', error);
      setFeedback({ message: 'Error deleting service. Please try again.', type: 'error' });
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice.toString(),
      duration: service.duration,
      isActive: service.isActive
    });
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      duration: '',
      isActive: true
    });
    setFormErrors({});
  };

  const toggleServiceStatus = (serviceId) => {
    const updatedServices = services.map(service =>
      service.id === serviceId
        ? { ...service, isActive: !service.isActive, updatedAt: new Date() }
        : service
    );
    setServices(updatedServices);
    setFeedback({ 
      message: 'Service status updated successfully!', 
      type: 'success' 
    });
  };

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <WorkerHeader />
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <WorkerNavigation />
          <h1 className="text-3xl font-bold mb-6 text-gray-900">My Services</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <WorkerHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Worker Navigation Tabs */}
        <WorkerNavigation />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add New Service
          </button>
        </div>

        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback({ message: '', type: '' })}
                className={`text-sm hover:opacity-70 ml-4 ${
                  feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onToggleStatus={toggleServiceStatus}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first service offering.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Service
            </button>
          </div>
        )}

        {/* Service Form Modal */}
        {showForm && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmitting) {
                handleCloseModal();
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                      placeholder="e.g., Basic Plumbing Repair"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.category ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                    >
                      <option value="">Select a category</option>
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price (€) *
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        min="0"
                        step="0.01"
                        className={`w-full p-3 border rounded-lg ${
                          formErrors.basePrice ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                        placeholder="75"
                      />
                      {formErrors.basePrice && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.basePrice}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`w-full p-3 border rounded-lg ${
                          formErrors.duration ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                        placeholder="1-2 hours"
                      />
                      {formErrors.duration && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      rows="3"
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                      placeholder="Describe what this service includes..."
                    ></textarea>
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Service is active</span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
