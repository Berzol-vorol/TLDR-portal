import {createContext, useState, useEffect, useContext} from 'react';
import axios from "axios";

export const UserContext = createContext({
  user: null,
  setUser: () => null,
  token: null,
  setToken: () => null
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = {
    user,
    setUser,
    token,
    setToken
  };

  return <UserContext.Provider value={value}>{ children }</UserContext.Provider>;
}

export const useAuth = () => {
  return useContext(UserContext);
};
