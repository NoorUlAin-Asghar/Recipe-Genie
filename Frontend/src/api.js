import axios from 'axios';

const API = axios.create({ baseURL: '' });

// Add auth token to headers if using authentication
API.interceptors.request.use((req) => {
    const user = localStorage.getItem('profile');
    if (user) {
      req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return req;
  });
  
  export const loginUser=(formData)=>API.post('/login',formData);
  export const registerUser=(formData)=>API.post('/register',formData);
  // Example calls:
  export const getMyUserProfile = () => API.get('/users/myProfile');
  export const updateUserProfile = (data) => API.put('/user/profile', data);
  export const getUserRecipes = () => API.get('/recipes/mine');
  export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
  export const likeRecipe = (id) => API.post(`/recipes/${id}/like`);