import React from 'react';

const steps = [
  {
    icon: '🔍',
    title: '1. Search & Browse',
    description: 'Find the perfect professional for your needs by browsing our verified service providers.'
  },
  {
    icon: '📅',
    title: '2. Book & Schedule',
    description: 'Choose your preferred time and date. Our professionals will confirm your booking instantly.'
  },
  {
    icon: '✅',
    title: '3. Get It Done',
    description: 'Sit back and relax while our qualified professionals complete your task to perfection.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get your tasks done in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
