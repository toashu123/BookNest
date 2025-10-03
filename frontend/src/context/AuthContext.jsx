import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data on mount or token change
      fetchUser();
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/me');
      console.log('Fetched user data:', data.user); // Debug log
      
      // Ensure user object has 'id' field for consistency
      const userData = {
        ...data.user,
        id: data.user._id || data.user.id // Normalize to 'id'
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
      name,
      email,
      password
    });
    
    // Normalize user data
    const userData = {
      ...data.user,
      id: data.user._id || data.user.id
    };
    
    setToken(data.token);
    setUser(userData);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    // Normalize user data
    const userData = {
      ...data.user,
      id: data.user._id || data.user.id
    };
    
    setToken(data.token);
    setUser(userData);
    return data;
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
