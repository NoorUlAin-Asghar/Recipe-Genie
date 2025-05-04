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
  export const deleteRecipe=(recipeId)=>API.delete(`/recipes/${recipeId}`);
  export const getPopularRecipes=()=>API.get('/recipes/popular');
  export const searchRecipe= (query) => API.get(`/recipes/search/by-title?title=${query}`);
  export const getRecipe=(recipeId)=>API.get(`/recipes/${recipeId}`)
  export const getAllRecipesOfAUser = (userId) => API.get(`/recipes/userRecipes/${userId}`);

  export const searchUserByName = (query)=>API.get(`users/search/by-name?name=${query}`);
  export const searchUserByUsername = (query)=>API.get(`users/search/by-username?username=${query}`);
  export const getUserProfile=(userId)=>API.get(`/users/userProfile/${userId}`)
  export const getProfile = (userId) => API.get(`/users/profile/${userId}`);
  export const updateMyProfile = (data) => API.patch('/users/myProfile', data) ;

  export const createComment=(recipeId,data)=>API.post(`/comments/${recipeId}`,data);

  export const followingStatus=(userId)=>API.get(`/users/is-following/${userId}`);
  export const followUser=(userId)=>API.patch(`/users/follow/${userId}`);
  export const unfollowUser=(userId)=>API.patch(`/users/unfollow/${userId}`);

  export const getFollowers=(userId)=>API.get(`/users/followers/${userId}`);
  export const getFollowing=(userId)=>API.get(`/users/following/${userId}`);
  // Toggle like/unlike on a recipe
export const toggleLike = (recipeId) => API.post(`/recipes/${recipeId}/like`);

  //export const likeRecipe = (id) => API.post(`/recipes/${id}/like`);