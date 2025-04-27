/*import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
//import Login from './pages/login';
//import Register from './pages/register'; 


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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import RecipeDetail from './pages/recipedetail';
import Profile from './pages/Profile'; 
import ShareRecipeForm from'./pages/sharerecipe';
import PProfile from './pages/pprofile';
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
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/sharerecipe" element={<ShareRecipeForm />} />
        <Route path="/usersearch" element={<UserSearch />} />
        <Route path="/pprofile/:userId" element={<PProfile />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />

        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;