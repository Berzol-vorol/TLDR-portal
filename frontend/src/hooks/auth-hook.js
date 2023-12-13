import { useState } from 'react';

export const useAuth = () => {
  const[userId, setUserId] = useState(null);
  const getUserId = () => {
    return localStorage.getItem('userId')
  }
  const login = (uid) => {
    setUserId(uid);
    localStorage.setItem('userId',uid);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null)
  };
  return { login, logout, getUserId };
};