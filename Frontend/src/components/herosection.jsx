import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 py-16 px-4 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore your taste</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Fantastic food deserves a space that enhances its flavors, where every detail is crafted to delight and inspire.
      </p>
      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          placeholder="Search Recipes..."
          className="w-full py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;