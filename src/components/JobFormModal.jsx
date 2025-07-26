import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getCategoryInfo } from '../utils/serviceCategories';

export default function JobFormModal({ 
  isOpen, 
  onClose, 
  editingJob = null, 
  onSuccess,
  onError 
}) {
  const [formData, setFormData] = useState({
    client: '',
    description: '',
    status: 'Pending',
    scheduledDate: '',
    serviceId: '',
    serviceName: '',
    basePrice: '',
    finalPrice: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Fetch available services from Firestore
  useEffect(() => {
    if (isOpen) {
      const fetchServices = async () => {
        setLoadingServices(true);
        try {
          const querySnapshot = await getDocs(collection(db, 'services'));
          const servicesData = [];
          querySnapshot.forEach((doc) => {
            const service = { 
              id: doc.id, 
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date()
            };
            // Only include active services
            if (service.isActive) {
              servicesData.push(service);
            }
          });
          setAvailableServices(servicesData);
        } catch (error) {
          console.error('Error fetching services:', error);
          setAvailableServices([]);
        } finally {
          setLoadingServices(false);
        }
      };
      
      fetchServices();
    }
  }, [isOpen]);

  // Initialize form data when modal opens or editing job changes
  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        setFormData({
          client: editingJob.client || '',
          description: editingJob.description || '',
          status: editingJob.status || 'Pending',
          scheduledDate: editingJob.scheduledDate || '',
          serviceId: editingJob.serviceId || '',
          serviceName: editingJob.serviceName || '',
          basePrice: editingJob.basePrice?.toString() || '',
          finalPrice: editingJob.finalPrice?.toString() || ''
        });
      } else {
        setFormData({
          client: '',
          description: '',
          status: 'Pending',
          scheduledDate: '',
          serviceId: '',
          serviceName: '',
          basePrice: '',
          finalPrice: ''
        });
      }
      setFormErrors({});
    }
  }, [isOpen, editingJob]);

  const validateForm = () => {
    const errors = {};
    if (!formData.client.trim()) {
      errors.client = 'Client name is required';
    }
    if (!formData.serviceId) {
      errors.serviceId = 'Please select a service';
    }
    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }
    if (!formData.scheduledDate) {
      errors.scheduledDate = 'Scheduled date is required';
    }
    if (!formData.finalPrice || formData.finalPrice <= 0) {
      errors.finalPrice = 'Final price must be greater than 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const selectedService = availableServices.find(service => service.id === serviceId);
    
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        serviceId: serviceId,
        serviceName: selectedService.name,
        basePrice: selectedService.basePrice.toString(),
        finalPrice: selectedService.basePrice.toString() // Default final price to base price
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviceId: '',
        serviceName: '',
        basePrice: '',
        finalPrice: ''
      }));
    }
    
    // Clear service selection error
    if (formErrors.serviceId) {
      setFormErrors(prev => ({ ...prev, serviceId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const jobData = {
        client: formData.client,
        description: formData.description,
        status: formData.status,
        scheduledDate: formData.scheduledDate,
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        basePrice: parseFloat(formData.basePrice),
        finalPrice: parseFloat(formData.finalPrice)
      };

      if (editingJob) {
        // Update existing job
        const jobRef = doc(db, 'jobs', editingJob.id);
        await updateDoc(jobRef, {
          ...jobData,
          updatedAt: new Date()
        });
        onSuccess('Job updated successfully!');
      } else {
        // Create new job
        await addDoc(collection(db, 'jobs'), {
          ...jobData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        onSuccess('Job added successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
      onError('Error saving job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  formErrors.client ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                placeholder="Enter client name"
                autoFocus={!editingJob}
              />
              {formErrors.client && (
                <p className="text-red-500 text-sm mt-1">{formErrors.client}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service *
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleServiceChange}
                disabled={isSubmitting || loadingServices}
                className={`w-full p-3 border rounded-lg ${
                  formErrors.serviceId ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
              >
                <option value="">Select a service</option>
                {availableServices.map(service => {
                  const categoryInfo = getCategoryInfo(service.category);
                  return (
                    <option key={service.id} value={service.id}>
                      {categoryInfo.icon} {service.name} - €{service.basePrice} ({service.category})
                    </option>
                  );
                })}
              </select>
              {formErrors.serviceId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.serviceId}</p>
              )}
              {loadingServices && (
                <p className="text-gray-500 text-sm mt-1">Loading services...</p>
              )}
            </div>

            {formData.serviceId && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">Base Price:</span>
                  <span className="text-blue-900 font-semibold">€{formData.basePrice}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Price (€) *
                </label>
                <input
                  type="number"
                  name="finalPrice"
                  value={formData.finalPrice}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                  className={`w-full p-3 border rounded-lg ${
                    formErrors.finalPrice ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                  placeholder="Final quoted price"
                />
                {formErrors.finalPrice && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.finalPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  formErrors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
              />
              {formErrors.scheduledDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.scheduledDate}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows="4"
                className={`w-full p-3 border rounded-lg ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
                placeholder="Describe the job details, requirements, and any important notes..."
              ></textarea>
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editingJob ? 'Update Job' : 'Add Job')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4 text-center">Press ESC to cancel</p>
        </div>
      </div>
    </div>
  );
}
