import React from 'react';

export default function QuoteForm({ request, quoteForm, onUpdateForm, onSubmitQuote, onCancel }) {
  return (
    <div className="flex-1">
      <div className="bg-primary-600 p-4 rounded-lg">
        <h4 className="font-bold text-white mb-4">Send Quote</h4>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-secondary-600 mb-1">
              Quote Amount (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={quoteForm.quotedPrice}
              onChange={(e) => onUpdateForm({ quotedPrice: e.target.value })}
              className="w-full px-3 py-2 border border-white rounded-md text-white"
              placeholder="150.00"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-secondary-600 mb-1">
              Valid Until (optional)
            </label>
            <input
              type="date"
              value={quoteForm.validUntil}
              onChange={(e) => onUpdateForm({ validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-white rounded-md text-white [color-scheme:dark]"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-secondary-600 mb-1">
            Message to Customer
          </label>
          <textarea
            value={quoteForm.message}
            onChange={(e) => onUpdateForm({ message: e.target.value })}
            className="w-full px-3 py-2 border border-white rounded-md text-white"
            rows="3"
            placeholder="Thank you for your request. Based on your requirements, I can complete this service for..."
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onSubmitQuote(request.id)}
            className="bg-secondary-600 text-primary-700 px-6 py-3 rounded-3xl font-medium cursor-pointer"
          >
            Send Quote
          </button>
          <button
            onClick={onCancel}
            className="text-white hover:text-secondary-600 px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}