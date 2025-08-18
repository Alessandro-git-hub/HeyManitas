import React, { useState } from 'react';
import { 
  useStripe, 
  useElements, 
  CardElement,
  Elements 
} from '@stripe/react-stripe-js';
import { stripePromise } from '../../utils/stripe';

// Card Element styling to match your app
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: false,
};

// Payment Form Component
const PaymentForm = ({ 
  booking, 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: booking.customerName || 'Customer',
          email: booking.customerEmail,
          phone: booking.phone,
          address: {
            line1: booking.address,
          },
        },
      });

      if (paymentError) {
        throw paymentError;
      }

      // For now, we'll simulate payment success
      // In production, you'd create a payment intent on your backend
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call success callback with payment details
      onPaymentSuccess({
        paymentMethodId: paymentMethod.id,
        amount: amount,
        status: 'succeeded',
        created: Date.now(),
      });

    } catch (err) {
      setError(err.message);
      onPaymentError?.(err);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Service: {booking.serviceType}</span>
            <span>${booking.hourlyRate}/hour</span>
          </div>
          <div className="flex justify-between">
            <span>Duration: 1 hour</span>
            <span>${booking.hourlyRate}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Service Fee (5%)</span>
            <span>${(booking.hourlyRate * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 font-semibold flex justify-between">
            <span>Total</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing || isProcessing}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          processing || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {processing || isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        🔒 Your payment information is secure and encrypted
      </p>
    </form>
  );
};

// Wrapper component with Stripe Elements provider
const PaymentFormWrapper = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentFormWrapper;
