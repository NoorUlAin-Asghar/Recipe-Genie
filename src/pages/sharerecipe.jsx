

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../sharerecipe.css';

const ShareRecipeForm = ({ initialRecipe, onSave, onCancel, isEditing, onSubmit }) => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    time: '',
    ingredients: [''],
    instructions: [''],
    image: null,
    imagePreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form with recipe data when editing
  useEffect(() => {
    if (initialRecipe) {
      setRecipe({
        ...initialRecipe,
        ingredients: initialRecipe.ingredients.length > 0 
          ? initialRecipe.ingredients 
          : [''],
        instructions: initialRecipe.instructions.length > 0 
          ? initialRecipe.instructions 
          : [''],
        imagePreview: initialRecipe.image
      });
    }
  }, [initialRecipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe(prev => ({ 
      ...prev, 
      ingredients: newIngredients.length > 0 ? newIngredients : [''] 
    }));
  };

  const removeInstruction = (index) => {
    const newInstructions = [...recipe.instructions];
    newInstructions.splice(index, 1);
    setRecipe(prev => ({ 
      ...prev, 
      instructions: newInstructions.length > 0 ? newInstructions : [''] 
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecipe(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const recipeToSave = {
      ...recipe,
      ingredients: recipe.ingredients.filter(ing => ing.trim() !== ''),
      instructions: recipe.instructions.filter(inst => inst.trim() !== '')
    };

    try {
      if (isEditing) {
        await onSave(recipeToSave);
      } else {
        await onSubmit?.(recipeToSave);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="share-recipe-container">
        <Navbar />
        <div className="share-recipe-success">
          <h2>🎉 Recipe {isEditing ? 'Updated' : 'Shared'} Successfully!</h2>
          <div className="share-recipe-success-actions">
            <button className="share-recipe-submit-btn" onClick={() => navigate('/Profile')}>
              Go to My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="share-recipe-container">
      <Navbar />
      <h2>{isEditing ? 'Edit Recipe' : 'Share Your Recipe'}</h2>
      <form onSubmit={handleSubmit} className="share-recipe-form">
        <div className="share-recipe-form-group">
          <label>Recipe Name</label>
          <input
            type="text"
            name="name"
            className="share-recipe-input"

            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="share-recipe-form-group">
          <label>Description</label>
          <textarea
            name="description"
            className="share-recipe-textarea"

            value={recipe.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="share-recipe-form-group">
          <label>Cooking Time (minutes)</label>
          <input
            type="number"
            name="time"
            className="share-recipe-number"

            value={recipe.time}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="share-recipe-form-group">
          <label>Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="share-recipe-list-item">
              <input
                type="text"
                className="share-recipe-list-input"

                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
              />
              {recipe.ingredients.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeIngredient(index)}
                  className="share-recipe-remove-btn"
                >
                  ×
                </button>
              )}
              {index === recipe.ingredients.length - 1 && (
                <button 
                  type="button" 
                  onClick={addIngredient} 
                  className="share-recipe-add-btn"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="share-recipe-form-group">
          <label>Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="share-recipe-list-item">
              <textarea
                value={instruction}

                className="share-recipe-list-input"


                onChange={(e) => handleInstructionChange(index, e.target.value)}
                required
              />
              {recipe.instructions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeInstruction(index)}
                  className="share-recipe-remove-btn"
                >
                  ×
                </button>
              )}
              {index === recipe.instructions.length - 1 && (
                <button 
                  type="button" 
                  onClick={addInstruction} 
                  className="share-recipe-add-btn"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="share-recipe-form-group">
          <label>Recipe Image</label>
          <input
            type="file"
            className="share-recipe-input"

            accept="image/*"
            onChange={handleImageChange}
          />
          {recipe.imagePreview && (
            <img 
              src={typeof recipe.imagePreview === 'string' 
                ? recipe.imagePreview 
                : URL.createObjectURL(recipe.imagePreview)} 
              alt="Preview" 
              className="share-recipe-image-preview" 
            />
          )}
        </div>
        
        <div className="share-recipe-form-actions">
          <button 
            type="submit" 
            className="share-recipe-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>{isEditing ? 'Updating...' : 'Sharing...'}</span>
            ) : isEditing ? (
              'Update Recipe'
            ) : (
              'Share Recipe'
            )}
          </button>
          
          {/* Always visible Cancel button */ }
          <button 
            type="button" 
            className="share-recipe-cancel-btn"
            onClick={() => isEditing ? onCancel() : navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShareRecipeForm;