import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WorkerDashboard from './pages/WorkerDashboard';
import Jobs from './pages/Jobs';
import Services from './pages/Services';
import Clients from './pages/Clients';
import CustomerServices from './pages/CustomerServices';
import CustomerProfessionals from './pages/CustomerProfessionals';
import CustomerBooking from './pages/CustomerBooking';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/customer/services" element={<CustomerServices />} />
            <Route path="/customer/professionals/:categoryId" element={<CustomerProfessionals />} />
            <Route path="/customer/book" element={<CustomerBooking />} />
            <Route 
              path="/worker" 
              element={<WorkerDashboard />} 
            />
            {/* Redirect old bookings route to unified jobs page */}
            <Route 
              path="/worker/bookings" 
              element={<Navigate to="/worker/jobs" replace />} 
            />
            <Route 
              path="/worker/jobs" 
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker/clients" 
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
