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

  const handleSubmitQuote = async (quoteId, showFeedback) => {
    const result = await submitQuote(quoteId);
    if (result.success) {
      showFeedback('Quote sent successfully!', 'success');
    } else {
      showFeedback(result.error || 'Error sending quote. Please try again.', 'error');
    }
  };

  const handleDeclineRequest = async (quoteId, showFeedback) => {
    const result = await declineRequest(quoteId);
    if (result.success) {
      showFeedback('Booking request declined.', 'success');
    } else {
      showFeedback(result.error || 'Error declining request. Please try again.', 'error');
    }
  };

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
          <div className="text-center py-2">
            <EmptyState
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
                  onSubmitQuote={(quoteId) => handleSubmitQuote(quoteId, showFeedback)}
                  onDeclineRequest={(quoteId) => handleDeclineRequest(quoteId, showFeedback)}
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
