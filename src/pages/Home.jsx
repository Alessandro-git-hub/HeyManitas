import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import ServiceSearch from "../components/common/ServiceSearch";
import { getAllCategories, getCategoryInfo } from "../utils/serviceCategories";

export default function Home() {
  const navigate = useNavigate();
  const serviceCategories = getAllCategories();

  return (
    <div className="min-h-screen bg-white">
      <AppHeader showPublicNav={true} />

      {/* Hero Section */}
      <section
        className="pt-8 md:py-16 relative overflow-hidden"
        style={{ backgroundColor: "#f4dfb8" }}
      >
        {/* Waves: in front of image, behind text */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,165.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L0,320Z"
              fill="#e2c89f"
              fillOpacity="0.4"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            style={{ transform: "translateY(10px)" }}
          >
            <path
              d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L0,320Z"
              fill="#e2c89f"
              fillOpacity="0.2"
            />
          </svg>
        </div>

        {/* Grid: no z-index on the container */}
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-12 items-center">
            {/* Text above waves */}
            <div className="order-1 lg:order-1 relative z-30">
              <h1 className="text-3xl md:text-5xl font-bold text-primary-700 mb-6">
                Find trusted professionals for any home service
              </h1>
              <ServiceSearch />
            </div>

            {/* Image under waves */}
            <div className="order-2 lg:order-2 relative z-10 py-8">
              <img
                src="/HeroSectionImage.png"
                alt="Professional handyman at work"
                className="w-[300px] md:w-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600">
              Most requested services in your area
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceCategories.slice(0, 12).map((categoryName) => {
              const categoryInfo = getCategoryInfo(categoryName);
              return (
                <button
                  key={categoryName}
                  onClick={() => navigate(`/services?category=${categoryName}`)}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 text-center group hover:border-primary-200"
                >
                  <div className="text-4xl mb-3">{categoryInfo.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {categoryInfo.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. Search & Browse
              </h3>
              <p className="text-gray-600">
                Find the perfect professional for your needs by browsing our
                verified service providers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. Book & Schedule
              </h3>
              <p className="text-gray-600">
                Choose your preferred time and date. Our professionals will
                confirm your booking instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                3. Get It Done
              </h3>
              <p className="text-gray-600">
                Sit back and relax while our qualified professionals complete
                your task to perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Worker CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Are you a skilled professional?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of workers earning money on their schedule
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup?userType=worker")}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login?userType=worker")}
              className="text-white bg-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              <span className="text-secondary">Hey</span>
              <span className="text-primary">Manitas</span>
            </div>
            <p className="text-gray-400">
              Connecting customers with skilled professionals since 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
