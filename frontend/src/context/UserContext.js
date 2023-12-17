import {createContext, useState, useContext, } from 'react';
import Cookies from 'js-cookie';

export const UserContext = createContext({
  user: null,
  setUser: () => null,
  token: null,
  setToken: () => null,
  logout: () => {}
});

export const UserProvider = ({ user: _user, token: _token, children }) => {
  const [user, setUser] = useState(_user);
  const [token, setToken] = useState(_token);

  const value = {
    user,
    setUser,
    token,
    setToken,
    logout: () => {
      setUser(null);
      setToken(null);
      Cookies.remove("token");
    }
  };

  return <UserContext.Provider value={value}>{ children }</UserContext.Provider>;
}

export const useAuth = () => {
  return useContext(UserContext);
};

export const useLoggedIn = () => {
  const state = useAuth();
  return !!state.user
};