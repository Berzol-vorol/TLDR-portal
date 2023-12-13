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
  const [token, setToken_] = useState(localStorage.getItem("token"));

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
    }
  }, [token]);

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
