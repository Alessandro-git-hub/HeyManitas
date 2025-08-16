import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaDollarSign } from 'react-icons/fa';
import CustomerHeader from '../components/layout/CustomerHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';

const CustomerCalendar = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'all', 'upcoming', 'past'

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsQuery = query(
        collection(db, 'customerCalendar'),
        where('customerId', '==', user.uid),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(appointmentsQuery);
      const appointmentsData = [];
      
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getFilteredAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      if (filter === 'upcoming') {
        return appointmentDate >= today;
      } else if (filter === 'past') {
        return appointmentDate < today;
      }
      return true; // 'all'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CustomerHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <CustomerNavigation />
        
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
            <p className="text-gray-600">View and manage your scheduled services</p>
          </div>
          <FaCalendarAlt className="text-3xl text-blue-600" />
        </div>
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'upcoming', label: 'Upcoming', count: appointments.filter(a => new Date(a.date) >= new Date().setHours(0,0,0,0)).length },
            { key: 'past', label: 'Past', count: appointments.filter(a => new Date(a.date) < new Date().setHours(0,0,0,0)).length },
            { key: 'all', label: 'All', count: appointments.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <FaCalendarAlt className="text-4xl text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {filter === 'all' ? '' : filter} appointments
            </h3>
            <p className="text-gray-600">
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments scheduled."
                : filter === 'past'
                ? "You don't have any past appointments."
                : "You haven't scheduled any appointments yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {appointment.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${appointment.amountPaid}
                    </div>
                    <div className="text-sm text-gray-500">Paid</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    {formatDate(appointment.date)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-green-500" />
                    {formatTime(appointment.time)} ({appointment.duration})
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUser className="mr-2 text-purple-500" />
                    {appointment.professionalName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {appointment.location || 'Location TBD'}
                  </div>
                </div>

                {appointment.description && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{appointment.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCalendar;
