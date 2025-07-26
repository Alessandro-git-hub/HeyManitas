import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkerHeader({ userName = 'Juan' }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex justify-between items-center gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <button 
              onClick={() => navigate('/')}
              className="text-xl md:text-2xl font-bold text-deep hover:text-blue-800 transition-colors cursor-pointer flex-shrink-0"
            >
              SkillBooster
            </button>
            <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">Worker Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            <span className="text-xs md:text-sm text-gray-600 hidden md:inline">Welcome back, {userName}</span>
            <span className="text-xs md:text-sm text-gray-600 md:hidden">{userName}</span>
            <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700 flex-shrink-0">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
