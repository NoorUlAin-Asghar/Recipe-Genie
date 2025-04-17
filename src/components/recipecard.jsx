

import React from 'react';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {/* Placeholder for recipe image */}
        <span className="text-gray-500">Recipe Image</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h4 className="text-xl font-bold mb-2">{recipe.name}</h4>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            {recipe.difficulty}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-4">
          <span>⏱️ {recipe.time}</span>
          <span>❤️ {recipe.likes} likes</span>
        </div>
        <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors">
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;