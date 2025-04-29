import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Navbar from '../components/navbar';
import LoadingScreen from '../components/loadingScreen'
import {createRecipe, updateRecipe, getRecipe} from '../api'
import '../sharerecipe.css';

const ShareRecipeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRecipe = location.state?.recipe || null; // 👈 get from navigation state
  const isEditing = location.state?.isEditing || false;
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    time: '',
    serving: '',
    ingredients: [''],
    instructions: [''],
    image: null,
    imagePreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [username, setUsername] = useState('');
  const [userId, setUserID] = useState('');
  const [loading, setLoading] = useState(true);   // Loading state to track data fetching

  useEffect(() => {
    // // Get username directly from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    // if (user?.data?.username) {
    //   setUsername(user.data.username);
    // }
    if(user?.data?.userid){
      setUserID(user.data.userid);
    }
  }, []);

  useEffect(() => {
    console.log('Recipe:', recipe);
  }, [recipe]);
  

  useEffect(() => {
    const fetchFullRecipe = async () => {
      if (!initialRecipe?._id) {
        // console.log(initialRecipe._id);
        setLoading(false);
        return; // Early return if not editing or no ID
      }
 
      try {
        const recipeResponse = await getRecipe(initialRecipe._id);
        const recipeData=recipeResponse.data;
        const fullRecipe = {
          name: recipeData.title,
          description: recipeData.description,
          time: recipeData.cookTime,
          serving: recipeData.serving,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          image: recipeData.image, 
        };
        console.log("full recipe:", fullRecipe)
        setRecipe(fullRecipe);
        setLoading(false);
      } catch (error) {
          console.error('Error fetching recipe:', error);
          setRecipe({
            ...initialRecipe,
            error: 'Failed to load recipe details'
          });
          setLoading(false);
        }
    };
  
    fetchFullRecipe();
  }, [initialRecipe]); // Only re-run if initialRecipe changes

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
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Update UI immediately
      setRecipe(prev => ({ 
        ...prev, 
        image: previewUrl,
        imageFile: file // Store the actual file for submission
      }));
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
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.data?.token;
  
      if (!token) {
        console.error('No token found. Please login again.');
        return;
      }
      const formData = new FormData();
      formData.append('title', recipeToSave.name.trim());
      formData.append('description', recipeToSave.description.trim());
      formData.append('cookTime', recipeToSave.time);
      formData.append('serving', recipeToSave.serving);
      formData.append('ingredients', JSON.stringify(recipeToSave.ingredients));
      formData.append('instructions', JSON.stringify(recipeToSave.instructions));
      if (recipeToSave.imageFile) {
        formData.append('image', recipeToSave.imageFile);
      }

      // Logging the initial recipe _id and formData
      //console.log('Initial Recipe ID:', initialRecipe._id);

      // Looping through FormData entries and logging them
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }


      if (isEditing) {
        const recipeId = initialRecipe._id; // initialRecipe._id depending on your backend
        const response = await updateRecipe(formData,recipeId);
        console.log(response);
        if (!response.data) {
          throw new Error('Updating recipe failed');
        }
        //await onSave(recipeToSave);
      } 
      else {
        const response = await createRecipe(formData);
        console.log(response);
        if (!response.data) {
          throw new Error('Creating recipe failed');
        }
        //await onSubmit?.(recipeToSave);
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
            <button className="share-recipe-submit-btn" onClick={() => navigate(`/profile/${userId}`)}>
              Go to My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  if (loading) {
    return <LoadingScreen/>
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
          <label>Serving</label>
          <input
            type="number"
            name="serving"
            className="share-recipe-servings"

            value={recipe.serving}
            onChange={handleChange}
            min="1"
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
                placeholder="ingredient        ,     quanity"

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
          <img
              src={recipe.image}
              alt="Recipe"
              className="share-recipe-image-preview"
          />
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
            onClick={() => navigate(-1)}
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