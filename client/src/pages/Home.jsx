import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home({ user, onLogout }) {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🧠</div>
          <h2>MindCare AI</h2>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">Hi, {user?.name?.split(' ')[0] || 'there'}</span>
          <button className="navbar-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <p className="hero-greeting">{getGreeting()} 👋</p>
          <h1 className="hero-title">
            Your safe space for <span className="accent">mental wellness</span>
          </h1>
          <p className="hero-description">
            Talk to our AI companion about your feelings, get coping strategies, 
            and find the emotional support you deserve — anytime, anywhere.
          </p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={() => navigate('/chat')}>
              Start Talking →
            </button>
            <button className="cta-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-orb-wrapper">
          <div className="orb"></div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">💬</div>
            <h3>Empathetic Conversations</h3>
            <p>Talk openly in a judgment-free space. Our AI listens and validates your feelings with compassion.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon pink">🛡️</div>
            <h3>Safe & Private</h3>
            <p>Your conversations are private and secure. Built-in crisis detection connects you to real help when needed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">🌱</div>
            <h3>Coping Strategies</h3>
            <p>Get gentle, evidence-based coping techniques tailored to what you're going through right now.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        Not a substitute for professional help. If you're in crisis, call <strong>988</strong> (Suicide & Crisis Lifeline).
      </footer>
    </div>
  );
}

export default Home;
