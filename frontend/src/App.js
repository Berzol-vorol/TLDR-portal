import './App.css';
import { useState, useEffect } from 'react';
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import Push_summary from "./pages/Push_summary"
import Summary from "./pages/Summary";
import Sign_in from "./pages/Sign_in"
import Sign_up from './pages/Sign_up';
import Protected from './pages/Protected';

import { UserProvider, useAuth } from './context/UserContext';

import { fetchUserByToken } from "./services/service";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const { user, setUser, token } = useAuth();

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            if (token) {
                const _user = fetchUserByToken(token);
                if (_user) {
                    setUser(_user);
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false);
                }
            }
            else setIsLoggedIn(false);
        }
    }, [user, token]);

    return (
    <UserProvider>
      <Router>
          <Routes>
            <Route path="/" exact element={<Feed />} />
            <Route path="/profile" element={
                <Protected isLoggedIn={isLoggedIn}>
                    <Profile />
                </Protected>
            }/>
            <Route path="/summary" element={<Summary />} />
            <Route path="/sign_in" element={<Sign_in />} />
            <Route path="/sign_up" element={<Sign_up />} />
            <Route path="/push_summary" element={
                <Protected isLoggedIn={isLoggedIn}>
                    <Push_summary />
                </Protected>
            }/>
          </Routes>
      </Router>
    </UserProvider>
    );
}

export default App;
