import axios from 'axios';

const API = axios.create({ baseURL: '' });

// Add auth token to headers if using authentication
API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.data?.token) {
      req.headers.Authorization = `Bearer ${user.data.token}`;
    }
  } catch (error) {
    console.error('Error parsing user token:', error);
  }
  return req;
});
  export const loginUser=(formData)=>API.post('/login',formData);
  export const registerUser=(formData)=>API.post('/register',formData);

  export const createRecipe=(formData)=>API.post('/recipes',formData);
  export const updateRecipe=(formData,recipeId)=>API.patch(`/recipes/${recipeId}`,formData);

  export const getPopularRecipes=()=>API.get('/recipes/popular');
  export const searchRecipe= (query) => API.get(`/recipes/search/by-title?title=${query}`);

  // Example calls:
  export const getMyUserProfile = () => API.get('/users/myProfile');
  export const updateUserProfile = (data) => API.put('/user/profile', data);
  export const getUserRecipes = () => API.get('/recipes/mine');
  // export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
  //export const likeRecipe = (id) => API.post(`/recipes/${id}/like`);