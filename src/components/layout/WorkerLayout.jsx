import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WorkerHeader from './WorkerHeader';
import WorkerNavigation from './WorkerNavigation';
import { AuthLoadingState, PageLoadingState } from '../common/LoadingState';
import { useFeedback } from '../../hooks/useFeedback';

/**
 * Worker Layout Component
 * 
 * A standardized layout wrapper for all worker pages that provides:
 * - Consistent page structure and styling
 * - Authentication checks and loading states
 * - Header and navigation placement
 * - Feedback message system
 * - Container sizing and responsive behavior
 * 
 * Props:
 * @param {ReactNode} children - Page content to render
 * @param {string} title - Page title (optional, for SEO/accessibility)
 * @param {boolean} showNavigation - Whether to show worker navigation tabs (default: true)
 * @param {Object} feedback - Feedback message object {message: string, type: 'success'|'error'}
 * @param {function} onClearFeedback - Callback to clear feedback message
 * @param {boolean} loading - Page-specific loading state (default: false)
 * @param {string} loadingText - Custom loading text (default: "Loading...")
 * @param {string} className - Additional CSS classes for content area
 * @param {ReactNode} headerActions - Optional header action buttons/content
 */
export default function WorkerLayout({
  children,
  title,
  showNavigation = true,
  loading = false,
  loadingText = "Loading...",
  className = '',
  headerActions
}) {
  const { user, loading: authLoading } = useAuth();
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  // Auto-clear feedback messages after 5 seconds
  useEffect(() => {
    if (feedback?.message) {
      const timer = setTimeout(() => {
        clearFeedback();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback, clearFeedback]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return <AuthLoadingState />;
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Set page title if provided */}
      {title && (
        <title>{`${title} - SkillBooster Worker`}</title>
      )}
      
      {/* Header */}
      <WorkerHeader />
      
      {/* Main Content Container */}
      <div className={`max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 ${className}`}>
        {/* Worker Navigation */}
        {showNavigation && <WorkerNavigation />}
        
        {/* Header Actions */}
        {headerActions && (
          <div className="mb-6">
            {headerActions}
          </div>
        )}
        
        {/* Feedback Message */}
        {feedback?.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{feedback.message}</span>
              <button
                onClick={clearFeedback}
                className={`text-sm hover:opacity-70 ml-4 ${
                  feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Page Content */}
        {loading ? (
          <PageLoadingState text={loadingText} />
        ) : (
          typeof children === 'function' ? children(showFeedback) : children
        )}
      </div>
    </div>
  );
}
