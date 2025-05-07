import React from 'react';
import RecipeCard from './recipecard';

const mockRecipes = [
  { 
    id: 1,
    name: 'Chicken Biryani', 
    likes: 160,
    time: '45 mins',
    difficulty: 'Medium'
  },
  { 
    id: 2,
    name: 'Masala Dosa', 
    likes: 320,
    time: '30 mins',
    difficulty: 'Easy'
  },
  { 
    id: 3,
    name: 'Paneer Tikka', 
    likes: 200,
    time: '25 mins',
    difficulty: 'Easy'
  },
];

const RecipeList = () => {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-8">Popular Recipes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipeList;