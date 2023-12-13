import {createContext, useState} from 'react';
import {useAuth} from "../hooks/auth-hook";

export const UserContext = createContext({
  user: null,
  setUser: () => null,
  getUserId: () => null,
  login: () => null,
  logout: () => null,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { login, logout, getUserId } = useAuth();
  const value = {
    user,
    setUser,
    getUserId,
    login,
    logout
  };

  return <UserContext.Provider value={value}>{ children }</UserContext.Provider>;
}