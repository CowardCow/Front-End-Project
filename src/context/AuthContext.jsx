import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Default admin credentials always guaranteed
const DEFAULT_USERS = {
  admin: 'password'
};

// Safe helper to read users from localStorage
const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem('users');
    if (!raw) {
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
      return { ...DEFAULT_USERS };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
      return { ...DEFAULT_USERS };
    }
    // Always ensure admin is available
    if (!parsed.admin) {
      parsed.admin = 'password';
      localStorage.setItem('users', JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to parse users from localStorage, resetting to default:', err);
    try {
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    } catch (e) {}
    return { ...DEFAULT_USERS };
  }
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem('currentUser') || '';
    } catch (e) {
      return '';
    }
  });

  // Ensure localStorage is initialized on load
  useEffect(() => {
    getStoredUsers();
  }, []);

  const login = (usernameInput, passwordInput) => {
    const username = (usernameInput || '').trim();
    const password = (passwordInput || '').trim();

    if (!username || !password) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    // Direct check for default admin
    if (username.toLowerCase() === 'admin' && password === 'password') {
      try {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', 'admin');
      } catch (e) {}
      setIsLoggedIn(true);
      setCurrentUser('admin');
      return { success: true, message: 'Welcome back, admin!' };
    }

    const users = getStoredUsers();

    // Case-insensitive lookup
    const matchingKey = Object.keys(users).find(
      key => key.toLowerCase() === username.toLowerCase()
    );

    if (matchingKey && users[matchingKey] === password) {
      try {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', matchingKey);
      } catch (e) {}
      setIsLoggedIn(true);
      setCurrentUser(matchingKey);
      return { success: true, message: `Welcome back, ${matchingKey}!` };
    }

    return {
      success: false,
      message: 'Invalid username or password. (Default: admin / password)'
    };
  };

  const signup = (usernameInput, passwordInput) => {
    const username = (usernameInput || '').trim();
    const password = (passwordInput || '').trim();

    if (!username || !password) {
      return { success: false, message: 'Username and password cannot be empty.' };
    }

    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (username.toLowerCase() === 'admin') {
      return { success: false, message: 'Username "admin" already exists. Please choose a different username.' };
    }

    const users = getStoredUsers();

    // Check if user already exists (case-insensitive)
    const exists = Object.keys(users).some(
      key => key.toLowerCase() === username.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'Username already exists. Please choose a different one.' };
    }

    // Save new user
    users[username] = password;
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (err) {
      return { success: false, message: 'Failed to write to localStorage. Storage may be full.' };
    }

    return {
      success: true,
      message: `Account "${username}" created successfully! You can now log in.`
    };
  };

  const logout = () => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    } catch (e) {}
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
