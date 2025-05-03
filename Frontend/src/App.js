import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import RecipeDetail from './pages/recipedetail';
import Profile from './pages/Profile'; 
import ShareRecipeForm from'./pages/sharerecipe';
import UserSearch from './pages/usersearch';
import Login from './pages/login';
import Register from './pages/register'; 
import { ToastContainer } from 'react-toastify';


function App() {

  return (

    <BrowserRouter>
     <ToastContainer />  {/* This is required to display the toasts */}
      <Routes>
        <Route path="/"  element={<Navigate to="/login" />} />

        <Route path="/home" element={<Home/>} />
        <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
        <Route path="/profile/:userId" element={<Profile key="profile"/>} />
        <Route path="/sharerecipe" element={<ShareRecipeForm />} />
        <Route path="/usersearch" element={<UserSearch />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />

        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;