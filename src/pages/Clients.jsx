import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import AppHeader from '../components/layout/AppHeader';
import WorkerNavigation from '../components/layout/WorkerNavigation';
import CustomerCard from '../components/customer/CustomerCard';
import CustomerFormModal from '../components/customer/CustomerFormModal';
import CustomerDetailsModal from '../components/customer/CustomerDetailsModal';
import ActionButton from '../components/common/ActionButton';
import EmptyState from '../components/common/EmptyState';

export default function Clients() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Fetch customers from Firestore (show all customers, but mark those with jobs)
  const fetchCustomers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First, get all customers for this user
      const customersQuery = query(collection(db, 'customers'), where('userId', '==', user.uid));
      const customersSnapshot = await getDocs(customersQuery);
      const allCustomers = [];
      
      customersSnapshot.forEach((doc) => {
        allCustomers.push({ id: doc.id, ...doc.data() });
      });
      
      // Then, get all jobs for this user to find which customers have jobs
      const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
      const jobsSnapshot = await getDocs(jobsQuery);
      const customerNamesWithJobs = new Set();
      
      jobsSnapshot.forEach((doc) => {
        const job = doc.data();
        const clientName = job.client || job.clientName;
        if (clientName && clientName.trim()) {
          customerNamesWithJobs.add(clientName.toLowerCase().trim());
        }
      });
      
      // Add a flag to indicate if customer has jobs
      const customersWithJobInfo = allCustomers.map(customer => {
        const customerName = (customer.name || '').toLowerCase().trim();
        return {
          ...customer,
          hasJobs: customerNamesWithJobs.has(customerName)
        };
      });
      
      // Sort customers by name, but prioritize those with jobs
      customersWithJobInfo.sort((a, b) => {
        // First sort by hasJobs (true first), then by name
        if (a.hasJobs !== b.hasJobs) {
          return b.hasJobs - a.hasJobs; // true (1) comes before false (0)
        }
        return (a.name || '').localeCompare(b.name || '');
      });
      
      setCustomers(customersWithJobInfo);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setFeedback({ message: 'Failed to load customers', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add new customer
  const handleAddCustomer = async (customerData) => {
    try {
      await addDoc(collection(db, 'customers'), {
        ...customerData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setFeedback({ message: 'Customer added successfully!', type: 'success' });
      setShowCustomerForm(false);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Error adding customer:', error);
      setFeedback({ message: 'Failed to add customer', type: 'error' });
    }
  };

  // Update customer
  const handleUpdateCustomer = async (customerData) => {
    try {
      const customerRef = doc(db, 'customers', editingCustomer.id);
      await updateDoc(customerRef, {
        ...customerData,
        updatedAt: new Date()
      });
      
      setFeedback({ message: 'Customer updated successfully!', type: 'success' });
      setShowCustomerForm(false);
      setEditingCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Error updating customer:', error);
      setFeedback({ message: 'Failed to update customer', type: 'error' });
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'customers', customerId));
      setFeedback({ message: 'Customer deleted successfully!', type: 'success' });
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting customer:', error);
      setFeedback({ message: 'Failed to delete customer', type: 'error' });
    }
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  // Handle view customer details
  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  // Close modals
  const handleCloseModals = () => {
    setShowCustomerForm(false);
    setShowCustomerDetails(false);
    setSelectedCustomer(null);
    setEditingCustomer(null);
  };

  // Handle form submission
  const handleFormSubmit = (customerData) => {
    if (editingCustomer) {
      handleUpdateCustomer(customerData);
    } else {
      handleAddCustomer(customerData);
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

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="min-h-screen bg-light">
      <AppHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 mt-16">
        {/* Navigation */}
        <WorkerNavigation />

        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Clients</h1>
          <ActionButton onClick={() => setShowCustomerForm(true)}>
            Add New Client
          </ActionButton>
        </div>

        {/* Customer List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : customers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No clients yet"
            description="Add your first client to start managing customer information"
            actionText="Add Client"
            onAction={() => setShowCustomerForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onViewDetails={handleViewCustomerDetails}
              />
            ))}
          </div>
        )}

        {/* Customer Form Modal */}
        <CustomerFormModal
          isOpen={showCustomerForm}
          onClose={handleCloseModals}
          onSubmit={handleFormSubmit}
          customer={editingCustomer}
        />

        {/* Customer Details Modal */}
        <CustomerDetailsModal
          isOpen={showCustomerDetails}
          onClose={handleCloseModals}
          customer={selectedCustomer}
          onEdit={handleEditCustomer}
        />
      </div>
    </div>
  );
}
