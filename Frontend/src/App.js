import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import RecipeDetail from './pages/recipedetail';
import Profile from './pages/Profile'; 
import ShareRecipeForm from './pages/sharerecipe';
import PProfile from './pages/pprofile';
import UserSearch from './pages/usersearch';
import Login from './pages/login';
import Register from './pages/register';
import AIChat from './pages/Ai'; // Import AI chat component
import DocumentationPage from './pages/DocumentationPage'; // Import DocumentationPage component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/sharerecipe" element={<ShareRecipeForm />} />
        <Route path="/usersearch" element={<UserSearch />} />
        <Route path="/pprofile/:userId" element={<PProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbot" element={<AIChat />} /> {/* AI chat route */}
        <Route path="/documentation" element={<DocumentationPage />} /> {/* Documentation page route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;