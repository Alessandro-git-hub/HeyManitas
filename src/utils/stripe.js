// Stripe configuration
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Stripe configuration options
export const stripeOptions = {
  // Customize appearance to match your app
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3b82f6', // Blue color matching your app
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      borderRadius: '8px',
    },
  },
  // Enable client-side validation
  clientSecret: null, // Will be set dynamically per payment
};

// Helper function to format currency
export const formatCurrency = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100); // Stripe uses cents
};

// Calculate booking totals
export const calculateBookingTotal = (hourlyRate, duration = 1, serviceFee = 0.05) => {
  const subtotal = hourlyRate * duration * 100; // Convert to cents
  const fee = Math.round(subtotal * serviceFee);
  const total = subtotal + fee;
  
  return {
    subtotal: subtotal,
    serviceFee: fee,
    total: total,
    subtotalFormatted: formatCurrency(subtotal),
    serviceFeeFormatted: formatCurrency(fee),
    totalFormatted: formatCurrency(total),
  };
};
