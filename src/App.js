/*import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
//import Login from './pages/login';
//import Register from './pages/register'; // Add this import


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import RecipeDetail from './pages/recipedetail';
import Profile from './pages/Profile'; // or wherever you create it
import ShareRecipeForm from'./pages/sharerecipe';
import UserSearch from './pages/usersearch';
//import Login from './pages/login';
//import Register from './pages/register'; // Add this import


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/sharerecipe" element={<ShareRecipeForm />} />
        <Route path="/usersearch" element={<UserSearch />} />
        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;