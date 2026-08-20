import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || '';
  });

  useEffect(() => {
    // Seed default admin user if not present
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify({ admin: 'password' }));
    }
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username] === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', username);
      setIsLoggedIn(true);
      setCurrentUser(username);
      return { success: true, message: `Welcome back, ${username}!` };
    }
    return { success: false, message: 'Invalid username or password. (Default: admin / password)' };
  };

  const signup = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      return { success: false, message: 'Username already exists. Please choose a different one.' };
    }
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful! You can now log in.' };
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
