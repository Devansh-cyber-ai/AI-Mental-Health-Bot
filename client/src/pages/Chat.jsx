import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Chat({ user, onLogout }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: `Hi ${user?.name?.split(' ')[0] || 'there'} 👋 I'm here to listen. How are you feeling today?`, modelName: 'System', modelIcon: '🧠' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [availableModels, setAvailableModels] = useState([]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/chat/models', getAuthHeader());
        const models = response.data.models;
        setAvailableModels(models);
        if (models.length > 0 && !models.find(m => m.id === selectedModel)) {
          setSelectedModel(models[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
        // Fallback
        setAvailableModels([{ id: 'gemini', name: 'Gemini 2.0 Flash', icon: '✨' }]);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const currentModel = availableModels.find(m => m.id === selectedModel) || { id: 'gemini', name: 'Gemini', icon: '✨' };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt.trim();
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        prompt: userMessage,
        history: messages,
        model: selectedModel
      }, getAuthHeader());

      setMessages([...newMessages, {
        sender: "ai",
        text: response.data.reply,
        modelName: response.data.usedModelName || currentModel.name,
        modelIcon: response.data.usedModelIcon || currentModel.icon,
        usedModel: response.data.usedModel || selectedModel
      }]);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      console.error("Error connecting to server:", error);
      setMessages([...newMessages, {
        sender: "ai",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        modelName: 'System',
        modelIcon: '⚠️'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      {/* Top Navbar */}
      <nav className="chat-navbar">
        <button className="back-btn" onClick={() => navigate('/home')} title="Back to home">
          ←
        </button>
        <div className="chat-nav-icon">🧠</div>
        <div className="chat-nav-info">
          <h1>Mental Health Assistant</h1>
          <p>AI-powered emotional support</p>
        </div>

        {/* Model Selector */}
        <div className="model-selector" ref={dropdownRef}>
          <button
            className={`model-selector-btn ${isModelDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            title="Select AI Model"
          >
            <span className="model-icon">{currentModel.icon}</span>
            <span className="model-name">{currentModel.name}</span>
            <span className="model-chevron">{isModelDropdownOpen ? '▲' : '▼'}</span>
          </button>

          {isModelDropdownOpen && (
            <div className="model-dropdown">
              <div className="model-dropdown-header">Select AI Model</div>
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  className={`model-option ${model.id === selectedModel ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setIsModelDropdownOpen(false);
                  }}
                >
                  <span className="model-option-icon">{model.icon}</span>
                  <span className="model-option-name">{model.name}</span>
                  {model.id === selectedModel && <span className="model-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="status-dot" title="Online"></div>
      </nav>

      {/* Centered Chat Column */}
      <div className="chat-content">
        <div className="chat-box" id="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === 'ai' && msg.modelName && (
                <div className="model-badge">
                  <span>{msg.modelIcon}</span>
                  <span>{msg.modelName}</span>
                </div>
              )}
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={sendMessage} className="input-area">
          <input
            id="message-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading || !prompt.trim()} title="Send message">
            ➤
          </button>
        </form>
      </div>

      <div className="chat-disclaimer">
        Not a substitute for professional help. If in crisis, call <strong>988</strong>.
      </div>
    </div>
  );
}

export default Chat;
