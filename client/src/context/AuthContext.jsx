import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../config';

const AuthContext = createContext(null)

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const register = async (data) =>{
    try{
      const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return {success: true, data: res.data};
    } catch(err){
      return {success: false, error: err.response?.data?.message || "Registration Failed"};
    }
  }

  
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      
      const userData = res.data.data.user;

      setUser(userData)
      
      return { success: true, data: userData };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  }
  
  const logout = async () => {
    try{
      await axios.post(`${API_BASE_URL}/auth/logout`);
      setUser(null);
    } catch(err){
      console.error(err);
    }
  }
  
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}