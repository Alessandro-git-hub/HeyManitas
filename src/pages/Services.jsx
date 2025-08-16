import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAllCategories, getCategoryInfo } from '../utils/serviceCategories';
import WorkerNavigation from '../components/layout/WorkerNavigation';
import WorkerHeader from '../components/layout/WorkerHeader';
import ServiceCard from '../components/service/ServiceCard';
import EmptyState from '../components/common/EmptyState';
import FormModal from '../components/common/FormModal';

export default function Services() {
  // const navigate = useNavigate();
  const { user } = useAuth();
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
  const serviceCategories = getAllCategories();

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return; // Don't fetch if no user
      
      try {
        setLoading(true);
        
        // Fetch services from Firestore for the current user
        const q = query(collection(db, 'services'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const servicesData = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        
        setServices(servicesData);
        
      } catch (error) {
        console.error('Error fetching services:', error);
        setFeedback({ message: 'Error loading services. Please try again.', type: 'error' });
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

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
          userId: user.uid, // Associate service with current user
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

  const toggleServiceStatus = async (serviceId) => {
    try {
      // Find the service to get its current status
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const newStatus = !service.isActive;
      
      // Update in Firestore
      await updateDoc(doc(db, 'services', serviceId), {
        isActive: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      const updatedServices = services.map(service =>
        service.id === serviceId
          ? { ...service, isActive: newStatus, updatedAt: new Date() }
          : service
      );
      setServices(updatedServices);
      
      setFeedback({ 
        message: `Service ${newStatus ? 'activated' : 'deactivated'} successfully!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      setFeedback({ 
        message: 'Error updating service status. Please try again.', 
        type: 'error' 
      });
    }
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
          <EmptyState
            icon={
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
            }
            title="No services yet"
            description="Start by adding your first service offering."
            buttonText="Add Your First Service"
            onButtonClick={() => setShowForm(true)}
          />
        )}

        {/* Service Form Modal */}
        <FormModal
          isOpen={showForm}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          title={editingService ? 'Edit Service' : 'Add New Service'}
          size="lg"
          isSubmitting={isSubmitting}
          submitLabel={editingService ? 'Update Service' : 'Add Service'}
          cancelLabel="Cancel"
        >
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
              {serviceCategories.map(category => {
                const categoryInfo = getCategoryInfo(category);
                return (
                  <option key={category} value={category}>
                    {categoryInfo.icon} {category} - {categoryInfo.description}
                  </option>
                );
              })}
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

          <div className="mb-4">
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
        </FormModal>
      </div>
    </div>
  );
}
