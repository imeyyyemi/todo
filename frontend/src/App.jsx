import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Register from './components/Register';
import Login from './components/Login';
import TodoList from './components/TodoList';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState('login');
  const [username, setUsername] = useState('');

  const handleLogin = (token) => {
    // Extract username from token (format: jwt-token-USERNAME)
    if (token && token.startsWith('jwt-token-')) {
      const extractedUsername = token.substring('jwt-token-'.length);
      setUsername(extractedUsername);
    }
    setToken(token);
    setView('todos');
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setView('login');
  };

  const handleRegister = () => {
    setView('login');
  };

  const handleSignUp = () => {
    setView('register');
  };

  const handleSignIn = () => {
    setView('login');
  };

  const handleProfileClick = () => {
    setView('profile');
  };

  const handleBackToTasks = () => {
    setView('todos');
  };

  return (
    <ThemeProvider theme={theme}>
      {token ? (
        view === 'profile' ? (
          <Profile token={token} username={username} onBack={handleBackToTasks} />
        ) : (
          <TodoList token={token} username={username} onLogout={handleLogout} onProfileClick={handleProfileClick} />
        )
      ) : view === 'login' ? (
        <Login onLogin={handleLogin} onSignUpClick={handleSignUp} />
      ) : (
        <Register onRegister={handleRegister} onSignInClick={handleSignIn} />
      )}
    </ThemeProvider>
  );
}

export default App;

