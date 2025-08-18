import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with local professionals.<br />
              <span className="text-primary-600">Get things done.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Whether you need work done or you're a professional looking to grow your business - 
              SkillBooster brings customers and skilled workers together.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => navigate('/login?userType=worker')}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                I'm a Professional
              </button>
              <button 
                onClick={() => navigate('/login?userType=customer')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                I Need Work Done
              </button>
            </div>

            {/* Popular Services Carousel */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <p className="text-sm text-gray-500 mb-4">Popular services:</p>
              <div className="relative overflow-hidden">
                <div className="flex space-x-4 animate-scroll">
                  {/* First set */}
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔧</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Plumbing</p>
                        <p className="text-xs text-gray-500">Repairs & Installation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">⚡</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Electrical</p>
                        <p className="text-xs text-gray-500">Wiring & Fixtures</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🧹</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Cleaning</p>
                        <p className="text-xs text-gray-500">Home & Office</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔨</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Handyman</p>
                        <p className="text-xs text-gray-500">General Repairs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🏠</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Home Repair</p>
                        <p className="text-xs text-gray-500">Maintenance & Fixes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎨</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Painting</p>
                        <p className="text-xs text-gray-500">Interior & Exterior</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🌿</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Gardening</p>
                        <p className="text-xs text-gray-500">Landscaping & Care</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🚗</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Auto Repair</p>
                        <p className="text-xs text-gray-500">Mobile Service</p>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate set for seamless loop */}
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔧</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Plumbing</p>
                        <p className="text-xs text-gray-500">Repairs & Installation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">⚡</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Electrical</p>
                        <p className="text-xs text-gray-500">Wiring & Fixtures</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🧹</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Cleaning</p>
                        <p className="text-xs text-gray-500">Home & Office</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔨</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Handyman</p>
                        <p className="text-xs text-gray-500">General Repairs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🏠</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Home Repair</p>
                        <p className="text-xs text-gray-500">Maintenance & Fixes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎨</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Painting</p>
                        <p className="text-xs text-gray-500">Interior & Exterior</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🌿</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Gardening</p>
                        <p className="text-xs text-gray-500">Landscaping & Care</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-white px-4 py-3 rounded-lg border shadow-sm min-w-max">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🚗</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Auto Repair</p>
                        <p className="text-xs text-gray-500">Mobile Service</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-left">
            How it works
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-left">
            Simple for everyone:
          </p>
          
          {/* For Customers */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
              👤 For Customers
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">1️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Tell us what you need</h4>
                  <p className="text-gray-600">
                    Describe your project - plumbing, electrical, cleaning, or any home service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">2️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Get matched with professionals</h4>
                  <p className="text-gray-600">
                    We connect you with qualified local professionals who can do the job.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">3️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Get it done</h4>
                  <p className="text-gray-600">
                    Schedule the work, track progress, and pay securely when it's complete.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
              🔧 For Professionals
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">1️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Set up your profile</h4>
                  <p className="text-gray-600">
                    Show your skills, experience, and the areas you serve.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">2️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Manage your jobs</h4>
                  <p className="text-gray-600">
                    Track appointments, organize your schedule, and never miss a job.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-lg">3️⃣</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1 text-gray-900">Grow your business</h4>
                  <p className="text-gray-600">
                    Get more customers, create quotes, and build your reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-left">
            Why choose SkillBooster?
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-left">
            We make it easy for everyone to get things done.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">👤 For Customers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Verified professionals</h4>
                    <p className="text-gray-600 text-sm">
                      All workers are background-checked and rated by previous customers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Fair pricing</h4>
                    <p className="text-gray-600 text-sm">
                      Get transparent quotes and only pay when the work is done right.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📞</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Easy communication</h4>
                    <p className="text-gray-600 text-sm">
                      Message your professional directly and track your project's progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Professionals */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">🔧 For Professionals</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Mobile-first tools</h4>
                    <p className="text-gray-600 text-sm">
                      Manage everything from your phone - jobs, schedule, and customer communication.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">👥</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">More customers</h4>
                    <p className="text-gray-600 text-sm">
                      Get connected with local customers who need your services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Business insights</h4>
                    <p className="text-gray-600 text-sm">
                      Track your earnings, manage your schedule, and grow your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-left">
            What people are saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Testimonial */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👩‍💼</span>
                  </div>
                </div>
                <div>
                  <blockquote className="text-gray-700 mb-3">
                    "Found an amazing electrician through SkillBooster. The whole process was smooth and I felt safe knowing they were verified."
                  </blockquote>
                  <p className="text-gray-500 text-sm">— Maria, Customer from Barcelona</p>
                </div>
              </div>
            </div>

            {/* Professional Testimonial */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍🔧</span>
                  </div>
                </div>
                <div>
                  <blockquote className="text-gray-700 mb-3">
                    "I used to write everything on paper and lose half of it. Now I can see all my jobs in one place and actually grow my business."
                  </blockquote>
                  <p className="text-gray-500 text-sm">— Carlos, Plumber from Madrid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of customers and professionals already using SkillBooster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              I'm a Professional
            </button>
            <button 
              onClick={() => navigate('/customer/profile')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              I Need Work Done
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">SkillBooster</h3>
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Help</a>
              <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2025 SkillBooster. Connecting customers and professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}