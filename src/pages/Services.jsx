import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAllCategories, getCategoryInfo } from '../utils/serviceCategories';
import WorkerLayout from '../components/layout/WorkerLayout';
import ServiceCard from '../components/service/ServiceCard';
import EmptyState from '../components/common/EmptyState';
import StyledFormModal from '../components/common/StyledFormModal';
import FormField from '../components/common/FormField';
import { useFormValidation, ValidationRules } from '../hooks/useFormValidation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Service categories
  const serviceCategories = getAllCategories();

  // Form validation
  const validationRules = {
    name: ValidationRules.requiredText('Service name'),
    description: ValidationRules.requiredText('Description'),
    category: ValidationRules.requiredText('Category'),
    basePrice: ValidationRules.positiveNumber('Base price'),
    duration: ValidationRules.requiredText('Duration')
  };

  const { errors: formErrors, validateForm: validateFormFields, clearFieldError, clearAllErrors } = useFormValidation(validationRules);

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
    return validateFormFields(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      clearFieldError(name);
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
    clearAllErrors();
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">My Services</h1>
            <p className="text-lg text-primary-700">Manage your service offerings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-secondary-600 text-primary-700 px-6 py-3 rounded-3xl hover:bg-secondary-700 transition-all duration-200 font-medium transform hover:scale-105 shadow-lg"
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
            <div className="text-center py-16">
              <EmptyState
                icon={
                  <svg className="w-16 h-16 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
          )}

        {/* Service Form Modal */}
        <StyledFormModal
          isOpen={showForm}
          onClose={handleCloseModal}
          onSubmit={(e) => handleSubmit(e, showFeedback)}
          title={editingService ? 'Edit Service' : 'Add New Service'}
          size="lg"
          isSubmitting={isSubmitting}
          submitLabel={editingService ? 'Update Service' : 'Add Service'}
          cancelLabel="Cancel"
        >
          <FormField
            label="Service Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            disabled={isSubmitting}
            required={true}
            placeholder="e.g., Basic Plumbing Repair"
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={handleInputChange}
            error={formErrors.category}
            disabled={isSubmitting}
            required={true}
            options={[
              { value: '', label: 'Select a category' },
              ...serviceCategories.map(category => {
                const categoryInfo = getCategoryInfo(category);
                return {
                  value: category,
                  label: `${category} - ${categoryInfo.description}`
                };
              })
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Base Price (€)"
              name="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={handleInputChange}
              error={formErrors.basePrice}
              disabled={isSubmitting}
              required={true}
              min="0"
              step="0.01"
              placeholder="75"
            />

            <FormField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              error={formErrors.duration}
              disabled={isSubmitting}
              required={true}
              placeholder="1-2 hours"
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            error={formErrors.description}
            disabled={isSubmitting}
            required={true}
            rows="3"
            placeholder="Describe what this service includes..."
          />

          <FormField
            label="Service is active"
            name="isActive"
            type="checkbox"
            value={formData.isActive}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </StyledFormModal>
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
