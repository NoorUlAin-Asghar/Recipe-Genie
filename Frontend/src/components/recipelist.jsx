/*import React from 'react';
import RecipeCard from './recipecard';

const mockRecipes = [
  { name: 'Chicken', likes: 160, image: '/images/chicken.png' },
  { name: 'Biriyani', likes: 100, image: '/images/biryani.png' },
 // { name: 'Masala Dosa', likes: 120, image: '/images/dosa.jpg' },
 // { name: 'Paneer Tikka', likes: 200, image: '/images/paneer.jpg' },
];

const RecipeList = () => {
  return (
    <section className="p-8">
      <h3 className="text-center text-2xl font-semibold mb-6">Popular Recipes</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockRecipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};

export default RecipeList;*/

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