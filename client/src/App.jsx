import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // On mount, check if there's a valid token for auto-login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setChecking(false));
  }, []);

  const handleAuth = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  // Show nothing while checking token validity
  if (checking) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login onAuth={handleAuth} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" /> : <Signup onAuth={handleAuth} />}
        />
        <Route
          path="/home"
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;