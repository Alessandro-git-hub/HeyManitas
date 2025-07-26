import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WorkerDashboard from './pages/WorkerDashboard';
import Jobs from './pages/Jobs';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<Jobs />} />
          <Route path="/worker/services" element={<Services />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
