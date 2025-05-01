import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Ai.css';
import {
  FiSearch, FiStar, FiHeart, FiClock, FiHome,
  FiBook, FiTrendingUp, FiHelpCircle, FiUser, FiSend
} from 'react-icons/fi';
import logo from '../assetss/images/recipe-genie-logo.jpg';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const recentChats = [
    'How can I increase the number of servings?',
    'What\'s the best approach to baking a cake?',
    'Which ingredients to use for vegan pasta?'
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { text: trimmed, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiMessage = { text: data.message, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble thinking right now. Try again soon!",
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Recipe Genie Logo" className="logo" />
          <h1>Recipe Genie</h1>
        </div>

        <div className="chat-options">
          <div className="option"><FiSearch /> Search</div>
          <div className="option"><FiStar /> Category</div>
          <div className="option">General</div>
          <div className="option"><FiStar /> Top Rated</div>
          <div className="option"><FiHeart /> Liked by you</div>
          <div className="option"><FiClock /> Ingredient Scaling</div>
        </div>

        <div className="recent-chats">
          <h3>Recent Chats</h3>
          {recentChats.map((chat, i) => (
            <div key={i} className="chat-item" onClick={() => setInput(chat)}>
              {chat}
            </div>
          ))}
        </div>

        <div className="user-profile">
          <button className="user-profile-button" onClick={() => navigate('/profile')}>
            <FiUser className="icon" /> User Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="chat-container">
          <div className="assistance-section">
            <h2>How can we assist you today?</h2>
            <p>Get expert guidance powered by AI agents specializing in recipe finding, ingredient scaling, and cooking tactics.</p>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="features-grid">
                <FeatureCard icon={<FiHome />} title="Ingredient Alternatives" text="Find home substitute ingredients for your recipes" />
                <FeatureCard icon={<FiBook />} title="Cooking Tactics" text="Learn professional skills and best practices" />
                <FeatureCard icon={<FiTrendingUp />} title="Top Insights" text="Discover the top posts on the app" />
                <FeatureCard icon={<FiHelpCircle />} title="General Support" text="Need help with something easy? Ask away, we'll guide you." />
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    ref={i === messages.length - 1 ? messagesEndRef : null}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '18px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      backgroundColor: msg.sender === 'user' ? '#FF6B35' : '#FFE5D4',
                      color: msg.sender === 'user' ? 'white' : '#2D3436',
                      marginLeft: msg.sender === 'user' ? 'auto' : '0',
                      marginRight: msg.sender === 'user' ? '0' : 'auto',
                      maxWidth: '70%',
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="input-section">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your cooking question here..."
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? <FiClock className="spin" /> : <FiSend />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable feature card
function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;