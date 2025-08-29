import React from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '../common/ActionButton';

export default function WorkerCTA() {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join Our Network of Professionals
        </h2>
        <p className="text-xl mb-8 text-primary-100">
          Grow your business with a trusted platform that connects you with customers who need your services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <ActionButton
              variant="secondary"
              size="large"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Become a Professional
            </ActionButton>
          </Link>
          <Link to="/about">
            <ActionButton
              variant="outline"
              size="large"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Learn More
            </ActionButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
