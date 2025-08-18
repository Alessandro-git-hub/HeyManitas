import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAllCategories, getCategoryInfo } from '../utils/serviceCategories';
import WorkerLayout from '../components/layout/WorkerLayout';
import ServiceCard from '../components/service/ServiceCard';
import EmptyState from '../components/common/EmptyState';
import FormModal from '../components/common/FormModal';

export default function Services() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
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
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      duration: '',
      isActive: true
    });
    setFormErrors({});
    setEditingService(null);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e, showFeedback) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        basePrice: parseFloat(formData.basePrice),
        duration: formData.duration.trim(),
        isActive: formData.isActive,
        userId: user.uid,
        updatedAt: new Date()
      };

      if (editingService) {
        // Update existing service
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
        
        // Update local state
        setServices(prev => prev.map(service => 
          service.id === editingService.id 
            ? { ...service, ...serviceData }
            : service
        ));
        
        showFeedback('Service updated successfully!', 'success');
      } else {
        // Add new service
        serviceData.createdAt = new Date();
        const docRef = await addDoc(collection(db, 'services'), serviceData);
        
        // Update local state
        setServices(prev => [...prev, { 
          id: docRef.id, 
          ...serviceData 
        }]);
        
        showFeedback('Service added successfully!', 'success');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      showFeedback('Error saving service. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId, showFeedback) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setServices(prev => prev.filter(service => service.id !== serviceId));
      showFeedback('Service deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting service:', error);
      showFeedback('Error deleting service. Please try again.', 'error');
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

  const toggleServiceStatus = async (serviceId, currentStatus, showFeedback) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'services', serviceId), { 
        isActive: newStatus,
        updatedAt: new Date()
      });
      
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: newStatus }
          : service
      ));
      
      showFeedback(
        `Service ${newStatus ? 'activated' : 'deactivated'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error('Error updating service status:', error);
      showFeedback(
        'Error updating service status. Please try again.',
        'error'
      );
    }
  };

  const renderContent = (showFeedback) => {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Add New Service
          </button>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={(serviceId) => handleDeleteService(serviceId, showFeedback)}
                onToggleStatus={(serviceId, currentStatus) => toggleServiceStatus(serviceId, currentStatus, showFeedback)}
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
          onSubmit={(e) => handleSubmit(e, showFeedback)}
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
      </>
    );
  };

  return (
    <WorkerLayout
      title="My Services"
      loading={loading}
    >
      {renderContent}
    </WorkerLayout>
  );
}
