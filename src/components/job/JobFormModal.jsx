import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { getCategoryInfo } from '../../utils/serviceCategories';
import FormModal from '../common/FormModal';

export default function JobFormModal({ 
  isOpen, 
  onClose, 
  editingJob = null, 
  onSuccess,
  onError 
}) {
  const { user } = useAuth();
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
  const [availableCustomers, setAvailableCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Fetch available services and customers from Firestore
  useEffect(() => {
    if (isOpen && user) {
      const fetchServicesAndCustomers = async () => {
        setLoadingServices(true);
        setLoadingCustomers(true);
        try {
          // Fetch services from Firestore for the current user
          const servicesQuery = query(collection(db, 'services'), where('userId', '==', user.uid));
          const servicesSnapshot = await getDocs(servicesQuery);
          const servicesData = [];
          servicesSnapshot.forEach((doc) => {
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

          // Fetch customers from Firestore for the current user (show all customers for job selection)
          const customersQuery = query(collection(db, 'customers'), where('userId', '==', user.uid));
          const customersSnapshot = await getDocs(customersQuery);
          const allCustomers = [];
          customersSnapshot.forEach((doc) => {
            allCustomers.push({ 
              id: doc.id, 
              ...doc.data()
            });
          });

          // Sort customers by name
          allCustomers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          setAvailableCustomers(allCustomers);
        } catch (error) {
          console.error('Error fetching services and customers:', error);
          setAvailableServices([]);
          setAvailableCustomers([]);
        } finally {
          setLoadingServices(false);
          setLoadingCustomers(false);
        }
      };
      
      fetchServicesAndCustomers();
    }
  }, [isOpen, user]);

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
      // Check if customer exists, and create if new
      let newCustomerCreated = false;
      const customerName = formData.client.trim();
      if (customerName) {
        const existingCustomer = availableCustomers.find(
          customer => customer.name.toLowerCase() === customerName.toLowerCase()
        );
        
        if (!existingCustomer) {
          // Create new customer record
          try {
            await addDoc(collection(db, 'customers'), {
              name: customerName,
              email: '',
              phone: '',
              company: '',
              address: '',
              notes: editingJob 
                ? `Auto-created from editing job: ${formData.description || 'Job'}`
                : `Auto-created from job: ${formData.description || 'New job'}`,
              userId: user.uid,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            newCustomerCreated = true;
          } catch (customerError) {
            console.warn('Failed to auto-create customer:', customerError);
            // Continue with job creation even if customer creation fails
          }
        }
      }

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
        
        const successMessage = newCustomerCreated 
          ? `Job updated successfully! New customer "${customerName}" was also created.`
          : 'Job updated successfully!';
        onSuccess(successMessage);
      } else {
        // Create new job
        await addDoc(collection(db, 'jobs'), {
          ...jobData,
          userId: user.uid, // Associate job with current user
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        const successMessage = newCustomerCreated 
          ? `Job added successfully! New customer "${customerName}" was also created.`
          : 'Job added successfully!';
        onSuccess(successMessage);
      }
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
      onError('Error saving job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove the ESC key handling and modal visibility logic since FormModal handles it
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingJob ? 'Edit Job' : 'Add New Job'}
      size="lg"
      isSubmitting={isSubmitting}
      submitLabel={editingJob ? 'Update Job' : 'Add Job'}
      cancelLabel="Cancel"
    >
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
          list="customers-list"
          className={`w-full p-3 border rounded-lg ${
            formErrors.client ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 ${
            loadingCustomers ? 'bg-gray-50' : ''
          }`}
          placeholder="Enter or select client name (new clients will be saved automatically)"
          autoFocus={!editingJob}
        />
        <datalist id="customers-list">
          {!loadingCustomers && availableCustomers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.company && `${customer.name} (${customer.company})`}
            </option>
          ))}
        </datalist>
        {formErrors.client && (
          <p className="text-red-500 text-sm mt-1">{formErrors.client}</p>
        )}
        {!loadingCustomers && availableCustomers.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Start typing to see existing clients or enter a new name (will be saved automatically)
          </p>
        )}
        {!loadingCustomers && availableCustomers.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Enter client name - new customers will be saved automatically
          </p>
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
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50`}
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
        {!loadingServices && availableServices.length === 0 && (
          <p className="text-gray-500 text-sm mt-1">
            No services available. <button 
              type="button"
              onClick={() => {
                onClose();
                // Navigate to services page - you might want to pass this as a prop
                window.location.href = '/worker/services';
              }}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Create your first service
            </button>
          </p>
        )}
      </div>

      {formData.serviceId && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary-700 font-medium">Base Price:</span>
            <span className="text-primary-900 font-semibold">€{formData.basePrice}</span>
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
            } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50`}
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
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
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50`}
        />
        {formErrors.scheduledDate && (
          <p className="text-red-500 text-sm mt-1">{formErrors.scheduledDate}</p>
        )}
      </div>

      <div className="mb-4">
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
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50`}
          placeholder="Describe the job details, requirements, and any important notes..."
        ></textarea>
        {formErrors.description && (
          <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
        )}
      </div>
    </FormModal>
  );
}
