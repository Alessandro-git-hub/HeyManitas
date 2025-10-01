import React from "react";
import { useNavigate } from "react-router-dom";
import { getServiceCategories } from "../service/serviceHelpers";
import { getCategoryInfo } from "../../utils/serviceCategories";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import SectionHeader from "../common/SectionHeader";
import ServiceIcon from "../common/ServiceIcon";

export default function PopularServices() {
  const navigate = useNavigate();
  const serviceCategories = getServiceCategories();

  // Use the scroll animation hook
  useScrollAnimation(".service-card", 50);

  return (
    <section className="pt-16 pb-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <style jsx>{`
        .service-card {
          opacity: 0;
          transition: all 0.5s ease;
          transform: scale(0.95);
        }

        .service-card.active {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <SectionHeader
          title="Popular Services"
          subtitle="Most requested services in your area"
          titleClassName="text-primary-700 text-4xl md:text-5xl"
          subtitleClassName="text-primary-700 text-lg"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {serviceCategories.slice(0, 12).map((category) => {
            const categoryInfo = getCategoryInfo(category.name);

            return (
              <button
                key={category.name}
                onClick={() => navigate(`/services?category=${category.name}`)}
                className="service-card bg-primary-700 p-4 rounded-2xl shadow-sm border border-secondary-600 hover:shadow-xl text-left group hover:border-primary-300 relative overflow-hidden transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Subtle accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <ServiceIcon category={category.name} />
                    <h3 className="font-bold text-lg text-secondary-600">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-sm text-white">
                    {categoryInfo.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-auto flex justify-end">
                    <div className="w-10 h-6 rounded-full bg-secondary-600 group-hover:bg-primary-100 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
