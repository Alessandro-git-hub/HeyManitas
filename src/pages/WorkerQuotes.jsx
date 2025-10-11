import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import WorkerLayout from '../components/layout/WorkerLayout';
import EmptyState from '../components/common/EmptyState';
import QuoteCard from '../components/quote/QuoteCard';
import { useBookingRequests } from '../hooks/useBookingRequests';
import { useQuoteManagement } from '../hooks/useQuoteManagement';

export default function WorkerQuotes() {
  const { user } = useAuth();
  const { bookingRequests, loading, fetchBookingRequests } = useBookingRequests(user);
  const {
    activeQuoteId,
    getQuoteForm,
    updateQuoteForm,
    toggleQuote,
    cancelQuote,
    submitQuote,
    declineRequest
  } = useQuoteManagement(bookingRequests, fetchBookingRequests);



  const renderContent = (showFeedback) => {
    return (
      <>
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Quote Requests</h1>
            <p className="text-lg text-primary-700">Review and respond to booking requests</p>
          </div>
        </div>

        {/* Quote Requests List */}
        {bookingRequests.length === 0 ? (
          <div className="text-center py-16">
            <EmptyState
              icon={
                <svg className="w-16 h-16 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              }
              title="No pending quote requests"
              description="When customers request your services, they'll appear here for you to review and quote."
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3" style={{ gridAutoRows: 'max-content' }}>
            {bookingRequests.map((request) => {
              const isActiveQuote = activeQuoteId === request.id;
              const quoteForm = getQuoteForm(request.id);

              return (
                <QuoteCard
                  key={request.id}
                  request={request}
                  isActive={isActiveQuote}
                  quoteForm={quoteForm}
                  onToggleQuote={toggleQuote}
                  onUpdateForm={(updates) => updateQuoteForm(request.id, updates)}
                  onSubmitQuote={(quoteId) => submitQuote(quoteId, showFeedback)}
                  onDeclineRequest={(quoteId) => declineRequest(quoteId, showFeedback)}
                  onCancelQuote={() => cancelQuote(request.id)}
                />
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <WorkerLayout
      title="Quote Requests"
      loading={loading}
    >
      {renderContent}
    </WorkerLayout>
  );
}
